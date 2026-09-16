"""02: extract each demon's name, location, attribute and weakness together."""
import argparse
from bs4 import BeautifulSoup
from common import fetch_once, local_sample_server

def parse_records(content):
    soup = BeautifulSoup(content, "html.parser")
    records = soup.find_all("article", class_="record")
    result = []
    for record in records:
        name_dom = record.find("h2", class_="name")
        location_dom = record.find("span", class_="location")
        attribute_dom = record.find("span", class_="attribute")
        weakness_dom = record.find("span", class_="weakness")
        fields = (name_dom, location_dom, attribute_dom, weakness_dom)
        if any(field is None for field in fields):
            print("一条记录缺少字段，请对照 HTML 检查。")
            continue
        result.append(tuple(field.get_text(strip=True) for field in fields))
    return result

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", help="与练习 01 相同的侦察记录站网址")
    args = parser.parse_args()
    if args.url:
        url = args.url
        print("来源：侦察记录站网址", url)
        content = fetch_once(url)
    else:
        print("来源：本机侦察记录站，发出真实 HTTP 请求")
        with local_sample_server() as url:
            content = fetch_once(url)
    if content is None:
        raise SystemExit("未取得网页，请检查地址与连接后重新运行。")
    rows = parse_records(content)
    if not rows:
        raise SystemExit("未找到完整敌情，请对照返回 HTML 检查。")
    for name, location, attribute, weakness in rows:
        print(name, "|", location, "|", attribute, "|", weakness)
