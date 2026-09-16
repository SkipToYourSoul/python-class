第二课：勇士情报站

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
