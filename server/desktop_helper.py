"""
Ubuntu masaüstü için küçük bir \"Prompt Geliştir\" butonu.

Kullanım akışı:
- Herhangi bir uygulamada (örneğin Cursor) metni seçip Ctrl+C ile kopyala.
- Bu küçük penceredeki \"Prompt Geliştir\" butonuna tıkla.
- Pano içeriği ChatBridge `/prompt/expand` endpoint'ine gönderilir ve
  genişletilmiş metin tekrar panoya yazılır (Ctrl+V ile yapıştırabilirsin).
"""

import sys
from dataclasses import dataclass
from typing import Optional

import requests
import pyperclip
import tkinter as tk
from tkinter import messagebox


@dataclass
class HelperConfig:
    server_url: str = "http://127.0.0.1:3000/prompt/expand"
    request_timeout: int = 120


class ClipboardService:
    """Panodan metin okuma/yazma işlemlerini soyutlar."""

    @staticmethod
    def read_text() -> str:
        try:
            return pyperclip.paste() or ""
        except pyperclip.PyperclipException:
            return ""

    @staticmethod
    def write_text(text: str) -> None:
        try:
            pyperclip.copy(text)
        except pyperclip.PyperclipException:
            pass


class PromptExpandClient:
    """ChatBridge sunucusuna istek atan basit HTTP istemcisi."""

    def __init__(self, config: HelperConfig) -> None:
        self._config = config

    def expand(self, text: str) -> Optional[str]:
        payload = {"text": text}
        try:
            resp = requests.post(
                self._config.server_url,
                json=payload,
                timeout=self._config.request_timeout,
            )
        except requests.RequestException as exc:
            print(f"[PromptHelper] İstek hatası: {exc}", file=sys.stderr)
            return None

        if resp.status_code != 200:
            print(
                f"[PromptHelper] HTTP {resp.status_code}: {resp.text}",
                file=sys.stderr,
            )
            return None

        try:
            data = resp.json()
            return data.get("expanded") or None
        except ValueError:
            print("[PromptHelper] JSON parse edilemedi.", file=sys.stderr)
            return None


class HelperWindow(tk.Tk):
    """Her yerden kullanılabilen küçük masaüstü Prompt Geliştir penceresi."""

    def __init__(self, config: Optional[HelperConfig] = None) -> None:
        super().__init__()
        self._config = config or HelperConfig()
        self._clipboard = ClipboardService()
        self._client = PromptExpandClient(self._config)

        self.title("Prompt Geliştir")
        self.geometry("260x120")
        self.resizable(False, False)
        # Üstte kalsın
        self.attributes("-topmost", True)

        info = tk.Label(
            self,
            text="1) Metni seç + Ctrl+C\n2) Aşağıdaki butona bas\n3) Ctrl+V ile yapıştır",
            justify="left",
        )
        info.pack(padx=8, pady=(8, 4), anchor="w")

        self._status_var = tk.StringVar(value="")
        self._button = tk.Button(
            self,
            text="Prompt Geliştir",
            command=self._on_click,
            bg="#bbdefb",
        )
        self._button.pack(padx=8, pady=4, fill=tk.X)

        self._status_label = tk.Label(self, textvariable=self._status_var, fg="gray")
        self._status_label.pack(padx=8, pady=(0, 4), anchor="w")

    def _on_click(self) -> None:
        text = self._clipboard.read_text().strip()
        if not text:
            messagebox.showinfo(
                "Bilgi", "Önce başka bir uygulamada metni seçip Ctrl+C ile kopyalayın."
            )
            return

        self._button.config(state=tk.DISABLED, text="Genişletiliyor...")
        self._status_var.set("Sunucuya gönderiliyor...")
        self.update_idletasks()

        expanded = self._client.expand(text)
        if not expanded:
            self._status_var.set("Genişletme başarısız.")
            self._button.config(state=tk.NORMAL, text="Prompt Geliştir")
            return

        self._clipboard.write_text(expanded)
        self._status_var.set("Genişletildi, Ctrl+V ile yapıştırabilirsiniz.")
        self._button.config(state=tk.NORMAL, text="Prompt Geliştir")


def main() -> None:
    app = HelperWindow()
    app.mainloop()


if __name__ == "__main__":
    main()
