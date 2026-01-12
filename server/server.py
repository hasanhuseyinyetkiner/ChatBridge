import asyncio
import json
from fastapi import FastAPI, WebSocket, HTTPException
from pydantic import BaseModel
import uvicorn

app = FastAPI()

# Aktif websocket bağlantısını ve mesaj kuyruğunu tutacağız
active_socket: WebSocket | None = None
message_queue: asyncio.Queue = asyncio.Queue()

class ChatRequest(BaseModel):
    prompt: str

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global active_socket, message_queue
    await websocket.accept()
    active_socket = websocket
    print("Browser Extension Bağlandı!")
    try:
        while True:
            msg = await websocket.receive()
            if msg.get("type") == "websocket.disconnect":
                break

            # Text mesaj varsa işle
            if "text" in msg:
                text = msg["text"]
                # Ping mesajlarını ayıkla
                if text == "ping" or text == 'ping':
                    continue
                
                try:
                    data = json.loads(text)
                except Exception:
                    data = {"text": text}
                
                if data.get("text") == "ping":
                    continue
                    
                print(f"Eklentiden mesaj geldi: {text[:50]}")
                await message_queue.put(data)
    except Exception as e:
        print(f"WebSocket Hatası: {e}")
    finally:
        print("Browser Extension Bağlantısı Koptu")
        active_socket = None

@app.post("/chat")
async def chat(request: ChatRequest):
    global active_socket, message_queue
    if active_socket is None:
        raise HTTPException(status_code=503, detail="Extension bağlı değil. Lütfen ChatGPT sekmesini açın.")

    # Kuyruğu temizle (eski mesajlar kalmasın)
    while not message_queue.empty():
        message_queue.get_nowait()

    # 1. Extension'a prompt gönder
    await active_socket.send_json({"type": "PROMPT", "text": request.prompt})

    # 2. Cevabı bekle
    try:
        response = await asyncio.wait_for(message_queue.get(), timeout=120.0)
        print(f"Eklentiden yanıt alındı: {response.get('text')[:50]}...")
        return {"status": "success", "gpt_response": response.get("text")}
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="ChatGPT yanıt vermesi çok uzun sürdü.")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000)
