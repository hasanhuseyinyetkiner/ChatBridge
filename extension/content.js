chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "WRITE_PROMPT") {
        injectPrompt(request.text);
    }
});

function injectPrompt(text) {
    console.log("Prompt enjekte ediliyor...");
    
    // 1. Yazı alanını bul (contenteditable veya textarea)
    const inputField = document.querySelector('#prompt-textarea') || 
                       document.querySelector('[contenteditable="true"]') ||
                       document.querySelector('textarea');

    if (!inputField) {
        console.error("Giriş alanı bulunamadı!");
        return;
    }

    // 2. React/Lexical gibi frameworkler için daha derin bir tetikleme
    inputField.focus();
    
    // Temizle ve yaz
    if (inputField.tagName === 'TEXTAREA') {
        inputField.value = text;
    } else {
        inputField.textContent = text; // innerHTML yerine textContent daha güvenli
    }
    
    // Çoklu event tetikleme
    const events = ['input', 'change', 'keydown', 'keyup'];
    events.forEach(type => {
        inputField.dispatchEvent(new Event(type, { bubbles: true }));
    });

    // 3. Gönder butonunu bul ve tıkla (Kısa bir gecikme ile)
    setTimeout(() => {
        const sendButton = document.querySelector('button[aria-label="Send prompt"], [data-testid="send-button"], button.bg-black');
        if (sendButton && !sendButton.disabled) {
            console.log("Gönder butonuna basılıyor...");
            sendButton.click();
            waitForResponse();
        } else {
            console.log("Buton bulunamadı veya pasif, Enter tuşu simüle ediliyor...");
            inputField.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
            }));
            waitForResponse();
        }
    }, 600);
}

function waitForResponse() {
    console.log("Yanıt bekleniyor (V6 - Ultra Robust)...");
    let checkCount = 0;
    let lastLength = 0;
    let stableTicks = 0;

    const checkInterval = setInterval(() => {
        checkCount++;
        
        // ChatGPT'nin en güncel mesaj kapsayıcılarını ara
        const assistantTowers = document.querySelectorAll('[data-message-author-role="assistant"]');
        const markdownDivs = document.querySelectorAll('.markdown');
        const stopButton = document.querySelector('button[aria-label="Stop generating"], [data-testid="stop-button"]');
        const sendButton = document.querySelector('button[aria-label="Send prompt"], [data-testid="send-button"]');

        // Mevcut metni al
        let currentText = "";
        if (assistantTowers.length > 0) {
            currentText = assistantTowers[assistantTowers.length - 1].innerText;
        } else if (markdownDivs.length > 0) {
            currentText = markdownDivs[markdownDivs.length - 1].innerText;
        }

        const currentLength = (currentText || "").trim().length;

        // Loglama
        if (checkCount % 5 === 0) {
            console.log(`Durum: Len:${currentLength}, Stable:${stableTicks}, Stop:${!!stopButton}, Send:${!!sendButton}`);
        }

        // Stabilite kontrolü (Yazma bitince uzunluk sabit kalır)
        if (currentLength > 0 && currentLength === lastLength) {
            stableTicks++;
        } else {
            stableTicks = 0;
        }
        lastLength = currentLength;

        // BİTİŞ KRİTERLERİ
        // 1. Yazma durdu (Stop butonu gitti, Send butonu geldi)
        // 2. Metin en az 4 saniyedir değişmiyor (Ve boş değil)
        // 3. Zaman aşımı (90 sn)
        const isFinishedByButtons = !stopButton && sendButton && currentLength > 2;
        const isFinishedByStability = stableTicks >= 4 && currentLength > 0;

        if (isFinishedByButtons || isFinishedByStability || checkCount > 90) {
            console.log("İşlem tamamlandı. Ayıklanıyor... Karar:", isFinishedByButtons ? "Butonlar" : "Stabilite");
            clearInterval(checkInterval);
            setTimeout(extractResponse, 1000); // Son bir bekleme
        }
    }, 1000);
}

function extractResponse() {
    // En iyi sonuç için hiyerarşik deneme
    const selectors = [
        '[data-message-author-role="assistant"] .markdown',
        '[data-message-author-role="assistant"]',
        '.markdown:last-child',
        '.prose:last-child'
    ];

    let finalResponse = "";

    for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            const last = elements[elements.length - 1];
            finalResponse = (last.innerText || last.textContent || "").trim();
            if (finalResponse) break;
        }
    }

    if (!finalResponse) {
        console.log("Standart seçiciler başarısız, son p etiketleri alınıyor.");
        const pTags = document.querySelectorAll('p');
        if (pTags.length > 0) finalResponse = pTags[pTags.length - 1].innerText;
    }

    console.log("BULUNAN YANIT:", finalResponse.substring(0, 50));
    chrome.runtime.sendMessage({ action: "GPT_RESPONSE", text: finalResponse || "Hata: Yanıt ayıklanamadı." });
}
