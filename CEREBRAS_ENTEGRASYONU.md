# Cerebras Entegrasyon Rehberi (Hızlı Llama 3)

Bu rehber, ChatBridge sunucusuna yeni eklenen Cerebras entegrasyonunu nasıl kullanacağınızı anlatır.

## Özellikler
- **Işık Hızında:** Llama 3.1 8b ve 70b modelleri ile milisaniyeler içinde yanıt.
- **Tarayıcı Gerektirmez:** ChatGPT veya Gemini sekmesi açık olmasa bile çalışır.
- **OpenAI Uyumlu:** Mevcut `/chat` ve `/v1/chat/completions` endpoint'leri üzerinden erişilebilir.

## Nasıl Kullanılır?

Cerebras kullanmak için istek yaparken `model` parametresini belirtmeniz yeterlidir.

### 1. cURL ile Test
```bash
curl -X POST http://localhost:3000/chat \
     -H "Content-Type: application/json" \
     -d '{"model": "cerebras", "prompt": "Merhaba, sen hangi modelsin?"}'
```

### 2. Modeller
Aşağıdaki modellerden birini seçebilirsiniz:
- `cerebras` (varsayılan: llama3.1-8b)
- `llama3.1-8b`
- `llama3.1-70b`

### 3. n8n Entegrasyonu
n8n'deki **HTTP Request** node'unda body alanını şöyle güncelleyin:

```json
{
  "model": "cerebras",
  "prompt": "Sorum buraya gelecek"
}
```

## Neden Cerebras?
Tarayıcı tabanlı (ChatGPT/Gemini) yöntem 20-30 saniye sürebilirken, Cerebras entegrasyonu ile yanıtlar **1 saniyenin altında** gelir. Bu, özellikle n8n gibi otomasyon sistemleri için idealdir.

---

*Not: API anahtarınız `server/server.py` içine güvenli bir şekilde eklenmiştir.*
