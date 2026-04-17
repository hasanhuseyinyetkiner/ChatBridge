let socket = null;
const maxTabs = 1;
const maxTabsPerProvider = {
  chatgpt: maxTabs,
  gemini: 1,
};
let roundRobinIndex = 0;
const busyTabs = new Set();
const requestTabMap = new Map();
const promptQueue = [];
let queueFlushScheduled = false;
let openingTabs = new Set();

// API Key Rotation
let CEREBRAS_API_KEYS = ["csk-w4xm8khw8pfmwy2hepmp2w9ew88w6vy2k4j5k5yjhhvtjeyh"];
let currentKeyIndex = 0;

// Storage'dan anahtarları yükle
chrome.storage.local.get(['cerebrasKeys'], (result) => {
    if (result.cerebrasKeys && Array.isArray(result.cerebrasKeys) && result.cerebrasKeys.length > 0) {
        CEREBRAS_API_KEYS = result.cerebrasKeys;
        console.log("Cerebras anahtarları yüklendi:", CEREBRAS_API_KEYS.length, "adet");
    }
});

const AI_URL_PATTERNS = [
  "https://chatgpt.com/*",
  "https://chat.openai.com/*",
  "https://gemini.google.com/*",
];

const PROVIDER_URLS = {
  chatgpt: ["https://chatgpt.com/*", "https://chat.openai.com/*"],
  gemini: ["https://gemini.google.com/*"],
};

const PROVIDER_HOME_URL = {
  chatgpt: "https://chatgpt.com",
  gemini: "https://gemini.google.com/app?hl=tr",
};

function isSupportedAiUrl(url) {
  if (!url) return false;
  return (
    url.includes("chatgpt.com") ||
    url.includes("chat.openai.com") ||
    url.includes("gemini.google.com")
  );
}

function getProviderFromUrl(url) {
  if (!url) return null;
  if (url.includes("gemini.google.com")) return "gemini";
  if (url.includes("chatgpt.com") || url.includes("chat.openai.com")) {
    return "chatgpt";
  }
  return null;
}

function ensureContentScript(tabId, tabUrl, onDone) {
  if (!isSupportedAiUrl(tabUrl)) {
    if (typeof onDone === "function") onDone(false);
    return;
  }
  chrome.scripting.executeScript(
    {
      target: { tabId },
      files: ["content.js"],
    },
    () => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        console.warn("Content script enjekte edilemedi:", lastError.message);
        if (typeof onDone === "function") onDone(false);
        return;
      }
      if (typeof onDone === "function") onDone(true);
    },
  );
}

function injectAllAiTabs(onDone) {
  chrome.tabs.query({ url: AI_URL_PATTERNS }, (tabs) => {
    if (!tabs || tabs.length === 0) {
      if (typeof onDone === "function") onDone();
      return;
    }
    let done = 0;
    tabs.forEach((tab) => {
      ensureContentScript(tab.id, tab.url, () => {
        done++;
        if (done === tabs.length && typeof onDone === "function") onDone();
      });
    });
  });
}

function connect() {
  const wsUrl = "ws://localhost:3000/ws";
  console.log("Baglaniliyor:", wsUrl);
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log("Sunucuya bağlandı: " + wsUrl);
    injectAllAiTabs(() => {
      console.log("AI sekmelerine content script enjekte edildi.");
    });
    setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) socket.send("ping");
    }, 10000);
  };

  socket.onerror = (error) => {
    console.error("WebSocket Hatası:", error);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "PROMPT") {
        chrome.storage.local.get(['selectedProvider', 'cerebrasModel'], (result) => {
          const provider = result.selectedProvider || 'chatgpt';
          const cerebrasModel = result.cerebrasModel || 'gpt-oss-120b';

          if (provider === 'both') {
            enqueuePrompt({
              text: data.text,
              request_id: data.request_id ? `${data.request_id}_gpt` : null,
              target: "chatgpt",
              original_id: data.request_id
            });
            enqueuePrompt({
              text: data.text,
              request_id: data.request_id ? `${data.request_id}_gemini` : null,
              target: "gemini",
              original_id: data.request_id
            });
          } else {
            enqueuePrompt({
              text: data.text,
              request_id: data.request_id,
              target: provider,
              model: (provider === 'cerebras') ? cerebrasModel : null
            });
          }
        });
      }
    } catch (e) {
      if (event.data !== "pong") {
        console.warn("Alınan mesaj işlenemedi:", event.data);
      }
    }
  };

  socket.onclose = () => {
    console.log("Bağlantı koptu, 5 sn sonra yeniden denenecek...");
    setTimeout(connect, 5000);
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_STATUS") {
    sendResponse({
      connected: socket && socket.readyState === WebSocket.OPEN,
      queueSize: promptQueue.length,
      keyCount: CEREBRAS_API_KEYS.length
    });
    return false;
  }

  if (request.action === "REFRESH_TABS") {
    injectAllAiTabs(() => {
        sendResponse({ status: "done" });
    });
    return true;
  }

  if (request.action === "GPT_RESPONSE") {
    handleGptResponse(request.text, request.request_id, request.source || getProviderFromUrl(sender.tab?.url) || "", sender.tab?.id);
  }

  if (request.action === "UPDATE_KEYS") {
      CEREBRAS_API_KEYS = request.keys;
      chrome.storage.local.set({ cerebrasKeys: request.keys });
      sendResponse({ status: "success" });
  }
});

