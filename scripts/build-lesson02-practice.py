"""Build the self-contained lesson 02 practice pack and teaching HTML assets."""
from pathlib import Path
import json
import zipfile

root = Path(__file__).resolve().parents[1]
out = root / 'public/courses/ai-with-python/lesson-02/practice'
(out / 'samples').mkdir(parents=True, exist_ok=True)
scout = (root / 'public/scout.html').read_text(encoding='utf-8')
(out/'samples/scout.html').write_text(scout, encoding='utf-8')
for obsolete in ('kingdom.html', 'kingdom-changed.html', 'movie-detail.html'):
    (out / 'samples' / obsolete).unlink(missing_ok=True)
(out / '04_movie_details_optional.py').unlink(missing_ok=True)
movies = '''<!doctype html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><title>豆瓣电影 Top 250 · 保存节选</title></head>
<body>
<h1>豆瓣电影 Top 250 · 保存节选</h1>
<main>
<div class="item">
  <div class="info">
    <div class="hd"><a href="https://movie.douban.com/subject/1292052/">
      <span class="title">肖申克的救赎</span>
      <span class="title"> / The Shawshank Redemption</span>
    </a></div>
    <div class="bd"><div><span class="rating_num" property="v:average">9.7</span></div></div>
  </div>
</div>
<div class="item">
  <div class="info">
    <div class="hd"><a href="https://movie.douban.com/subject/1291546/">
      <span class="title">霸王别姬</span>
    </a></div>
    <div class="bd"><div><span class="rating_num" property="v:average">9.6</span></div></div>
  </div>
</div>
<div class="item">
  <div class="info">
    <div class="hd"><a href="https://movie.douban.com/subject/1292722/">
      <span class="title">泰坦尼克号</span>
      <span class="title"> / Titanic</span>
    </a></div>
    <div class="bd"><div><span class="rating_num" property="v:average">9.5</span></div></div>
  </div>
</div>
</main>
</body>
</html>
'''
(out/'samples/movies.html').write_text(movies, encoding='utf-8')
files = {}
files['requirements.txt'] = 'requests>=2.32\nbeautifulsoup4>=4.12\n'
files['common.py'] = '''"""Shared helpers: source labels, bounded requests, and local sample HTTP."""
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
'''
files['01_get_page.py'] = '''"""01: fetch scout HTML and find three demon names in the output."""
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
'''
files['02_hot_news.py'] = '''"""02: extract each demon's name, location, attribute and weakness together."""
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
'''
movie_practice_cells = [
    'import requests\n\nfrom bs4 import BeautifulSoup',
    'url = "https://movie.douban.com/top250"\nheaders = {"User-Agent": "ClassroomStudy/1.0"}\nres = requests.get(url, headers=headers, timeout=10)\nres.raise_for_status()\nres.encoding = "utf-8"\nhtml = res.text',
    'soup = BeautifulSoup(html, "html.parser")\nfor item in soup.find_all("div", class_="item"):\n    title = item.find(class_="title")\n    if title is not None:\n        print(title.get_text(strip=True))',
]
files['03_movies.py'] = ('"""03: request Douban once, then print the first title of each movie."""\n'
                         + '\n\n'.join(movie_practice_cells) + '\n')
