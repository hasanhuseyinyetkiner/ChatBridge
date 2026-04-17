# Ağ Dışından Erişim Rehberi

## ✅ Yapılan Değişiklikler

1. **Server**: Zaten `0.0.0.0:3000` adresinde dinliyor (tüm ağ arayüzleri)
2. **Extension**: IP adresi ayarlanabilir hale getirildi
3. **Popup UI**: Server adresi ayarlama arayüzü eklendi
4. **Manifest**: Tüm IP adreslerine izin verildi

## 🔧 Kurulum

### 1. Server IP Adresini Öğren

```bash
hostname -I
# veya
ip addr show | grep "inet " | grep -v 127.0.0.1
```

Örnek çıktı: `192.168.101.67`

### 2. Extension'da IP Adresini Ayarla

1. Chrome'da extension ikonuna tıkla
2. "Sunucu Adresi" alanına IP adresini gir (örn: `192.168.101.67`)
3. "Kaydet ve Yeniden Bağlan" butonuna tıkla
4. Durum "✅ Bağlı" olmalı

### 3. Başka PC'den Test Et

```bash
# Aynı ağdaki başka bir PC'den:
curl -X POST http://192.168.101.67:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Merhaba, nasılsın?"}'
```

## 🔥 Firewall Ayarları

### Ubuntu/Debian (ufw)

```bash
sudo ufw allow 3000/tcp
sudo ufw reload
```

### CentOS/RHEL (firewalld)

```bash
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

### iptables

```bash
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
sudo iptables-save
```

## 🌐 Farklı Ağlardan Erişim

### Port Forwarding (Router)

1. Router admin paneline gir
2. Port forwarding ekle:
   - External Port: 3000
   - Internal IP: 192.168.101.67
   - Internal Port: 3000
   - Protocol: TCP

### Dinamik DNS (Opsiyonel)

1. No-IP veya DuckDNS gibi bir servis kullan
2. Router'da DDNS ayarlarını yap
3. Extension'da domain adresini kullan

## ⚠️ Güvenlik Notları

1. **Sadece güvendiğiniz ağlarda kullanın**
2. **Production'da authentication ekleyin**
3. **HTTPS/WSS kullanmayı düşünün**
4. **Firewall kurallarını sıkı tutun**

## 🧪 Test Senaryoları

### Test 1: Aynı Ağ (LAN)

```bash
# Server PC'den:
curl -X POST http://192.168.101.67:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test mesajı"}'

# Başka PC'den (aynı ağ):
curl -X POST http://192.168.101.67:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test mesajı"}'
```

### Test 2: Farklı Ağ (WAN)

```bash
# Dış IP ile (port forwarding varsa):
curl -X POST http://YOUR_PUBLIC_IP:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test mesajı"}'
```

## 📝 Extension Ayarları

Extension popup'ında:
- **Sunucu Adresi**: `localhost` (yerel) veya `192.168.101.67` (ağ)
- **Durum**: Bağlantı durumunu gösterir
- **Kaydet**: Ayarları kaydeder ve yeniden bağlanır

## 🐛 Sorun Giderme

### "Connection refused" hatası
- Server çalışıyor mu? `ps aux | grep server.py`
- Port açık mı? `netstat -tuln | grep 3000`
- Firewall kuralı var mı?

### "Connection timeout" hatası
- IP adresi doğru mu?
- Aynı ağda mısınız?
- Router port forwarding yapılmış mı?

### Extension bağlanamıyor
- Popup'ta IP adresini kontrol et
- Console'da hata var mı? (`chrome://extensions/` → Extension detayları)
- Manifest'te host_permissions doğru mu?

## 📊 Network Test Komutları

```bash
# Port dinleniyor mu?
netstat -tuln | grep 3000
# veya
ss -tuln | grep 3000

# Bağlantı testi (aynı PC'den)
curl http://localhost:3000/docs

# Bağlantı testi (başka PC'den)
curl http://192.168.101.67:3000/docs

# Ping testi
ping 192.168.101.67

# Port açık mı? (başka PC'den)
telnet 192.168.101.67 3000
# veya
nc -zv 192.168.101.67 3000
```
