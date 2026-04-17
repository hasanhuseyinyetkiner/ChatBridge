// -----------------------------------------------------------------------------
// EXTENSION CONTENT SCRIPT: ChatBridge (UI'siz otomasyon çekirdeği)
//  - Bir sayfaya birden fazla kez enjekte edilebildiği için
//    global değişkenler var ile tanımlanır ve tek-seferlik guard kullanılır.
// -----------------------------------------------------------------------------

if (!window.__CHATBRIDGE_CORE_LOADED__) {
  window.__CHATBRIDGE_CORE_LOADED__ = true;
  console.log("%c[ChatBridge] Content Script V8 Yüklendi 🚀", "color: #2563eb; font-weight: bold; font-size: 14px;");
  console.log("Geliştirici Araçları için popup üzerindeki butonu kullanabilir veya Konsolu (F12) takip edebilirsiniz.");
  var activeRequestId = null;
  var activePromptText = ""; // Enjekte edilen son promptu tut

  // --- Mesajlaşma (background → content) ---
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "WRITE_PROMPT") {
      console.log("Mesaj Alındı: WRITE_PROMPT", request);
      activeRequestId = request.request_id || null;
      activePromptText = request.text || "";
      injectPrompt(request.text, activeRequestId);
      sendResponse({ status: "received" });
    }

    if (request.action === "SYNC_RESPONSE") {
      console.log("Yanıt Senkronize Edildi:", request.text.substring(0, 50));
    }
    // Return nothing (undefined) or false unless async sendResponse is needed.
    // WRITE_PROMPT calls sendResponse sync, so return is not strictly needed but good to be clear.
  });

// --- Yardımcılar ---
function isGemini() {
  return window.location.hostname.includes("gemini.google.com");
}

function findInputArea() {
  if (!isGemini()) {
    return (
      document.querySelector("#prompt-textarea") ||
      document.querySelector('textarea[placeholder*="Message"]') ||
      document.querySelector("div[contenteditable='true'][role='textbox']") ||
      document.querySelector("form textarea") ||
      document.querySelector("textarea")
    );
  }

  // Gemini için güncellenmiş seçiciler
  return (
    document.querySelector('div[contenteditable="true"][role="textbox"]') ||
    document.querySelector('div.ql-editor[contenteditable="true"]') ||
    document.querySelector('rich-textarea div[contenteditable="true"]') ||
    document.querySelector('textarea[aria-label*="Prompt"]') ||
    document.querySelector('textarea[aria-label*="istem"]') ||
    document.querySelector('textarea[aria-label*="mesaj"]') ||
    document.querySelector('textarea')
  );
}

function findSendButton() {
  if (!isGemini()) {
    return (
      document.querySelector('button[data-testid="send-button"]') ||
      document.querySelector('button[aria-label*="Send"]') ||
      document.querySelector('button[data-state="closed"] .icon-paper-plane') ||
      document.querySelector('form button[type="submit"]') ||
      document.querySelector('button[data-state]')?.closest("form")?.querySelector("button") ||
      document.querySelector("form button")
    );
  }

  // Gemini için güncellenmiş seçiciler
  return (
    document.querySelector('button[aria-label*="Send message"]') ||
    document.querySelector('button[aria-label*="Prompt gönder"]') ||
    document.querySelector('button[aria-label*="Mesaj gönder"]') ||
    document.querySelector('button.send-button') ||
    document.querySelector('re-send-button button') ||
    document.querySelector('button[type="submit"]') ||
    document.querySelector('div[aria-label*="Send"] button')
  );
}

function getLatestAssistantText() {
  const isGem = isGemini();
  const DISCLAIMERS = [
    "yapay zeka modeli olduğu için hata yapabilir",
    "Gemini may display inaccurate info",
    "ChatGPT is currently",
    "free research preview",
    "limitations of our ai",
    "error in response"
  ];

  function isDisclaimer(text) {
    if (!text) return false;
    const lower = text.toLowerCase();
    return DISCLAIMERS.some(d => lower.includes(d.toLowerCase()));
  }

  if (!isGem) {
    // ChatGPT seçicileri
    const chatGptSelectors = [
      '[data-message-author-role="assistant"] .markdown',
      '[data-message-author-role="assistant"] .prose',
      'article:has([data-message-author-role="assistant"]) .markdown',
      '.markdown.prose'
    ];

    const elements = [];
    for (const sel of chatGptSelectors) {
      const found = document.querySelectorAll(sel);
      found.forEach(el => elements.push(el));
    }

    for (let i = elements.length - 1; i >= 0; i--) {
      const text = elements[i].innerText || "";
      if (text.trim().length > 10 && !isDisclaimer(text)) {
        return text;
      }
    }
    return "";
  }

  // Gemini seçicileri
  const geminiSelectors = [
    'model-response .markdown',
    'model-response div[class*="message-content"]',
    'model-response .model-response-text',
    'model-response',
    'message-content div[class*="markdown"]',
    '.message-content'
  ];

  const elements = [];
  for (const sel of geminiSelectors) {
    const found = document.querySelectorAll(sel);
    found.forEach(el => elements.push(el));
  }

  // Sondan başa doğru en anlamlı ve disclaimer olmayan metni bul
  for (let i = elements.length - 1; i >= 0; i--) {
    const text = elements[i].innerText || "";
    // Gemini bazen boş veya çok kısa (yükleniyor gibi) dönebilir
    if (text.trim().length > 5 && !isDisclaimer(text)) {
      return text;
    }
  }

  return "";
}

