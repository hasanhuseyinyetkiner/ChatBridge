document.addEventListener('DOMContentLoaded', () => {
    const serverStatus = document.getElementById('server-status');
    const openDevToolsBtn = document.getElementById('open-devtools');
    const refreshScriptsBtn = document.getElementById('refresh-scripts');
    const openGptBtn = document.getElementById('open-chatgpt');
    const openGeminiBtn = document.getElementById('open-gemini');
    const testCerebrasBtn = document.getElementById('test-cerebras');
    const providerBtns = document.querySelectorAll('.provider-btn');
    const cerebrasModelSelect = document.getElementById('cerebras-model-select');
    const cerebrasModelInput = document.getElementById('cerebras-model');

    const manageKeysBtn = document.getElementById('manage-keys-btn');
    const keysManagementDiv = document.getElementById('keys-management');
    const keysInput = document.getElementById('keys-input');
    const saveKeysBtn = document.getElementById('save-keys');

    // Kayıtlı sağlayıcıyı, modeli ve anahtarları yükle
    chrome.storage.local.get(['selectedProvider', 'cerebrasModel', 'cerebrasKeys'], (result) => {
        const provider = result.selectedProvider || 'chatgpt';
        const model = result.cerebrasModel || 'gpt-oss-120b';
        const keys = result.cerebrasKeys || [];

        updateProviderButtons(provider);
        if (cerebrasModelInput) cerebrasModelInput.value = model;
        toggleCerebrasModel(provider);

        if (keys.length > 0) {
            keysInput.value = keys.join('\n');
        }
    });

    function updateProviderButtons(activeProvider) {
        providerBtns.forEach(btn => {
            if (btn.dataset.provider === activeProvider) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function toggleCerebrasModel(provider) {
        if (cerebrasModelSelect) {
            cerebrasModelSelect.style.display = (provider === 'cerebras') ? 'block' : 'none';
        }
    }

    providerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const provider = btn.dataset.provider;
            chrome.storage.local.set({ selectedProvider: provider }, () => {
                updateProviderButtons(provider);
                toggleCerebrasModel(provider);
                console.log("Sağlayıcı güncellendi:", provider);
            });
        });
    });

    if (cerebrasModelInput) {
        cerebrasModelInput.addEventListener('change', () => {
            const model = cerebrasModelInput.value;
            chrome.storage.local.set({ cerebrasModel: model }, () => {
                console.log("Cerebras modeli güncellendi:", model);
            });
        });
    }

    // Anahtar Yönetimi
    manageKeysBtn.addEventListener('click', () => {
        const isHidden = keysManagementDiv.style.display === 'none';
        keysManagementDiv.style.display = isHidden ? 'block' : 'none';
    });

    saveKeysBtn.addEventListener('click', () => {
        const keysText = keysInput.value.trim();
        const keysArray = keysText.split('\n').map(k => k.trim()).filter(k => k.length > 0);

        if (keysArray.length === 0) {
            alert("Lütfen en az bir geçerli API anahtarı girin.");
            return;
        }

        chrome.storage.local.set({ cerebrasKeys: keysArray }, () => {
            chrome.runtime.sendMessage({ action: "UPDATE_KEYS", keys: keysArray }, (response) => {
                alert(`${keysArray.length} adet anahtar başarıyla kaydedildi ve aktif edildi.`);
                keysManagementDiv.style.display = 'none';
            });
        });
    });

    // Durum kontrolü (background'dan al)
    function updateStatus() {
        chrome.runtime.sendMessage({ action: "GET_STATUS" }, (response) => {
            if (response) {
                if (response.connected) {
                    serverStatus.textContent = "Bağlı ✅";
                    serverStatus.className = "status-value connected";
                } else {
                    serverStatus.textContent = "Bağlı Değil ❌";
                    serverStatus.className = "status-value disconnected";
                }
            }
        });
    }

    updateStatus();
    setInterval(updateStatus, 2000);

    // F12 Butonu İşlevi
    openDevToolsBtn.addEventListener('click', () => {
        const extId = chrome.runtime.id;
        chrome.tabs.create({ url: `chrome://extensions/?id=${extId}` });
    });

    openGptBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: "https://chatgpt.com" });
    });

    openGeminiBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: "https://gemini.google.com" });
    });

    if (testCerebrasBtn) {
        testCerebrasBtn.addEventListener('click', async () => {
            const originalText = testCerebrasBtn.innerHTML;
            const selectedModel = cerebrasModelInput ? cerebrasModelInput.value : 'cerebras';

            testCerebrasBtn.disabled = true;
            testCerebrasBtn.innerHTML = "<span>⏳</span> Bekliyor...";

            try {
                const response = await fetch('http://localhost:3000/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: selectedModel,
                        prompt: 'Merhaba, bu bir extension test mesajıdır. Kısa bir yanıt ver.'
                    })
                });
                const text = await response.text();
                alert("Cerebras Yanıtı (" + selectedModel + "):\n\n" + text);
            } catch (err) {
                alert("Hata: Server kapalı olabilir veya bağlantı sorunu var.\n" + err.message);
            } finally {
                testCerebrasBtn.disabled = false;
                testCerebrasBtn.innerHTML = originalText;
            }
        });
    }

    refreshScriptsBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: "REFRESH_TABS" }, (response) => {
            alert("Sekmeler yenilendi ve scriptler enjekte edildi.");
            window.close();
        });
    });
});
