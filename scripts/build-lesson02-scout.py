"""Build chapter 01's standalone scout pages and request-only practice pack."""
from pathlib import Path
import json
import zipfile
import subprocess

root = Path(__file__).resolve().parents[1]
pack = root / 'public/courses/ai-with-python/lesson-02/practice'
records = [
    ('炎角兽', '北方峡谷', '火焰', '怕强光'),
    ('藤甲魔', '迷雾森林', '藤蔓', '怕火'),
    ('冰翼魔', '冰封山口', '寒冰', '怕热'),
]
updated = [('炎角兽', '东部石桥', '火焰', '怕强光'), *records[1:], ('岩背魔', '南方山道', '岩石', '转身缓慢')]

def document(rows):
    content = '\n'.join(f'''      <article class="record">
        <h2 class="name">{name}</h2>
        <p>出没地点：<span class="location">{location}</span></p>
        <p>属性：<span class="attribute">{attribute}</span></p>
        <p>已知弱点：<span class="weakness">{weakness}</span></p>
      </article>''' for name, location, attribute, weakness in rows)
    return f'''<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>前线侦察记录站</title>
    <style>
      * {{ box-sizing: border-box; }}
      body {{ margin: 0; background: #f5f0e6; color: #071a3d; font: 500 24px/1.5 system-ui, sans-serif; }}
      header, main {{ max-width: 1080px; margin: auto; padding: 24px; }}
      header {{ padding-top: 40px; }}
      header p {{ margin: 0 0 12px; color: #1457d9; font-size: 18px; font-weight: 700; }}
      h1 {{ margin: 0 0 12px; font-size: clamp(32px, 4vw, 48px); line-height: 1.2; }}
      main {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; padding-top: 0; }}
      .record {{ padding: 24px; background: #fffaf0; border: 2px solid #071a3d; border-top: 8px solid #1457d9; }}
      h2 {{ font-size: 30px; margin: 0 0 20px; }}
      .record p {{ margin: 12px 0; font-size: 22px; }}
      .record span {{ display: block; color: #1457d9; font-size: 26px; font-weight: 750; }}
      @media (max-width: 800px) {{ main {{ grid-template-columns: 1fr; }} .record span {{ display: inline; }} }}
    </style>
  </head>
  <body>
    <header>
      <p>勇士与恶魔 / 前线档案</p>
      <h1>前线侦察记录站</h1>
      <p>哨兵发布观察记录，供勇士准备防御。</p>
    </header>
    <main>
{content}
    </main>
  </body>
</html>
'''

for filename, rows in [('scout.html', records), ('scout-updated.html', updated)]:
    html = document(rows)
    (root/'public'/filename).write_text(html, encoding='utf-8')
    (pack/'samples'/filename).write_text(html, encoding='utf-8')

script = '''"""Fetch one scout page. Every run performs one actual HTTP GET."""
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
'''
(pack/'01_scout_request.py').write_text(script, encoding='utf-8')
readme = '''课堂练习 01：取回前线敌情

条件：Python 3.10+，安装 requests。
终端安装：python -m pip install requests
Jupyter 安装：%pip install requests
解压后打开“前线侦察练习.ipynb”，先完成“第一次请求”；第二版留到课件下一页。
common.py、samples 和脚本须保留在同一文件夹。

运行第一版：python 01_scout_request.py
预期：状态码 200，正文包含炎角兽、北方峡谷、火焰、怕强光。
第二版：python 01_scout_request.py --updated
预期：状态码 200，炎角兽位置改为东部石桥，新增岩背魔。
两个命令均临时启动本机服务、发出一次实际 GET，然后关闭服务。
网页为预先编写的虚构教学记录，不是现场侦察或自动监测。

部署后可使用：python 01_scout_request.py --url "老师提供的完整网址"
把引号中的说明替换为实际地址；在线第二版也用它自己的网址。
不会自动刷新已有 res；要查看新版本，需要重新请求。
遇到错误先检查地址和连接，不会把本地样本伪装成现场响应。

如需本机浏览，运行：python -m http.server 8000 --directory samples
打开 http://localhost:8000/scout.html（仅本机）。
两份网页分别是独立 HTML，所有内容与样式都在各自文件中。
获取后先核对恶魔名与地点；提取字段和制定防御方案将在后续展开。
'''
(pack/'SCOUT_README.txt').write_text(readme, encoding='utf-8')
def md(text): return {'cell_type':'markdown','metadata':{},'source':text.splitlines(True)}
def code(text): return {'cell_type':'code','execution_count':None,'outputs':[],'metadata':{},'source':text.splitlines(True)}
cells=[md('# 课堂练习 01：前线侦察\n按顺序执行。哨兵观察、爬虫获取、勇士判断；这是虚构教学记录。'),code('%pip install requests'),md('## 第一次请求\nurl 留空则请求本机第一版；有部署网址后填入完整网址。'),code('import requests\nfrom common import local_sample_server\n\nurl = ""\nif url.strip():\n    res = requests.get(url.strip(), timeout=10)\n    print("来源：老师提供的网址")\nelse:\n    with local_sample_server("scout.html") as local_url:\n        res = requests.get(local_url, timeout=10)\n    print("来源：本机第一版侦察记录")\nprint("HTTP 状态码：", res.status_code)\nres.raise_for_status()\nres.encoding = "utf-8"\nprint(res.text)'),md('预期：状态码 200；HTML 包含炎角兽、北方峡谷、火焰、怕强光。\n自己核对网页，找到对应证据。'),md('## 下一页再运行：请求第二版\n这是预先准备的变化样本，不会后台自动更新。updated_url 留空则实际请求本机第二版。'),code('updated_url = ""\nif updated_url.strip():\n    res = requests.get(updated_url.strip(), timeout=10)\n    print("来源：老师提供的第二版网址")\nelse:\n    with local_sample_server("scout-updated.html") as local_url:\n        res = requests.get(local_url, timeout=10)\n    print("来源：本机第二版侦察记录")\nprint("HTTP 状态码：", res.status_code)\nres.raise_for_status()\nres.encoding = "utf-8"\nprint(res.text)'),md('预期：炎角兽出没地点改为东部石桥，新增岩背魔。\n解释：原来的 res 为什么不会自己更新？这两次请求有没有自动制定防御方案？')]
for i, cell in enumerate(cells): cell['id']=f'scout-01-{i:02d}'
nb={'cells':cells,'metadata':{'kernelspec':{'display_name':'Python 3','language':'python','name':'python3'}},'nbformat':4,'nbformat_minor':5}
(pack/'前线侦察练习.ipynb').write_text(json.dumps(nb,ensure_ascii=False,indent=2),encoding='utf-8')
# Keep the public HTML, downloadable samples and archive byte-for-byte identical.
subprocess.run([str(root/'node_modules/.bin/oxfmt'), str(root/'public/scout.html'), str(root/'public/scout-updated.html')], check=True)
for name in ['scout.html', 'scout-updated.html']:
    (pack/'samples'/name).write_bytes((root/'public'/name).read_bytes())
with zipfile.ZipFile(pack/'lesson-02-scout.zip','w',zipfile.ZIP_DEFLATED) as archive:
    for name in ['01_scout_request.py','common.py','SCOUT_README.txt','前线侦察练习.ipynb','samples/scout.html','samples/scout-updated.html']:
        archive.write(pack/name,'lesson-02-scout/'+name)
print('Built two scout HTML pages and chapter 01 request pack.')
