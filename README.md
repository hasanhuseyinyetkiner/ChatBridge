# 🤖 ChatBridge: ChatGPT API Bridge

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

ChatBridge is a bridge project that allows you to use ChatGPT programmatically via a local FastAPI server and a browser extension. It enables you to use your own browser session as an API without the need for heavy libraries like Puppeteer or Selenium.

## ✨ Features

- **Fast:** Real-time communication via WebSockets.
- **Secure:** Uses your own browser session and login credentials.
- **Easy Setup:** No complex driver configurations required.
- **Robust:** Advanced DOM manipulation ensures stability against ChatGPT updates.
- **Lightweight:** Built with FastAPI and core Web technologies.

---

## 🛠️ Setup Instructions

### 1. Server Setup (Python)

The server communicates with the browser extension and provides an HTTP POST endpoint for your requests.

```bash
# Clone the repository
git clone https://github.com/hasanhuseyinyetkiner/ChatBridge.git
cd ChatBridge

# Install dependencies
pip install -r server/requirements.txt

# Start the server
python server/server.py
```
*The server will run at `http://localhost:3000` by default.*

### 2. Browser Extension Setup

1. Go to the extensions page in your browser (Chrome or Edge):
   - `chrome://extensions` or `edge://extensions`
2. Enable **Developer Mode** in the top right corner.
3. Click the **Load unpacked** button.
4. Select the `extension` folder from this project.

---

## 🚀 How It Works

1. **Open ChatGPT:** Open [https://chatgpt.com](https://chatgpt.com) in your browser and ensure you are logged in.
2. **Check Connection:** When you click the extension icon, you should see the "Connected" status.
3. **Send Request:** You can now query ChatGPT from any language or terminal:

### Environment Information
The following configurations are set for the project's test and main server environments:
- **Main Server:** `192.168.101.67:3005`
- **Admin Panel:** Port `3006`
- **Test Panel:** `192.168.102.162:8080`

### Example Usage (cURL)
```bash
curl -X POST http://localhost:3000/chat \
     -H "Content-Type: application/json" \
     -d '{"prompt": "How to use list comprehensions in Python? Explain with an example."}'
```

### Example Response
```json
{
  "status": "success",
  "gpt_response": "List comprehensions in Python provide a concise way to create lists..."
}
```

---

## 🏗️ Technical Architecture

- **FastAPI:** Serves the external API.
- **WebSockets:** Provides bidirectional, low-latency communication between the server and the browser extension.
- **Content Script:** Injects the prompt into the ChatGPT web page and monitors for completion to extract the result.

---

## 📂 Project Structure

```text
extension/        # Browser extension files (JS, HTML, Manifest)
server/           # FastAPI server and requirements
README.md         # This documentation
LICENSE           # MIT License
```

---

## ⚠️ Important Notes

- **Tab Activity:** The ChatGPT tab must remain **open** in your browser. If the tab is closed, the API will return `503 Service Unavailable`.
- **Updates:** ChatGPT's interface is updated frequently. If extraction fails, selectors in `extension/content.js` may need updating.

## 📄 License

This project is licensed under the **MIT** License. See the [LICENSE](LICENSE) file for details.