// --- Prompt enjeksiyonu ---
function injectPrompt(text, requestId) {
  console.log("Prompt Enjekte Ediliyor:", text.substring(0, 30));

  const initialText = getLatestAssistantText();

  const inputArea = findInputArea();
  if (!inputArea) {
    console.error("Input alanı bulunamadı!");
    chrome.runtime.sendMessage({
      action: "GPT_RESPONSE",
      text: isGemini()
        ? "Hata: Gemini input alanı bulunamadı."
        : "Hata: ChatGPT input alanı bulunamadı.",
      request_id: requestId,
    });
    return;
  }

  const setNativeValue = (el, value) => {
    const tag = el.tagName.toLowerCase();
    if (tag === "textarea" || tag === "input") {
      const proto =
        tag === "textarea" ? window.HTMLTextAreaElement : window.HTMLInputElement;
      const desc = Object.getOwnPropertyDescriptor(proto?.prototype, "value");
      if (desc?.set) {
        desc.set.call(el, value);
        el.dispatchEvent(new Event("input", { bubbles: true }));
        return;
      }
    }

    // contenteditable için
    el.innerHTML = "";
    const p = document.createElement("p");
    p.innerText = value;
    el.appendChild(p);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  };

  if (
    inputArea.tagName.toLowerCase() === "textarea" ||
    inputArea.tagName.toLowerCase() === "input"
  ) {
    setNativeValue(inputArea, text);
  } else {
    inputArea.innerHTML = "";
    inputArea.innerText = text;
    inputArea.dispatchEvent(new Event("input", { bubbles: true }));
  }

  inputArea.focus();

  function doSend() {
    const sendButton = findSendButton();
    if (sendButton && !sendButton.disabled) {
      console.log("Gönder butonuna basılıyor...");
      sendButton.click();
      waitForResponse(requestId, initialText);
    } else {
      console.log("Gönder butonu bulunamadı veya pasif, Enter simüle ediliyor...");
      const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true
      });
      inputArea.dispatchEvent(enterEvent);
      waitForResponse(requestId, initialText);
    }
  }

  setTimeout(doSend, 400); // 400ms bekle ki browser inputu işlesin
}

// --- Yanıt bekleme (V8 - Daha akıllı kontrol) ---
function waitForResponse(requestId, initialText) {
  console.log("Yanıt bekleniyor... (Eski yanıt atlanacak)");
  let checkCount = 0;
  let lastLength = 0;
  let stableTicks = 0;
  let hasChanged = false;

  const checkInterval = setInterval(() => {
    checkCount++;

    // Stop butonu varsa hala üretim yapılıyordur
    const stopButton = document.querySelector(
      'button[aria-label*="Stop"], [data-testid*="stop-button"], [aria-label*="İşlemi durdur"], button .icon-stop'
    );

    const currentText = getLatestAssistantText();

    // Eğer hala eski yanıtı görüyorsak ve yeni bir yanıt başlamadıysa bekle
    if (!hasChanged) {
        if (currentText !== initialText && currentText.trim().length > 0) {
            hasChanged = true;
            console.log("Yeni yanıt tespit edildi.");
        } else if (stopButton) {
            hasChanged = true;
            console.log("Stop butonu görüldü, yanıt başladı.");
        } else {
            // İlk 2 saniye (10 tick) içinde henüz değişim yoksa bekleme devam eder
            if (checkCount > 15) { // 3 saniye sonra hala değişmediyse devam et (belki aynı yanıt geldi)
                hasChanged = true;
            } else {
                return;
            }
        }
    }

    const currentLength = (currentText || "").trim().length;

    if (currentLength > 0 && currentLength === lastLength) {
      stableTicks++;
    } else {
      stableTicks = 0;
    }
    lastLength = currentLength;

    const isFinishedByStability = !stopButton && stableTicks >= 5 && currentLength > 0;
    const isFinishedByStopButtonGone = !stopButton && currentLength > 50 && stableTicks >= 2;
    const timeoutExceeded = checkCount >= 200; // 40 saniye limit

    if (isFinishedByStability || (isFinishedByStopButtonGone) || timeoutExceeded) {
      console.log("İşlem tamamlandı. Len:", currentLength);
      clearInterval(checkInterval);
      setTimeout(() => extractResponse(requestId), 100);
    }
  }, 200);
}

// --- Yanıt çıkarma ---
function extractResponse(requestId) {
  let finalResponse = "";

  const latestText = getLatestAssistantText();
  console.log("Ayıklanan ham metin:", latestText);
  if (latestText && latestText.trim().length > 0) {
    finalResponse = latestText;
  }

  finalResponse = cleanResponse(finalResponse);
  console.log("AYIKLANAN YANIT (İlk 100):", finalResponse.substring(0, 100));

  chrome.runtime.sendMessage({
    action: "GPT_RESPONSE",
    text: finalResponse || "Hata: Yanıt alınamadı veya ayıklanamadı.",
    request_id: requestId || activeRequestId,
    original_prompt: activePromptText,
    source: isGemini() ? "Gemini" : "ChatGPT",
  });
}

// --- Yardımcı temizleme ---
function extractMessageText(element) {
  if (!element) return "";
  const clone = element.cloneNode(true);
  const codeCopies = clone.querySelectorAll(".flex.items-center.text-xs, button");
  codeCopies.forEach((el) => el.remove());
  return clone.innerText.trim();
}

function cleanResponse(text) {
  if (!text) return "";
  return text
    .replace(/^ChatGPT/i, "")
    .replace(/^Gemini/i, "")
    .replace(/Copy code$/gm, "")
    .replace(/Was this response helpful\?/g, "")
    .trim();
}

} // window.__CHATBRIDGE_CORE_LOADED__ guard sonu
