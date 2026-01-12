let socket = null;

function connect() {
  const wsUrl = 'ws://127.0.0.1:3000/ws';
  console.log('Baglaniliyor:', wsUrl);
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log('Sunucuya bağlandı: ' + wsUrl);
    setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) socket.send('ping');
    }, 10000);
  };

  socket.onerror = (error) => {
    console.error('WebSocket Hatası:', error);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'PROMPT') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0] && tabs[0].url && tabs[0].url.includes('chatgpt.com')) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'WRITE_PROMPT', text: data.text });
          }
        });
      }
    } catch (e) {
      if (event.data !== 'pong') {
         console.warn('Alınan mesaj işlenemedi:', event.data);
      }
    }
  };

  socket.onclose = () => {
    console.log('Bağlantı koptu, 5 sn sonra yeniden denenecek...');
    setTimeout(connect, 5000);
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GPT_RESPONSE') {
    console.log('Content script-ten yanıt geldi, sunucuya gönderiliyor:', request.text);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ text: request.text }));
    } else {
      console.error('Sunucu bağlantısı kapalı, yanıt gönderilemedi!');
    }
  }
});

connect();
