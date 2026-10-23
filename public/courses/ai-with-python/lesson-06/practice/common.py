"""Serve the lesson's intelligence pages through persistent local HTTP."""
import atexit
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

SAMPLES = Path(__file__).resolve().parent / "samples"
_server = None
_worker = None


def stop_sample_server():
    global _server, _worker
    if _server is not None:
        _server.shutdown()
        _server.server_close()
        _worker.join(timeout=2)
        _server = None
        _worker = None


def local_sample_server():
    """Reuse one background server until the notebook kernel exits."""
    global _server, _worker
    if _server is not None:
        return f"http://127.0.0.1:{_server.server_port}"

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            name = self.path.lstrip("/")
            if name not in {"battle-towers.html", "battle-towers-current.html", "boss-intel.html"}:
                self.send_error(404)
                return
            body = (SAMPLES / name).read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, *args):
            pass

    _server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    _worker = Thread(target=_server.serve_forever, daemon=True)
    _worker.start()
    return f"http://127.0.0.1:{_server.server_port}"


atexit.register(stop_sample_server)