files['README.txt'] = '''第二课：勇士情报站

运行条件
Python 3.10 或以上，安装 requests 与 beautifulsoup4。
终端：python -m pip install -r requirements.txt
JupyterLab：%pip install requests beautifulsoup4
安装后如仍无法导入，请重启 Notebook 内核。

先解压整个文件夹，在其中打开“第二课练习.ipynb”，从上到下运行。
common.py 与 samples 文件夹必须和三个练习脚本保持在同一文件夹。
Notebook 内有可修改的核心代码。终端也可以按顺序运行：
python 01_get_page.py
python 02_hot_news.py
python 03_movies.py

默认来源与预期输出
01 在本机临时启动 HTTP 服务，requests 发出真实 GET 请求，
   输出状态码 200 和侦察记录站 HTML，结束后自动关闭该服务。
   在 HTML 输出中找到三个名字：炎角兽、藤甲魔、冰翼魔。
02 先请求同一份侦察记录站 HTML，再按每条记录解析四个字段，输出：
   炎角兽 | 北方峡谷 | 火焰 | 怕强光
   藤甲魔 | 迷雾森林 | 藤蔓 | 怕火
   冰翼魔 | 冰封山口 | 寒冰 | 怕热
03 亲手输入 Notebook 中的三个 Code 单元格，从上到下运行：
   导入工具 → 获取豆瓣网页 → 解析并输出电影标题。
   在每个 item 内，用 find 找到第一个 title，再获取它的文本。
   最终每行输出一个电影标题；实时结果以本次网页为准。

使用部署后的侦察记录站
python 01_get_page.py --url "https://pythonwithme.coze.site/scout.html"
python 02_hot_news.py --url "https://pythonwithme.coze.site/scout.html"
Notebook 中将 url 改成同一网址；练习 02 直接复用练习 01 的 res。
网址需已部署并能返回侦察记录站 HTML；获取失败时检查地址与连接后重新运行。
本机预览也可以在练习包文件夹运行：python -m http.server 8000 --directory samples
然后打开 http://localhost:8000/scout.html（仅当前电脑可用）。
samples/scout.html 直接复制自课程的 public/scout.html，全部记录都在 HTML 中。

解析方法
根据属性、寻找元素、获取文本。
先用 find_all("article", class_="record") 找到全部记录，
再在每条记录内部寻找 name、location、attribute、weakness 对应的元素。
class 是 HTML 属性名，attribute 是标记“恶魔属性”字段的 class 值。
get_text(strip=True) 取得文字，并去掉文字两端的空白。

电影案例：真实请求与保存节选
03_movies.py 与 Notebook 的课堂练习 03 默认访问豆瓣 Top 250，
只发送一次请求，不翻页，不自动重试，也不静默切换数据来源。
headers 的 User-Agent 描述客户端，不是身份认证，也不保证访问成功。
timeout=10 限制等待连接/读取数据的时间，不保证整个下载总共十秒内结束。
如果请求失败、返回验证页，或没有输出电影标题，先停止请求并核对网页内容。
需要继续练习时，可手动运行 Notebook 中明确标出的“改用保存节选”单元格：
from pathlib import Path
html = Path("samples/movies.html").read_text(encoding="utf-8")
print("数据来源：豆瓣页面保存节选")
然后只运行练习 03 的第三个解析单元格；不会再次发起网络请求。
保存节选的预期输出：
肖申克的救赎
霸王别姬
泰坦尼克号

电影样本来源
原网页：https://movie.douban.com/top250
核验日期：2026-09-08；普通请求返回 HTTP 200，页面包含 25 个 div.item。
samples/movies.html 保留当日页面前三条电影的标题、评分与相关嵌套结构，
省略图片、简介及无关节点，供离线核对；不是完整网页，也不代表实时榜单。

完成检查
课堂练习 01：亲手输入并运行请求代码，在 HTML 输出中找到三个恶魔的名字。
课堂练习 02：解析出每个恶魔的出没地点、属性、已知弱点，并与名字对应。
课堂练习 03：跟写三个单元格，输出每部电影的第一个标题，并与网页核对。

核对资料
Requests：https://requests.readthedocs.io/en/latest/user/quickstart/
Beautiful Soup：https://www.crummy.com/software/BeautifulSoup/bs4/doc/index.html
'''
for name, content in files.items():
    (out/name).write_text(content,encoding='utf-8')

