import os
import re
import threading
import time
import queue
import requests
import subprocess
import signal
import tkinter as tk
from tkinter import filedialog, messagebox
from tkinter.scrolledtext import ScrolledText

DEFAULT_PROMPT_TEMPLATE = (
    "Aşağıdaki konu hakkında ÇOK kapsamlı, teknik ve detaylı bir Markdown dökümantasyonu üret. "
    "En az 8 ana başlık ve her biri için alt başlıklar kullan. Örnekler, kullanım senaryoları, "
    "avantaj/dezavantajlar, güvenlik/etik riskler ve pratik ipuçları ekle. "
    "Her bölümde kısa özet ve kritik notlar ver. Mümkün olduğunca uzun ve doyurucu yaz.\n\n"
    "Konu: {topic}"
)

class DocGeneratorApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("ChatBridge - Dökümantasyon Üretici & Server Paneli")
        self.geometry("1000x800")

        self.server_url_var = tk.StringVar(value="http://127.0.0.1:3000/chat")
        self.server_port_var = tk.StringVar(value="3000")
        self.output_file_var = tk.StringVar(value=os.path.abspath("dokumantasyon.md"))
        self.output_format_var = tk.StringVar(value="Markdown")
        self.model_var = tk.StringVar(value="gpt-4")
        self.max_tabs_var = tk.StringVar(value="3")
        self.skip_existing_var = tk.BooleanVar(value=True)

        self.stop_event = threading.Event()
        self.workers = []
        self.topic_queue = None
        self.file_lock = threading.Lock()
        self.log_queue = queue.Queue()
        
        # Server yönetimi
        self.server_process = None
        self.server_thread = None

        self._build_ui()
        self.after(200, self._flush_logs)
        self.protocol("WM_DELETE_WINDOW", self._on_closing)

    def _build_ui(self):
        # Üst Panel: Server Kontrol
        server_frame = tk.LabelFrame(self, text="Server Yönetimi", padx=10, pady=5)
        server_frame.pack(fill=tk.X, padx=12, pady=5)

        self.server_btn = tk.Button(server_frame, text="Server Başlat", command=self.toggle_server, bg="#e1f5fe")
        self.server_btn.pack(side=tk.LEFT, padx=5)

        self.server_status_label = tk.Label(server_frame, text="Durum: Durduruldu", fg="red")
        self.server_status_label.pack(side=tk.LEFT, padx=10)

        tk.Label(server_frame, text="Port:").pack(side=tk.LEFT, padx=(10, 0))
        tk.Entry(server_frame, textvariable=self.server_port_var, width=6).pack(side=tk.LEFT, padx=5)

        self.clean_btn = tk.Button(server_frame, text="Portu Temizle", command=self.clean_port, bg="#ffccbc")
        self.clean_btn.pack(side=tk.LEFT, padx=5)

        tk.Label(server_frame, text="URL:").pack(side=tk.LEFT, padx=(20, 0))
        tk.Entry(server_frame, textvariable=self.server_url_var, width=30).pack(side=tk.LEFT, padx=5)

        # Ayarlar Paneli
        top_frame = tk.LabelFrame(self, text="Dökümantasyon Ayarları", padx=10, pady=5)
        top_frame.pack(fill=tk.X, padx=12, pady=5)

        tk.Label(top_frame, text="Model:").grid(row=0, column=0, sticky="w")
        tk.Entry(top_frame, textvariable=self.model_var, width=12).grid(row=0, column=1, sticky="w", padx=5)

        tk.Label(top_frame, text="Max Sekme:").grid(row=0, column=2, sticky="w", padx=(15, 0))
        tk.Entry(top_frame, textvariable=self.max_tabs_var, width=5).grid(row=0, column=3, sticky="w", padx=5)

        tk.Checkbutton(top_frame, text="Mevcutları Atla", variable=self.skip_existing_var).grid(row=0, column=4, padx=15)

        tk.Label(top_frame, text="Çıktı:").grid(row=1, column=0, sticky="w", pady=5)
        tk.Entry(top_frame, textvariable=self.output_file_var, width=60).grid(row=1, column=1, columnspan=3, sticky="we", padx=5)
        tk.Button(top_frame, text="Gözat", command=self._browse_output).grid(row=1, column=4, sticky="w")
        tk.Button(top_frame, text="Aç", command=self._open_output).grid(row=1, column=5, sticky="w", padx=5)

        tk.Label(top_frame, text="Format:").grid(row=2, column=0, sticky="w", pady=5)
        format_menu = tk.OptionMenu(top_frame, self.output_format_var, "Markdown", "Metin")
        format_menu.grid(row=2, column=1, sticky="w", pady=5)

        top_frame.columnconfigure(1, weight=1)

        # Editör Paneli
        main_frame = tk.Frame(self)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=12, pady=5)

        left_frame = tk.Frame(main_frame)
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(0, 5))
        tk.Label(left_frame, text="Konu Başlıkları:").pack(anchor="w")
        self.topics_text = ScrolledText(left_frame, height=12)
        self.topics_text.pack(fill=tk.BOTH, expand=True)

        right_frame = tk.Frame(main_frame)
        right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=(5, 0))
        tk.Label(right_frame, text="Prompt Şablonu:").pack(anchor="w")
        self.prompt_text = ScrolledText(right_frame, height=12)
        self.prompt_text.pack(fill=tk.BOTH, expand=True)
        self.prompt_text.insert(tk.END, DEFAULT_PROMPT_TEMPLATE)

        # Log ve İşlem Paneli
        log_frame = tk.LabelFrame(self, text="Sistem Logları", padx=10, pady=5)
        log_frame.pack(fill=tk.BOTH, expand=False, padx=12, pady=5)

        self.log_text = ScrolledText(log_frame, height=12, bg="#f5f5f5", state=tk.DISABLED)
        self.log_text.pack(fill=tk.BOTH, expand=True)

        control_frame = tk.Frame(self)
        control_frame.pack(fill=tk.X, padx=12, pady=10)

        self.start_button = tk.Button(control_frame, text="Üretimi Başlat 🚀", command=self.start_generation, 
                                      bg="#c8e6c9", font=("Arial", 10, "bold"), padx=20)
        self.start_button.pack(side=tk.LEFT)

        self.stop_button = tk.Button(control_frame, text="Durdur 🛑", command=self.stop_generation, 
                                     state=tk.DISABLED, bg="#ffcdd2")
        self.stop_button.pack(side=tk.LEFT, padx=10)

    def toggle_server(self):
        if self.server_process:
            self.stop_server()
        else:
            self.start_server()

    def clean_port(self):
        port = self.server_port_var.get().strip()
        if not port: return
        self.log(f"Port {port} temizleniyor...")
        try:
            if os.name != "nt":
                # Fuser ile öldür
                subprocess.run(f"fuser -k -n tcp {port}", shell=True, check=False)
                # Lsof ile kontrol et ve öldür (alternatif)
                subprocess.run(f"lsof -t -i:{port} | xargs kill -9", shell=True, check=False)
            else:
                 # Windows için netstat bul ve taskkill (basit hali)
                 # Windows implementasyonu daha karmaşık olabilir, şimdilik pass
                 pass
            
            time.sleep(1) # Portun serbest kalması için bekle
            self.log(f"Port {port} temizleme işlemi tamamlandı.")
        except Exception as e:
            self.log(f"Port temizleme hatası: {e}")

    def start_server(self):
        # Portu otomatik temizleyip başlatma seçeneği de eklenebilir
        server_script = os.path.join(os.path.dirname(__file__), "server.py")
        if not os.path.exists(server_script):
            self.log("HATA: server.py bulunamadı!")
            return

        # URL'yi port ile senkronize et (isteğe bağlı)
        port = self.server_port_var.get().strip()
        self.server_url_var.set(f"http://127.0.0.1:{port}/chat")

        try:
            self.server_process = subprocess.Popen(
                ["python3", server_script],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                env={**os.environ, "PORT": port}, # Portu env olarak geçebiliriz (server.py'da okumak lazım)
                preexec_fn=os.setsid if os.name != "nt" else None
            )
            self.server_btn.config(text="Server Durdur", bg="#ffecb3")
            self.server_status_label.config(text="Durum: Çalışıyor ✅", fg="green")
            
            # Log okuma thread'i
            self.server_thread = threading.Thread(target=self._read_server_output, daemon=True)
            self.server_thread.start()
            self.log(f"Server port {port} üzerinde başlatılıyor...")
        except Exception as e:
            self.log(f"Server başlatılamadı: {e}")

    def stop_server(self):
        if self.server_process:
            try:
                if os.name == "nt":
                    self.server_process.terminate()
                else:
                    os.killpg(os.getpgid(self.server_process.pid), signal.SIGTERM)
                self.server_process = None
            except:
                pass
            self.server_btn.config(text="Server Başlat", bg="#e1f5fe")
            self.server_status_label.config(text="Durum: Durduruldu", fg="red")
            self.log("Server durduruldu.")

    def _read_server_output(self):
        if not self.server_process or not self.server_process.stdout:
            return
        for line in iter(self.server_process.stdout.readline, ""):
            if line:
                strip_line = line.strip()
                self.log(f"[Server] {strip_line}")
                if "address already in use" in strip_line.lower():
                    self.log("HATA: Port kullanımda! 'Portu Temizle' butonunu kullanın.")
                    self.after(0, self.stop_server) # Otomatik temizle sinyali
        self.after(0, self._on_server_exit)

    def _on_server_exit(self):
        if self.server_process:
            self.stop_server()
            self.log("UYARI: Server beklenmedik şekilde kapandı.")

    def _on_closing(self):
        self.stop_server()
        self.destroy()


    def _browse_output(self):
        path = filedialog.asksaveasfilename(
            title="Markdown dosyası seç",
            defaultextension=".md",
            filetypes=[("Markdown", "*.md"), ("All Files", "*")]
        )
        if path:
            self.output_file_var.set(path)

    def _open_output(self):
        path = self.output_file_var.get().strip()
        if not path:
            messagebox.showwarning("Uyarı", "Önce bir çıktı dosyası seçin.")
            return
        if not os.path.exists(path):
            messagebox.showwarning("Uyarı", "Dosya bulunamadı.")
            return
        try:
            if os.name == "nt":
                os.startfile(path)  # type: ignore[attr-defined]
            elif os.name == "posix":
                os.system(f"xdg-open '{path}'")
            else:
                messagebox.showinfo("Bilgi", f"Dosya yolu: {path}")
        except Exception as exc:
            messagebox.showerror("Hata", f"Dosya açılamadı: {exc}")

    def _flush_logs(self):
        while not self.log_queue.empty():
            msg = self.log_queue.get_nowait()
            self.log_text.config(state=tk.NORMAL)
            self.log_text.insert(tk.END, msg + "\n")
            self.log_text.see(tk.END)
            self.log_text.config(state=tk.DISABLED)
        self.after(200, self._flush_logs)

    def log(self, message):
        self.log_queue.put(message)

    def start_generation(self):
        server_url = self.server_url_var.get().strip()
        output_path = self.output_file_var.get().strip()
        template = self.prompt_text.get("1.0", tk.END).strip()
        topics_raw = self.topics_text.get("1.0", tk.END).splitlines()
        topics = [t.strip() for t in topics_raw if t.strip()]

        if not server_url:
            messagebox.showwarning("Uyarı", "Server URL boş olamaz.")
            return
        if not output_path:
            messagebox.showwarning("Uyarı", "Çıktı dosyası seçilmeli.")
            return
        if not topics:
            messagebox.showwarning("Uyarı", "Konu listesi boş.")
            return
        if "{topic}" not in template:
            messagebox.showwarning("Uyarı", "Prompt şablonunda {topic} bulunmalı.")
            return

        try:
            max_tabs = int(self.max_tabs_var.get().strip())
        except ValueError:
            max_tabs = 3
        max_tabs = max(1, min(3, max_tabs))

        existing_topics = set()
        if self.skip_existing_var.get() and os.path.exists(output_path):
            existing_topics = self._read_existing_topics(output_path)
            if existing_topics:
                self.log(f"Mevcut başlıklar okunuyor: {len(existing_topics)} adet.")

        self.topic_queue = queue.Queue()
        for topic in topics:
            if self.skip_existing_var.get() and topic in existing_topics:
                self.log(f"Atlandı (zaten var): {topic}")
                continue
            self.topic_queue.put(topic)

        if self.topic_queue.empty():
            self.log("İşlenecek yeni başlık bulunamadı.")
            return

        self.stop_event.clear()
        self.start_button.config(state=tk.DISABLED)
        self.stop_button.config(state=tk.NORMAL)

        worker_count = min(max_tabs, self.topic_queue.qsize())
        self.log(f"Başlatıldı. Worker sayısı: {worker_count}")

        self.workers = []
        for i in range(worker_count):
            worker = threading.Thread(target=self._worker_loop, args=(i, server_url, template, output_path), daemon=True)
            self.workers.append(worker)
            worker.start()

    def stop_generation(self):
        self.stop_event.set()
        self.start_button.config(state=tk.NORMAL)
        self.stop_button.config(state=tk.DISABLED)
        self.log("Durdurma sinyali gönderildi.")

    def _worker_loop(self, worker_id, server_url, template, output_path):
        retry_map = {}
        while not self.stop_event.is_set():
            try:
                topic = self.topic_queue.get_nowait()
            except queue.Empty:
                break

            self.log(f"[W{worker_id}] İşleniyor: {topic}")
            prompt = template.format(topic=topic)

            success, content = self._send_request(server_url, prompt)
            if success:
                self._append_output(output_path, topic, content)
                self.log(f"[W{worker_id}] Tamamlandı: {topic}")
                continue

            retry_count = retry_map.get(topic, 0) + 1
            retry_map[topic] = retry_count
            if retry_count <= 5 and not self.stop_event.is_set():
                backoff = min(120, 5 * (2 ** (retry_count - 1)))
                self.log(f"[W{worker_id}] Hata, yeniden denenecek ({retry_count}/5): {topic} (bekleme {backoff}s)")
                time.sleep(backoff)
                self.topic_queue.put(topic)
            else:
                self.log(f"[W{worker_id}] Başarısız: {topic} (maksimum deneme aşıldı)")

        self.log(f"[W{worker_id}] Worker tamamlandı.")
        self.after(0, self._check_workers_done)

    def _check_workers_done(self):
        if all(not t.is_alive() for t in self.workers):
            self.start_button.config(state=tk.NORMAL)
            self.stop_button.config(state=tk.DISABLED)
            self.log("Tüm işler tamamlandı.")

    def _send_request(self, server_url, prompt):
        payload = {
            "model": self.model_var.get().strip() or "gpt-4",
            "prompt": prompt
        }
        try:
            response = requests.post(server_url, json=payload, timeout=600)
        except requests.RequestException as exc:
            self.log(f"Bağlantı hatası: {exc}")
            return False, ""

        if response.status_code != 200:
            self.log(f"HTTP {response.status_code}: {response.text}")
            return False, ""

        try:
            data = response.json()
        except ValueError:
            self.log("Yanıt JSON parse edilemedi.")
            return False, ""

        try:
            content = data["choices"][0]["message"]["content"]
        except (KeyError, IndexError, TypeError):
            self.log("Yanıt formatı beklenenden farklı.")
            return False, ""

        return True, content

    def _append_output(self, output_path, topic, content):
        with self.file_lock:
            os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
            with open(output_path, "a", encoding="utf-8") as f:
                output_format = self.output_format_var.get()
                cleaned_content = content.strip()
                if output_format == "Metin":
                    f.write(f"=== {topic} ===\n\n")
                    f.write(cleaned_content + "\n\n")
                    f.write("\n")
                else:
                    f.write(f"# {topic}\n\n")
                    f.write(cleaned_content + "\n\n")
                    f.write("---\n\n")

    def _read_existing_topics(self, output_path):
        topics = set()
        output_format = self.output_format_var.get()
        try:
            with open(output_path, "r", encoding="utf-8") as f:
                for line in f:
                    if output_format == "Metin":
                        if line.startswith("=== ") and line.strip().endswith(" ==="):
                            topics.add(line.strip()[4:-4].strip())
                    else:
                        if line.startswith("# "):
                            topics.add(line[2:].strip())
        except Exception as exc:
            self.log(f"Mevcut başlıklar okunamadı: {exc}")
        return topics


if __name__ == "__main__":
    app = DocGeneratorApp()
    app.mainloop()
