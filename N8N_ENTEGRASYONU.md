# n8n ile ChatBridge API Entegrasyonu

Bu rehber, PC'nizde çalışan ChatBridge sunucusunu n8n ile nasıl kullanacağınızı adım adım anlatır.

## Ön koşullar

1. **ChatBridge server** PC'nizde çalışıyor olmalı (varsayılan: `http://localhost:3000`).
2. **Tarayıcı eklentisi** yüklü ve sunucu adresi doğru ayarlanmış olmalı.
3. **ChatGPT veya Gemini** sekmesi tarayıcıda **açık** olmalı (extension bu sekmeye bağlanır).

n8n aynı PC'de değilse, `localhost` yerine sunucunun **IP adresini** kullanın (bkz. [AG_DISINDAN_ERISIM.md](AG_DISINDAN_ERISIM.md)).

---

## 1. Sağlık kontrolü (isteğe bağlı)

Extension bağlı mı diye kontrol etmek için **HTTP Request** node kullanın:

| Ayar      | Değer |
|-----------|--------|
| **Method** | GET |
| **URL**    | `http://localhost:3000/health` (veya `http://<PC_IP>:3000/health`) |

**Yanıt örneği:**

```json
{
  "status": "ok",
  "extension_connected": true
}
```

- `extension_connected: true` → Chat isteği gönderebilirsiniz.
- `extension_connected: false` → Eklenti bağlı değil; ChatGPT/Gemini sekmesini açıp extension'ı yeniden bağlayın.

n8n akışında bu node'dan sonra **IF** node ile `extension_connected === true` kontrolü yapıp, false ise uyarı veya bekleme ekleyebilirsiniz.

---

## 2. Chat isteği gönderme

ChatBridge’e prompt göndermek için yine **HTTP Request** node kullanın.

### Temel ayarlar

| Ayar       | Değer |
|------------|--------|
| **Method** | POST |
| **URL**    | `http://localhost:3000/chat` (veya `http://<PC_IP>:3000/chat`) |
| **Headers** | `Content-Type: application/json` |
| **Body**   | Aşağıdaki formatlardan biri |

### n8n HTTP Request node ayar notları

- **Response Format**: `JSON`
- **Options → Timeout**: Yanıtın gelmesi bazen uzun sürebilir. En az **60-120s** önerilir.

### Body formatları

**Sadece prompt (en basit):**

```json
{
  "prompt": "Merhaba, bugün hava nasıl?"
}
```

**Messages formatı (OpenAI uyumlu):**

```json
{
  "messages": [
    { "role": "user", "content": "Kısa bir özet yaz: ..." }
  ]
}
```

n8n’de **Body Content Type**: JSON, **Specify Body**: Using JSON ile yukarıdaki JSON’u girebilir veya önceki node’dan `prompt` / `messages` alanlarını expression ile doldurabilirsiniz.

### Yanıt formatı

Başarılı yanıt örneği (gerçek çıktı formatı):

```json
{
  "status": "success",
  "gpt_response": "[ChatGPT]\nBu bir API test mesajıdır.\n\n[Gemini]\nBu bir API test mesajıdır."
}
```

### n8n’de dönen sonucu gösterme / kullanma

- **Ham yanıt metni**: `{{ $json.gpt_response }}`
- **Durum alanı**: `{{ $json.status }}`

Örnek: bir **Set** node ekleyip şu alanları üretebilirsin:

- `full_text` = `{{ $json.gpt_response }}`
- `chatgpt_text` = `{{ ($json.gpt_response || '').split('[Gemini]')[0].replace('[ChatGPT]', '').trim() }}`
- `gemini_text` = `{{ (($json.gpt_response || '').split('[Gemini]')[1] || '').trim() }}`

Hata durumunda HTTP 503 (extension bağlı değil) veya 504 (yanıt zaman aşımı) döner; body’de `detail` mesajı olur.

---

## 3. n8n akış örneği

1. **Schedule / Trigger** – İstediğiniz zaman veya tetikleyici.
2. **HTTP Request (Health)** – GET `http://localhost:3000/health`.
3. **IF** – `{{ $json.extension_connected }}` true mu?
   - **Evet** → **HTTP Request (Chat)** – POST `http://localhost:3000/chat`, body: `{ "prompt": "{{ $json.prompt }}" }` (veya sabit prompt).
   - **Hayır** → (Opsiyonel) Bildirim veya log: "Extension bağlı değil".
4. **Sonuç** – Chat yanıtını `{{ $json.gpt_response }}` ile kullanın (e-posta, Slack, veritabanı vb.).

---

## 4. Alternatif: OpenAI uyumlu endpoint

Bazı araçlar `/v1/chat/completions` bekler. ChatBridge aynı mantığı şu endpoint’te de sunar:

- **URL:** `http://localhost:3000/v1/chat/completions`
- **Method:** POST
- **Body:** `messages` veya `prompt` (yukarıdaki gibi).

Yanıt yapısı `/chat` ile aynı (`status`, `gpt_response`).

---

## 5. API dokümantasyonu (Swagger)

Sunucu çalışırken tarayıcıdan:

- **Swagger UI:** `http://localhost:3000/docs`
- **ReDoc:** `http://localhost:3000/redoc`

Tüm endpoint’leri ve parametreleri buradan test edebilirsiniz.

---

## Özet

| İşlem           | Method | URL (localhost örnek)        |
|-----------------|--------|------------------------------|
| Sağlık / durum  | GET    | `http://localhost:3000/health` |
| Chat (prompt)   | POST   | `http://localhost:3000/chat`   |
| Chat (OpenAI)   | POST   | `http://localhost:3000/v1/chat/completions` |

n8n’i PC’deki ChatBridge’e bağlamak için bu URL’leri kullanmanız yeterli; farklı PC’den erişiyorsanız `localhost` yerine sunucu PC’nin IP’sini yazın.