def md(text): return {'cell_type':'markdown','metadata':{},'source':text.splitlines(True)}
def code(text): return {'cell_type':'code','execution_count':None,'metadata':{},'outputs':[],'source':text.splitlines(True)}
cells = [
    md('# 第二课：勇士情报站\n从上到下运行。沿用课件的前线侦察记录站，先取得 HTML，再解析敌情。'),
    code('%pip install requests beautifulsoup4'),
    md('## 课堂练习 01：在 HTML 中找到三个恶魔\n亲手输入并运行请求代码，然后在 HTML 输出中找到三个恶魔的名字。默认 url 留空，请求本机同一份网页；部署后可填入 https://pythonwithme.coze.site/scout.html。两种方式都发出真实 HTTP 请求。'),
    code('import requests\n\nfrom common import local_sample_server\n\nurl = ""  # 部署后填入 https://pythonwithme.coze.site/scout.html\nif url.strip():\n    url = url.strip()\n    print("来源：侦察记录站网址", url)\n    res = requests.get(url, timeout=10)\nelse:\n    print("来源：本机侦察记录站")\n    with local_sample_server() as url:\n        res = requests.get(url, timeout=10)\n\nprint("HTTP 状态码：", res.status_code)\nres.raise_for_status()\nres.encoding = "utf-8"\nprint(res.text)'),
    md('完成检查：状态码为 200；在 HTML 输出中找到“炎角兽”“藤甲魔”“冰翼魔”。发生错误就检查地址与连接，本单元格成功后再继续。'),
    md('## 课堂练习 02：解析三个恶魔的敌情\n保留并先运行上方练习 01 的代码。紧接着在下方新建三个 Code 单元格，按下面顺序跟写，每格按 Shift + Enter 运行。直接使用练习 01 得到的 res。'),
    code('from bs4 import BeautifulSoup\n\nsoup = BeautifulSoup(res.text, "html.parser")'),
    code('records = soup.find_all("article", class_="record")'),
    code('for record in records:\n    name = record.find("h2", class_="name")\n    location = record.find("span", class_="location")\n    attribute = record.find("span", class_="attribute")\n    weakness = record.find("span", class_="weakness")\n    print(name.get_text(strip=True))\n    print(location.get_text(strip=True),\n          attribute.get_text(strip=True),\n          weakness.get_text(strip=True))'),
    md('预期依次输出：\n```text\n炎角兽\n北方峡谷 火焰 怕强光\n藤甲魔\n迷雾森林 藤蔓 怕火\n冰翼魔\n冰封山口 寒冰 怕热\n```\n核对每个恶魔的地点、属性和已知弱点，确保属于同一条记录。'),
    md('## 课堂练习 03：为勇士挑选电影\n新建三个 Code 单元格，按顺序跟写：导入工具、获取网页、解析并输出电影标题。每格按 Shift + Enter 运行。'),
    *[code(text) for text in movie_practice_cells],
    md('完成检查：输出中每行是一个电影标题。find 在每个 item 内找到第一个 title，不重复打印同一部电影的其他语言标题。回到网页核对名称；实时结果以本次返回内容为准。请求报错、返回验证页或没有标题输出时，先停止请求并核对网页内容；需要继续练习可运行下方“改用保存节选”单元格，再运行第三个解析单元格。'),
    md('### 可选：改用保存节选\n仅在无法取得电影列表而需要继续练习时运行。运行后只回到上方第三个解析单元格，不再运行请求单元格。该单元格只读取本地保存节选，输出不代表实时网页。'),
    code('from pathlib import Path\nhtml = Path("samples/movies.html").read_text(encoding="utf-8")\nprint("数据来源：豆瓣页面保存节选")'),
    md('保存节选的输出对照：\n```text\n肖申克的救赎\n霸王别姬\n泰坦尼克号\n```'),
]
for i, cell in enumerate(cells):
    cell['id'] = f'lesson02-cell-{i:02d}'
notebook={'cells':cells,'metadata':{'kernelspec':{'display_name':'Python 3','language':'python','name':'python3'},'language_info':{'name':'python','version':'3.10'}},'nbformat':4,'nbformat_minor':5}
(out/'第二课练习.ipynb').write_text(json.dumps(notebook,ensure_ascii=False,indent=2),encoding='utf-8')
with zipfile.ZipFile(out/'lesson-02-practice.zip','w',zipfile.ZIP_DEFLATED) as z:
    for p in sorted(out.rglob('*')):
        if p.is_file() and p.suffix != '.zip' and '__pycache__' not in p.parts:
            z.write(p,'lesson-02-practice/'+str(p.relative_to(out)))
print('Built lesson-02-practice.zip, notebook, scripts and 2 HTML samples')
