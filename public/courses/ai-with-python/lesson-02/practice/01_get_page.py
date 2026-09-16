"""01: fetch scout HTML and find three demon names in the output."""
import argparse
from common import fetch_once, local_sample_server

parser = argparse.ArgumentParser()
parser.add_argument("--url", help="侦察记录站的完整 HTTP/HTTPS 网址；不填则请求本机同一份网页")
args = parser.parse_args()

if args.url:
    print("来源：侦察记录站网址", args.url)
    content = fetch_once(args.url)
else:
    print("来源：本机侦察记录站，发出真实 HTTP 请求")
    with local_sample_server() as url:
        content = fetch_once(url)

if content is None:
    raise SystemExit("未取得网页，请检查地址与连接后重新运行。")
print(content)
print("完成检查：在 HTML 输出中找到三个恶魔的名字。")
