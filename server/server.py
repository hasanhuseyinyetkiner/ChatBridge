import asyncio
import json
import uuid
import os
import requests
from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.responses import PlainTextResponse, JSONResponse
from pydantic import BaseModel
import uvicorn
from typing import List, Optional, Dict

app = FastAPI()

# Cerebras Configuration
CEREBRAS_KEYS_FILE = "/home/hasanyetkiner/Desktop/chatbrowseruse/cerebras_keys.json"
CEREBRAS_BASE_URL = "https://api.cerebras.ai/v1/chat/completions"

# Aktif websocket bağlantısını ve istek bazlı kuyruğu tutacağız
active_socket: WebSocket | None = None
pending_requests: Dict[str, asyncio.Queue] = {}
legacy_queue: asyncio.Queue = asyncio.Queue()
current_key_index = 0

def load_cerebras_keys():
    try:
        if os.path.exists(CEREBRAS_KEYS_FILE):
            with open(CEREBRAS_KEYS_FILE, "r") as f:
                return json.load(f)
    except Exception as e:
        print(f"API Key yükleme hatası: {e}")
    return ["csk-w4xm8khw8pfmwy2hepmp2w9ew88w6vy2k4j5k5yjhhvtjeyh"] # Fallback

@app.get("/health")
async def health():
    """n8n veya dış sistemlerin extension bağlı mı kontrol etmesi için."""
    return {
        "status": "ok" if active_socket else "extension_disconnected",
        "extension_connected": active_socket is not None,
    }


class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    model: str = "gpt-3.5-turbo"
    messages: Optional[List[Message]] = None
    prompt: Optional[str] = None
    stream: bool = False


class BridgeCallback(BaseModel):
    """Extension'dan HTTP üzerinden geri bildirim almak için."""

    text: str
    request_id: str
    source: Optional[str] = None
    tab_id: Optional[int] = None

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global active_socket, pending_requests, legacy_queue
    print(f"Bağlantı isteği geldi: {websocket.client}")
    await websocket.accept()
    active_socket = websocket
    print("Browser Extension Bağlandı!")
    try:
        while True:
            msg = await websocket.receive()
            if msg.get("type") == "websocket.disconnect":
                break

            if "text" in msg:
                text = msg["text"]
                if text == "ping" or text == 'ping':
                    continue

                try:
                    data = json.loads(text)
                except Exception:
                    data = {"text": text}

                if data.get("text") == "ping":
                    continue

                print(f"Eklentiden mesaj geldi: {text[:50]}")

                request_id = data.get("request_id")
                if request_id and request_id in pending_requests:
                    await pending_requests[request_id].put(data)
                else:
                    await legacy_queue.put(data)
    except Exception as e:
        print(f"WebSocket Hatası: {e}")
    finally:
        print("Browser Extension Bağlantısı Koptu")
        active_socket = None


@app.post("/bridge/callback")
async def bridge_callback(cb: BridgeCallback):
    queue = pending_requests.get(cb.request_id)
    if queue is not None:
        await queue.put(
            {
                "text": cb.text,
                "request_id": cb.request_id,
                "source": (cb.source or "").lower(),
                "tab_id": cb.tab_id,
            }
        )
        return {"status": "queued"}
    return {"status": "ignored"}

async def call_cerebras(prompt: str, messages: List[Message] = None, model: str = "gpt-oss-120b"):
    global current_key_index
    keys = load_cerebras_keys()

    if not keys:
        return "Hata: Hiçbir Cerebras API anahtarı bulunamadı."

    if messages:
        cerebras_messages = [{"role": m.role, "content": m.content} for m in messages]
    else:
        cerebras_messages = [{"role": "user", "content": prompt}]

    payload = {
        "model": model,
        "messages": cerebras_messages
    }

    # Tüm anahtarları sırasıyla dene
    for _ in range(len(keys)):
        api_key = keys[current_key_index]
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        try:
            print(f"Denenen API Anahtarı (Index {current_key_index}): {api_key[:10]}...")
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: requests.post(CEREBRAS_BASE_URL, headers=headers, json=payload, timeout=30)
            )

            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"]
            elif response.status_code == 429:
                print(f"Limit doldu (Key {current_key_index}), bir sonrakine geçiliyor...")
                current_key_index = (current_key_index + 1) % len(keys)
                continue
            else:
                return f"Cerebras Hatası (HTTP {response.status_code}): {response.text}"

        except Exception as e:
            print(f"API Hatası (Key {current_key_index}): {str(e)}")
            current_key_index = (current_key_index + 1) % len(keys)
            continue

    return "Cerebras Hatası: Tüm API anahtarları denendi ancak yanıt alınamadı (Limit aşılmış olabilir)."

