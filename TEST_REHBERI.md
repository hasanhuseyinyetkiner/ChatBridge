# ChatBridge Test Rehberi

## 🚀 Hızlı Başlangıç

### 1. Server'ı Başlat
```bash
cd server
python3 server.py
```

Server `http://localhost:3000` adresinde çalışacak.

### 2. Extension'ı Yükle

1. Chrome'da `chrome://extensions/` adresine git
2. "Developer mode" aktif et
3. "Load unpacked" butonuna tıkla
4. `extension` klasörünü seç

### 3. ChatGPT veya Gemini'yi Aç

**ChatGPT için:**
1. `https://chatgpt.com` adresine git
2. Extension otomatik olarak yüklenecek
3. Console'da `[ChatBridge] Content script yüklendi` mesajını görmelisin

**Gemini için:**
1. `https://gemini.google.com/app` adresine git
2. Extension otomatik olarak yüklenecek
3. Console'da `[ChatBridge] Content script yüklendi` mesajını görmelisin

## ✅ Test Senaryoları

### Test 1: Başlıklar Paneli (Outline)

**Beklenen Davranış:**
- ChatGPT veya Gemini sayfasında sol üstte "📌 Başlıklar" paneli görünmeli
- Her kullanıcı mesajı panelde bir başlık olarak eklenmeli
- Başlığa tıklayınca ilgili mesaja scroll yapmalı

**Test Adımları (ChatGPT):**
1. ChatGPT'de birkaç mesaj gönder
2. Sol üstte "Başlıklar" panelini kontrol et
3. Başlıklara tıkla ve scroll'un çalıştığını doğrula

**Test Adımları (Gemini):**
1. Gemini'de birkaç mesaj gönder
2. Sol üstte "Başlıklar" panelini kontrol et
3. Başlıklara tıkla ve scroll'un çalıştığını doğrula

### Test 2: Başlıklar Paneli - Draggable (Sürüklenebilir)

**Beklenen Davranış:**
- "Başlıklar" başlığına tıklayıp sürükleyince panel hareket etmeli
- Panel ekran sınırlarını aşmamalı
- Sürükleme sırasında görsel geri bildirim olmalı (opacity değişimi)

**Test Adımları:**
1. "📌 Başlıklar" başlığına tıkla ve basılı tut
2. Mouse'u hareket ettir - panel takip etmeli
3. Ekranın farklı yerlerine taşı
4. Bırak ve panelin yeni konumda kaldığını doğrula

### Test 3: Q/A Board Paneli

**Beklenen Davranış:**
- ChatGPT veya Gemini cevapları geldiğinde altta "ChatBridge Workspace" paneli görünmeli
- Soru-cevaplar yan yana kartlar halinde gösterilmeli
- "Gizle/Göster" butonu ile panel gizlenip gösterilebilmeli

**Test Adımları (ChatGPT):**
1. ChatGPT'ye bir soru sor
2. Cevap geldiğinde altta panelin göründüğünü kontrol et
3. Soru-cevap kartlarının yan yana olduğunu doğrula
4. "Gizle/Göster" butonuna tıkla ve panelin gizlendiğini/göründüğünü kontrol et

**Test Adımları (Gemini):**
1. Gemini'ye bir soru sor
2. Cevap geldiğinde altta panelin göründüğünü kontrol et
3. Soru-cevap kartlarının yan yana olduğunu doğrula
4. "Gizle/Göster" butonuna tıkla ve panelin gizlendiğini/göründüğünü kontrol et

### Test 4: API İsteği

**Beklenen Davranış:**
- Server'a POST isteği gönderildiğinde ChatGPT veya Gemini'ye otomatik yazılmalı
- Cevap geldiğinde server'a geri gönderilmeli

**Test Adımları:**
1. ChatGPT veya Gemini sekmesini açık tut
2. Terminal'de:
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Merhaba, nasılsın?"}'
```

3. Açık olan sekmede (ChatGPT veya Gemini) mesajın otomatik yazıldığını gözlemle
4. Cevap geldiğinde terminal'de yanıtı kontrol et

### Test 5: Çoklu Sekme

**Beklenen Davranış:**
- Birden fazla ChatGPT veya Gemini sekmesi açıldığında round-robin ile kullanılmalı
- Bir sekmeden gelen cevap diğer sekmelere de senkronize edilmeli
- ChatGPT ve Gemini sekmeleri birlikte kullanılabilmeli

**Test Adımları:**
1. 2-3 ChatGPT veya Gemini sekmesi aç (veya karışık)
2. API isteği gönder
3. Tüm sekmelerde cevabın göründüğünü kontrol et
4. Farklı provider'ların (ChatGPT/Gemini) birlikte çalıştığını doğrula

## 🐛 Sorun Giderme

### Server başlamıyor
- Port 3000 kullanımda mı kontrol et: `lsof -i :3000`
- Python bağımlılıkları kurulu mu: `pip install -r requirements.txt`

### Extension yüklenmiyor
- `manifest.json` syntax hatası var mı kontrol et
- Console'da hata mesajları var mı bak: `chrome://extensions/` → Extension detayları → "Errors"

### Başlıklar paneli görünmüyor
- Console'da `[ChatBridge] Content script yüklendi` mesajı var mı?
- ChatGPT veya Gemini sayfası tamamen yüklendi mi?
- Shadow DOM oluşturuldu mu kontrol et: `document.querySelector('#chatbridge-ui-host')`

### Draggable çalışmıyor
- Header'a tıkladığında cursor değişiyor mu?
- Console'da JavaScript hatası var mı?
- Shadow DOM içinde event listener'lar doğru çalışıyor mu?

### API isteği çalışmıyor
- Server çalışıyor mu: `curl http://localhost:3000/docs`
- Extension bağlı mı: Server console'unda "Browser Extension Bağlandı!" mesajı var mı?
- ChatGPT veya Gemini sekmesi açık mı?
- Doğru provider seçildi mi kontrol et: Console'da `getProvider()` fonksiyonunu çalıştır

## 📝 Notlar

- Extension `https://chatgpt.com` ve `https://gemini.google.com` domain'lerinde çalışır
- Server `localhost:3000` adresinde çalışmalı
- WebSocket bağlantısı extension ile server arasında kurulmalı
- UI elementleri Shadow DOM içinde izole edilmiştir
- ChatGPT ve Gemini sekmeleri birlikte kullanılabilir (round-robin)
- Gemini için: Input alanı `div[contenteditable="true"]` selector'ı ile bulunur
- Gemini için: Mesajlar `model-response` ve `model-prompt` elementleri ile tespit edilir
