"""Fetch one scout page. Every run performs one actual HTTP GET."""
import argparse
import requests
from common import local_sample_server

parser = argparse.ArgumentParser()
parser.add_argument("--url", help="老师提供的完整 HTTP/HTTPS 网址")
parser.add_argument("--updated", action="store_true", help="请求本机第二版教学记录")
args = parser.parse_args()
if args.url and args.updated:
    parser.error("--url 与 --updated 二选一；在线第二版请直接提供它的网址。")
try:
    if args.url:
        url = args.url.strip()
        print("来源：前线侦察网址", url)
        res = requests.get(url, timeout=10)
    else:
        name = "scout-updated.html" if args.updated else "scout.html"
        print("来源：本机前线侦察记录", name)
        with local_sample_server(name) as url:
            res = requests.get(url, timeout=10)
    print("HTTP 状态码：", res.status_code)
    res.raise_for_status()
    res.encoding = "utf-8"
    print(res.text)
except requests.RequestException as error:
    raise SystemExit("获取失败，请检查地址和连接：" + type(error).__name__)
print("核对本次正文中的炎角兽和出没地点；获取网页不等于已经制定防御方案。")
