"""Shared helpers: source labels, bounded requests, and local sample HTTP."""
from pathlib import Path
from contextlib import contextmanager
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
import requests

SAMPLES = Path(__file__).resolve().parent / "samples"

def sample(name):
    return (SAMPLES / name).read_text(encoding="utf-8")

def fetch_once(url, headers=None):
    try:
        res = requests.get(url, timeout=10, headers=headers)
        print("HTTP 状态码：", res.status_code)
        res.raise_for_status()
        res.encoding = "utf-8"
        return res.text
    except requests.RequestException as error:
        print("网页获取失败：", type(error).__name__)
        print("停止请求，不重试或突破限制。")
        return None

@contextmanager
def local_sample_server(name="scout.html"):
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            if self.path != "/" + name:
                self.send_error(404)
                return
            body = sample(name).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        def log_message(self, *args):
            pass
    server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    worker = Thread(target=server.serve_forever, daemon=True)
    worker.start()
    try:
        yield f"http://127.0.0.1:{server.server_port}/{name}"
    finally:
        server.shutdown()
        server.server_close()
        worker.join()
