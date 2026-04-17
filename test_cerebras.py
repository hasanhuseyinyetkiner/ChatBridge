import requests
import json

api_key = "csk-w4xm8khw8pfmwy2hepmp2w9ew88w6vy2k4j5k5yjhhvtjeyh"
url = "https://api.cerebras.ai/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}
data = {
    "model": "llama3.1-8b",
    "messages": [{"role": "user", "content": "Hello, are you working?"}],
    "max_completion_tokens": 10
}

try:
    response = requests.post(url, headers=headers, json=data, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