function handleGptResponse(text, requestId, source, tabId) {
    if (tabId) {
      busyTabs.delete(tabId);
    }
    if (requestId) {
      requestTabMap.delete(requestId);
    }

    console.log(
      "Yanıt geldi, sunucuya gönderiliyor:",
      text.substring(0, 50) + "..."
    );

    chrome.tabs.query({ url: AI_URL_PATTERNS }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          action: "SYNC_RESPONSE",
          text: text,
          request_id: requestId
        });
      });
    });

    const payload = {
      text: text,
      source,
      request_id: requestId,
      tab_id: tabId,
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));
    }

    const bridgeUrl = "http://localhost:3000/bridge/callback";
    fetch(bridgeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    }).catch(err => console.error("HTTP callback hatası:", err));

    flushQueueSoon();
}

async function fetchCerebras(prompt, requestId, model) {
    const targetModel = model || "gpt-oss-120b";

    // Tüm anahtarları sırayla dene
    for (let i = 0; i < CEREBRAS_API_KEYS.length; i++) {
        const apiKey = CEREBRAS_API_KEYS[currentKeyIndex];
        console.log(`Cerebras API çağrılıyor (Anahtar ${currentKeyIndex}). Model:`, targetModel);

        try {
            const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: targetModel,
                    messages: [{ role: 'user', content: prompt }]
                })
            });
            const data = await response.json();

            if (response.status === 200 && data.choices && data.choices[0]) {
                const content = data.choices[0].message.content;
                handleGptResponse(content, requestId, "cerebras", null);
                return; // Başarılı, fonksiyondan çık
            } else if (response.status === 429) {
                console.warn(`Limit doldu (Anahtar ${currentKeyIndex}), bir sonrakine geçiliyor...`);
                currentKeyIndex = (currentKeyIndex + 1) % CEREBRAS_API_KEYS.length;
                continue; // Döngü devam eder
            } else {
                throw new Error(JSON.stringify(data));
            }
        } catch (err) {
            console.error(`Cerebras anahtar hatası (${currentKeyIndex}):`, err);
            currentKeyIndex = (currentKeyIndex + 1) % CEREBRAS_API_KEYS.length;
            continue;
        }
    }

    handleGptResponse("Cerebras Hatası: Tüm anahtarlar denendi ancak başarılı yanıt alınamadı.", requestId, "cerebras", null);
}

function enqueuePrompt(prompt) {
  promptQueue.push(prompt);
  flushQueueSoon();
}

function flushQueueSoon() {
  if (queueFlushScheduled) return;
  queueFlushScheduled = true;
  setTimeout(() => {
    queueFlushScheduled = false;
    flushQueue();
  }, 300);
}

function flushQueue() {
  if (promptQueue.length === 0) return;

  chrome.tabs.query({}, (allTabs) => {
    const aiTabs = allTabs.filter(t => isSupportedAiUrl(t.url));
    const remainingPrompts = [];

    while(promptQueue.length > 0) {
        const nextPrompt = promptQueue.shift();
        const target = nextPrompt.target || "chatgpt";

        if (target === "cerebras") {
            fetchCerebras(nextPrompt.text, nextPrompt.request_id, nextPrompt.model);
            continue;
        }

        const providerTabs = aiTabs.filter(t => getProviderFromUrl(t.url) === target);

        if (providerTabs.length === 0) {
            if (!openingTabs.has(target)) {
                openingTabs.add(target);
                chrome.tabs.create({ url: PROVIDER_HOME_URL[target], active: false }, (newTab) => {
                    setTimeout(() => {
                        openingTabs.delete(target);
                        flushQueueSoon();
                    }, 5000);
                });
            }
            remainingPrompts.push(nextPrompt);
            continue;
        }

        const availableTabs = providerTabs.filter(t => !busyTabs.has(t.id));
        if (availableTabs.length === 0) {
            remainingPrompts.push(nextPrompt);
            continue;
        }

        const tabToUse = availableTabs[0];
        busyTabs.add(tabToUse.id);
        if (nextPrompt.request_id) {
          requestTabMap.set(nextPrompt.request_id, tabToUse.id);
        }

        chrome.tabs.sendMessage(
          tabToUse.id,
          {
            action: "WRITE_PROMPT",
            text: nextPrompt.text,
            request_id: nextPrompt.request_id,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              busyTabs.delete(tabToUse.id);
              if (nextPrompt.request_id) requestTabMap.delete(nextPrompt.request_id);
              promptQueue.push(nextPrompt);
              flushQueueSoon();
            }
          }
        );
    }

    if (remainingPrompts.length > 0) {
        promptQueue.push(...remainingPrompts);
    }
  });
}

connect();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  if (!tab || !tab.url) return;
  if (isSupportedAiUrl(tab.url)) {
      ensureContentScript(tabId, tab.url);
  }
});