@app.post("/v1/chat/completions")
@app.post("/chat")
async def chat(request: ChatRequest):
    global active_socket, pending_requests, legacy_queue

    final_prompt = ""
    if request.messages:
        final_prompt = request.messages[-1].content
    else:
        final_prompt = request.prompt

    if not final_prompt:
        raise HTTPException(status_code=400, detail="Prompt bulunamadı.")

    m_lower = request.model.lower()
    is_cerebras = m_lower.startswith("cerebras") or m_lower.startswith("llama") or m_lower.startswith("gpt-oss") or m_lower.startswith("r1")

    if is_cerebras:
        model_name = request.model
        if "/" in model_name:
            model_name = model_name.split("/")[-1]

        model_map = {
            "cerebras": "llama3.1-8b",
            "gpt-oss": "gpt-oss-120b",
            "gptoss": "gpt-oss-120b",
            "llama": "llama3.1-8b",
            "llama70b": "llama-3.3-70b",
            "r1": "deepseek-r1-distill-llama-70b"
        }
        model_name = model_map.get(model_name.lower(), model_name)

        print(f"Cerebras kullanılıyor: {model_name}")
        content = await call_cerebras(final_prompt, request.messages, model_name)
        return PlainTextResponse(content)

    if active_socket is None:
        raise HTTPException(status_code=503, detail="Extension bağlı değil.")

    request_id = uuid.uuid4().hex
    pending_requests[request_id] = asyncio.Queue(maxsize=4)

    await active_socket.send_json({"type": "PROMPT", "text": final_prompt, "request_id": request_id})

    try:
        expected_sources = {"chatgpt", "cerebras"}
        responses = {}
        deadline = 120.0
        first_response_deadline = 60.0
        start_time = asyncio.get_event_loop().time()
        first_received_at: float | None = None

        while True:
            elapsed = asyncio.get_event_loop().time() - start_time
            if first_received_at is None:
                remaining = max(0.1, first_response_deadline - elapsed)
            else:
                remaining = max(0.1, deadline - elapsed)
            if remaining <= 0:
                break

            response_data = await asyncio.wait_for(
                pending_requests[request_id].get(), timeout=remaining
            )
            source = (response_data.get("source") or "").lower()
            text = response_data.get("text")
            tab_id = response_data.get("tab_id")

            if source in expected_sources and text:
                responses[source] = {"text": text, "tab_id": tab_id}
                if first_received_at is None:
                    first_received_at = asyncio.get_event_loop().time()
            elif text and "fallback" not in responses:
                responses["fallback"] = {"text": text, "tab_id": tab_id}
                if first_received_at is None:
                    first_received_at = asyncio.get_event_loop().time()

            if responses and first_received_at is not None:
                break
            if elapsed >= deadline:
                break

        if responses:
            parts = []
            if "chatgpt" in responses:
                parts.append(responses['chatgpt']['text'])
            if "gemini" in responses:
                parts.append(responses['gemini']['text'])
            if not parts and "fallback" in responses:
                parts.append(responses["fallback"]["text"])

            combined_text = "\n\n".join(parts)
            return PlainTextResponse(combined_text)

        raise HTTPException(status_code=504, detail="Yanıt alınamadı.")
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="Yanıtlar çok uzun sürdü.")
    finally:
        pending_requests.pop(request_id, None)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    uvicorn.run(app, host="0.0.0.0", port=port)
