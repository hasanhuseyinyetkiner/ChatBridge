import requests
import json

keys = [
    "csk-w4xm8khw8pfmwy2hepmp2w9ew88w6vy2k4j5k5yjhhvtjeyh",
    "csk-h8twmjnf6e9r66ke8j9r55xe56j5ew6j8fw98ynx2t96kmx5",
    "csk-2fd4vwxpm5th8v6x6jcn952e8cwcw8fchp8y24xm5pwyc5mf"
]

url = "https://api.cerebras.ai/v1/chat/completions"

for i, key in enumerate(keys):
    print(f"Testing Key {i} ({key[:10]}...):")
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama3.1-8b",
        "messages": [{"role": "user", "content": "Hello, say 'Key works'."}]
    }
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        if response.status_code == 200:
            print(f"SUCCESS: {response.json()['choices'][0]['message']['content']}")
        else:
            print(f"FAILED: HTTP {response.status_code} - {response.text}")
    except Exception as e:
        print(f"ERROR: {str(e)}")
    print("-" * 20)
