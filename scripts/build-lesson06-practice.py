"""Build lesson 06 materials from the same data and code used by the slides."""

import csv
from contextlib import redirect_stdout
from html import escape
import io
import json
from pathlib import Path
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parents[1]
LESSON = ROOT / "app/courses/ai-with-python/lesson-06"
OUT = ROOT / "public/courses/ai-with-python/lesson-06/practice"
TOWER_FIELDS = ["tower", "hour", "energy", "guard", "kind", "attribute", "weakness", "defense"]
BOSS_FIELDS = ["part", "energy", "defense", "weakness"]
LABELS = {"tower": "魔塔", "hour": "时刻", "energy": "外罩强度", "guard": "守卫编号",
          "kind": "守卫族群", "attribute": "属性", "weakness": "弱点", "defense": "防御力",
          "part": "部位"}


def load_module(name):
    result = subprocess.run(
        ["node", "--experimental-strip-types", "--input-type=module", "--eval",
         f"import * as source from {json.dumps((LESSON / name).as_uri())}; "
         "process.stdout.write(JSON.stringify(source));"],
        capture_output=True, text=True, check=True,
    )
    return json.loads(result.stdout)


def markdown(text):
    return {"cell_type": "markdown", "metadata": {}, "source": text.splitlines(True)}


def code(text="", **metadata):
    return {"cell_type": "code", "metadata": metadata, "execution_count": None,
            "outputs": [], "source": text.splitlines(True)}


def exercise_step(title, instruction, reference, expected):
    return [markdown(f"### {title}\n\n{instruction}\n\n完整参考：\n```python\n{reference}\n```"),
            code(tags=["student-input"]), markdown(f"运行后核对：{expected}")]


def fill_exercise_step(title, instruction, exercise, expected):
    return [markdown(f"### {title}\n\n{instruction}"),
            code(exercise, tags=["student-input", "classroom-fill-in"]),
            markdown(f"运行后核对：{expected}")]


def homework(number, title, instruction, reference):
    return [markdown(f"## CHECKPOINT {number:02} · 课后练习 {number:02} · {title}\n\n"
                     f"{instruction} 把下面的代码复制到空白格，只补 `____`，再运行。\n\n"
                     f"```python\n{reference}\n```"),
            code(tags=["homework-fill-in"])]


COMMON = '''"""Serve the lesson's intelligence pages through persistent local HTTP."""
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
'''


def csv_text(rows, fields):
    buffer = io.StringIO(newline="")
    writer = csv.DictWriter(buffer, fieldnames=fields, lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)
    return buffer.getvalue()


def station_html(rows, fields, title, subtitle):
    headings = "".join(f"<th scope='col'>{LABELS[field]}<br>{field}</th>" for field in fields)
    records = "\n".join("<tr class='record'>" + "".join(
        f"<td class='{field}'>{escape(str(row[field]))}</td>" for field in fields) + "</tr>" for row in rows)
    raw_csv = escape(csv_text(rows, fields))
    return f'''<!doctype html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title><style>
* {{ box-sizing:border-box; }}
body {{ margin:0; color:#071a3d; background:#f5f0e6; font:20px/1.5 system-ui,sans-serif; }}
header,main,footer {{ max-width:1440px; margin:auto; padding:24px 32px; }}
header {{ border-bottom:3px solid #071a3d; }}
h1 {{ font-size:clamp(34px,4vw,56px); margin:8px 0; }}
h2 {{ margin:12px 0; font-size:28px; }}
p {{ margin:12px 0; }}
.stamp {{ display:inline-block; background:#ffc91c; border:2px solid #071a3d; padding:4px 12px; font-size:18px; font-weight:700; }}
.table-wrap {{ overflow-x:auto; border:2px solid #071a3d; background:#fffdf7; }}
table {{ width:100%; border-collapse:collapse; white-space:nowrap; }}
th,td {{ padding:12px; border:1px solid #071a3d; text-align:center; }}
th {{ background:#071a3d; color:#fffdf7; font-size:18px; }}
tr:nth-child(even) {{ background:#e8eefb; }}
pre {{ overflow:auto; border:2px solid #071a3d; padding:20px; background:#fffdf7; font-size:18px; }}
a {{ color:#1457d9; }}
@media(max-width:700px) {{ header,main,footer {{ padding:20px; }} }}
</style></head><body>
<header><span class="stamp">魔堡情报档案</span><h1>{title}</h1><p>{subtitle}</p>
<p>外罩强度低于 30 才能破罩；防御力越低越容易突破。按弱点选择装备。</p></header>
<main><h2>观测记录 · {len(rows)} 条</h2><div class="table-wrap"><table>
<thead><tr>{headings}</tr></thead><tbody>{records}</tbody></table></div>
<h2>CSV 情报原文</h2><p>程序可以从下方整份 CSV 中取回相同的记录。</p>
<pre id="intel-data">{raw_csv}</pre></main>
<footer><a href="/battle-towers.html">战前情报</a> · <a href="/battle-towers-current.html">阵前核对</a> · <a href="/boss-intel.html">魔王情报</a></footer>
</body></html>
'''


def build_zip():
    with zipfile.ZipFile(OUT / "lesson-06-practice.zip", "w", zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(OUT.rglob("*")):
            if path.is_file() and path.suffix != ".zip" and "__pycache__" not in path.parts:
                archive.write(path, path.relative_to(OUT))


def analysis_evidence():
    """Capture the teaching commands against the generated classroom CSV."""
    import pandas as pd

    towers = pd.read_csv(OUT / "expected-output/towers.csv")
    captured = {"pandasVersion": pd.__version__}
    for key, statement in [("head", "print(towers.head())"),
                           ("info", "towers.info()"),
                           ("dtypes", "print(towers.dtypes)")]:
        output = io.StringIO()
        with redirect_stdout(output):
            exec(statement, {"towers": towers})
        captured[key] = output.getvalue().rstrip()
    return captured


def build():
    OUT.mkdir(parents=True, exist_ok=True)
    data = load_module("study-data.ts")
    codes = load_module("practice-content.ts")

    def write(name, text):
        path = OUT / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")

    pages = [
        ("battle-towers.html", "history", TOWER_FIELDS, "魔堡侦察站 · 战前情报",
         "三座魔塔 · 6—17 时 · 36 名值班守卫与外罩观测"),
        ("battle-towers-current.html", "battleReadings", TOWER_FIELDS, "三队抵达 · 阵前核对",
         "各队按计划抵达，核对守卫与外罩的最新读数"),
        ("boss-intel.html", "bossRecords", BOSS_FIELDS, "魔王现身 · 九处部位情报",
         "三座魔塔全部击破，找出魔王外罩较弱、防御较低的部位"),
    ]
    for filename, key, fields, title, subtitle in pages:
        html = station_html(data[key], fields, title, subtitle)
        write("samples/" + filename, html)
        (ROOT / "public" / filename).write_text(html, encoding="utf-8")
    for filename, key, fields in [
        ("towers.csv", "history", TOWER_FIELDS),
        ("current-towers.csv", "battleReadings", TOWER_FIELDS),
        ("boss.csv", "bossRecords", BOSS_FIELDS),
    ]:
        write("expected-output/" + filename, csv_text(data[key], fields))
    evidence = json.dumps(analysis_evidence(), ensure_ascii=False, indent=2) + "\n"
    (LESSON / "analysis-evidence.json").write_text(evidence, encoding="utf-8")
    write("analysis-evidence.json", evidence)
    write("data-summary.json", json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    write("common.py", COMMON)
    write("requirements.txt", "requests>=2.32\nbeautifulsoup4>=4.12\npandas>=2.2\nseaborn>=0.13\nmatplotlib>=3.8\njupyterlab>=4\n")
    write("完整参考.py", codes["COMPLETE_CODE"] + "\n")
    for filename, key in [("课堂练习一完整参考.py", "PRACTICE_01_CODE"),
                          ("课堂练习二完整参考.py", "PRACTICE_02_CODE"),
                          ("课堂练习三完整参考.py", "PRACTICE_03_CODE"),
                          ("结课挑战完整参考.py", "CURRENT_CODE")]:
        write(filename, codes[key] + "\n")

    cells = [markdown("""# 第六课：决战魔王——三队出击

三座魔塔挡住了通往魔王的道路。你是勇士的作战指挥官：先备齐情报，再部署三队，击破全部魔塔，最后直面魔王。

本课依次完成 **三个课堂练习、三个简单课后填空、一个结课综合演示**。三个课堂练习分别补全 8、7、7 个关键空，运行后核对数据与图表。

## 环境准备 · 直接运行，不跟写

把整个压缩包解压到同一文件夹，在该文件夹启动 `jupyter lab`，打开本文件。沿用前五课的 Python 环境，不增加新库、账号或密钥。

下一格设置中文字体，并启动备用本机情报站和魔王情报站。服务会保持到内核关闭；重复运行复用同一服务。"""),
             code(codes["PREPARATION_CODE"], tags=["environment-setup"]),
             markdown(f"课堂练习一使用在线三塔情报站 `{codes['HISTORY_URL']}`。如果课堂没有网络，将练习代码中的 `url = ...` 改为环境格打印的备用本机地址。"),
             markdown(f"""## 课堂练习 01 · 战前准备：备齐情报

CHECKLIST 01 · 猫头鹰带回一整天的侦察网页。先打开 `{codes['HISTORY_URL']}`，找到北塔 6 时的守卫 G001。

每行记录一个时刻的值班守卫和魔塔：tower 魔塔、hour 时刻、energy 外罩强度、guard 守卫编号、kind 族群、attribute 属性、weakness 弱点、defense 防御力。

网页下方已经排好 CSV 原文。先获取网页，再定位 id 为 intel-data 的区域，取回整份文字，写入自己的 CSV。`get_text()` 保留 CSV 中的换行。""")]
    cells += fill_exercise_step("获取 → 提取 → 保存", "补全下面 8 个 `____`，再运行整格代码。先导入请求与解析工具，获取网页；定位 intel-data，取出 CSV 文字；最后打开文件并写入。保留引号和括号，只替换空缺处。", codes["PRACTICE_01_FILL_CODE"],
                                "生成 towers.csv：8 列、36 条记录。北塔 6 时：G001、炎角兽族、火焰、弱点强光、外罩 72、防御 78。三塔各有 12 个相同时刻。")
    cells += homework(1, "取回并保存", "只考三个关键位置：请求网页的库、文件格式、写入方法。沿用课堂练习 01 的 url 与 csv_text。", codes["HOMEWORK_01_CODE"])
    cells += [markdown("""## 课堂练习 02 · 望闻问切：部署三队

CHECKLIST 02 · 勇士只有三支小队，要让每队找准一座塔、一个时刻和一件装备。

- **望**：观察网页与表格，认出 36 行、8 列，区分分类列与数值列。
- **闻**：用 read_csv 读入，head 检查前几行，info 核对行列、非空数量与类型，dtypes 查看每列类型，再选出需要的列。
- **问**：一路追问：每队用什么装备？何时能破罩？外罩最低时，守卫也最弱吗？
- **切**：分组统计外罩均值、防御均值和守卫数；筛 energy < 30，再按 tower 和 defense 排序、核对，每塔选防御最低的一行。

外罩低于 30 才能破罩；守卫防御越低越容易突破。装备与 weakness 对应。平均值帮助认识整体，部署需要具体时刻和守卫。""")]
    cells += fill_exercise_step("检查 → 统计 → 筛选", "补全下面 7 个 `____`，再运行整格代码。先读取 CSV、查看整体信息，再分组统计、筛选与排序。观察最后六行结果，为每座塔选一行，并按弱点部署装备。保留引号和括号，只替换空缺处。", codes["PRACTICE_02_FILL_CODE"],
                           "每塔 12 条；筛选得到 6 行。北塔 11 时/防御30/强光，东塔 14 时/防御34/火焰，西塔 17 时/防御25/热量。部署曙光队、烈焰队、暖阳队。")
    cells += [markdown("### 检查输出对照\n\n"
                       "`info()` 应显示 36 行、8 列，每列都是 36 个非空值。"
                       "文本列在不同 Pandas 版本中可能显示 `str` 或 `object`；"
                       "`dtypes` 输出结尾的 `dtype: object` 是该类型列表本身的类型。\n\n"
                       + "\n\n".join(f"**{label}**\n```text\n{analysis_evidence()[key]}\n```"
                                       for key, label in [("head", "前五行 · head()"),
                                                          ("info", "整体信息 · info()"),
                                                          ("dtypes", "每列类型 · dtypes")]))]
    cells += homework(2, "分组与筛选", "补出按塔分组的方法、外罩字段和破罩阈值。", codes["HOMEWORK_02_CODE"])
    cells += [markdown("""## 课堂练习 03 · 看图出击：三座魔塔之战

CHECKLIST 03 · 三队出发前，小派要你把作战表变成能一眼看懂的图。

北塔 10 时外罩18、防御42；11时外罩25、防御30。两次都能破罩，哪一次更容易突破守卫？用两张图核对，不能只挑最低的外罩。

折线图回答“什么时候外罩较弱”：横轴 hour，纵轴 energy，用 hue 按塔着色。虚线标出 30，只有线下的观测点符合破罩条件。

散点图回答“外罩和防御是否同时较弱”：横轴 defense，纵轴 energy；同一座塔中，虚线下更靠左的点更适合突破。再回数据表确认时刻与装备。""")]
    cells += fill_exercise_step("画两张图，给三队核对计划", "运行环境格后补全下面 7 个 `____`，同一代码格完成两张图。折线图用 hour 作横轴，用 energy 作纵轴，再用 hue 按 tower 着色。散点图的横轴改为 defense。运行后回表说出具体数值，解释北塔选择 11 时的依据。", codes["PRACTICE_03_FILL_CODE"],
                           "生成 tower-history.png 与 tower-weakness.png。三队计划仍为北塔11时、东塔14时、西塔17时，分别用强光、火焰、热量。")
    cells += [markdown("""### 阵前核对，再攻塔

猫头鹰送来三队到达时的最新读数：北塔 11 时外罩21/防御32，东塔 14 时外罩24/防御35，西塔 17 时外罩22/防御28。三个外罩仍低于30，按各自的弱点装备发动攻击。

把三个目标都击破后，魔王的大门才会打开。历史观测用于制定计划，行动前仍要核对当前读数。""")]
    cells += homework(3, "用颜色分清三座塔", "补出折线图的时间列、外罩列和分类着色参数。", codes["HOMEWORK_03_CODE"])
    cells += [markdown("""## 结课挑战 · 魔王决战综合演示

课堂观看视频与代码同步演示：获取网页 → 保存 CSV → 读取分析 → 画散点图 → 根据证据选择突破口。

魔王情报独立保存为 boss.csv，不能以三塔记录代替。先筛选外罩低于30的部位，再从这些部位中比较防御力，最后按 weakness 选择装备。

以下为教师演示的完整代码。先运行环境格，current_url 会指向本机魔王情报网页。"""),
              code(codes["CURRENT_CODE"], tags=["teacher-demo"]),
              markdown("演示输出：boss.csv 有9处部位；候选按防御升序为胸甲、腰甲、左臂。胸甲外罩18、防御24、弱点火焰；生成 boss-weakness.png。")]
    cells += [markdown("""## 指挥官交付清单

- 我的 towers.csv 有36条、8个字段，后续读取的是自己保存的文件。
- 我能用望闻问切解释三队的目标、时刻与装备。
- 我的两张魔塔图能分别看出时间变化、外罩与防御的关系。
- 魔王决战演示把获取、存储、分析与可视化串成一条证据链。
- 三道课后填空只检查本课的关键知识点。

## 教师参考

`完整参考.py` 可直接验证全部流程；各练习参考按顺序运行。`课堂填空答案.txt` 与 `课后填空答案.txt` 用于教师核对。`expected-output/` 是故障恢复资料，学生工作目录不预放成品 CSV。

学生在 Notebook 中真正运行 Python，课件战场由教师执行全班的决策。""")]
    for index, cell in enumerate(cells):
        cell["id"] = f"lesson06-{index:02}"
    notebook = {"cells": cells, "metadata": {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
                 "language_info": {"name": "python", "version": "3.10"}}, "nbformat": 4, "nbformat_minor": 5}
    write("第六课练习.ipynb", json.dumps(notebook, ensure_ascii=False, indent=2) + "\n")
    answers = "\n\n".join(f"课后练习 {number:02}：" + "、".join(codes[f"HOMEWORK_{number:02}_ANSWERS"])
                              for number in range(1, 4))
    write("课堂填空答案.txt", "\n\n".join(
        f"课堂练习 {number:02}：" + "、".join(codes[f"PRACTICE_{number:02}_FILL_ANSWERS"])
        for number in range(1, 4)) + "\n")
    write("课后填空答案.txt", answers + "\n")
    write("README.md", f"""# 第六课：决战魔王——三队出击

战前准备 → 三队部署 → 击破全部魔塔 → 魔王决战。三个课堂练习、三个简单课后填空，最后观看魔王决战综合演示。

解压整个包，在该文件夹启动 `jupyter lab`，打开 `第六课练习.ipynb`。先运行环境格，再按顺序补全或亲手输入、运行、核对。三个课堂练习各在同一代码格补全8个关键空；结课部分提供教师演示代码，不要求学生再次作答。

## 课前准备

- Python 3.10 或以上；沿用 requests、BeautifulSoup、Pandas、Seaborn、Matplotlib 和 JupyterLab。无需新增库、注册账号、申请密钥。
- 教师核对环境：`python -m pip install -r requirements.txt`。课前先画一张图，确认中文字体正常。
- 课堂练习一在代码中明确设置在线情报站地址：{codes['HISTORY_URL']}。
- `common.py` 仅用标准库启动备用本机 HTTP 站，运行环境格后持续到内核退出，重复运行复用原服务。离线时将练习一的 `url = ...` 改为环境格打印的本机地址；魔王挑战沿用环境格中的本机站。

## 数据与代码顺序

1. 课堂练习01 · 战前准备：补全8个关键空，涵盖导入工具、获取网页、解析定位、提取文字和写入文件。获取网页中 id=intel-data 的 CSV 原文并保存 towers.csv，36行×8字段；三塔×12时刻。每行是一名值班守卫与魔塔的同步观测。
2. 课后练习01 · 三空：请求库、CSV格式、write。
3. 课堂练习02 · 望闻问切：补全 read_csv、info、groupby、mean、count、energy、sort_values 七个关键空。用 info 核对 36 行、8 列与每列 36 个非空值。按塔与弱点分组统计外罩均值、防御均值和守卫数（由 guard 列计数），筛出 energy < 30 的观测后按塔、防御力排序，从 6 个候选时刻为每塔选一个。北塔11时/防御30/强光，东塔14时/防御34/火焰，西塔17时/防御25/热量。
4. 课后练习02 · 三空：groupby、energy、30。
5. 课堂练习03 · 三塔之战：补全 read_csv、lineplot、hour、energy、hue、scatterplot、defense 七个关键空。折线图看时刻，散点图同时看外罩和防御。在 energy < 30 的同塔候选中选防御较低的点，再核对时刻与装备。曙光队→北塔、烈焰队→东塔、暖阳队→西塔。阵前最新读数分别为 21/32、24/35、22/28，三队都可按装备出击，三塔全破才见魔王。
6. 课后练习03 · 三空：hour、energy、hue。
7. 综合演示 · 魔王：观看约60秒视频与核心代码同步演示，串联获取、另存boss.csv、筛选、排序与绘图。输出中胸甲（外罩18/防御24）是可破罩候选中防御最低的一处，弱点火焰。教师可暂停、重播并对照完整参考，无需学生提交部位、装备或读数。

`完整参考.py` 在本目录用 `python 完整参考.py` 执行全部教学代码；生成tower-history.png、tower-weakness.png、boss-weakness.png。每节参考按顺序使用，变量和前序文件沿用。`课堂填空答案.txt` 和 `课后填空答案.txt` 供教师核对。学生工作目录不预放CSV，`expected-output/`仅供核对与恢复。

## 教师课堂节奏（90分钟）

开场与前情8分钟；获取存储20分钟；望闻问切与三队部署22分钟；图表与三塔战斗23分钟；魔王综合演示与讲解12分钟；阶段回顾5分钟。三道课后填空可留到课后，每题只补三个关键空，不增加长代码任务。

先让学生猜，再揭晓数据；北塔10时外罩18却防御42，11时外罩25但防御30，保留双指标冲突，让学生解释为什么选11时。请三组分别报告目标、时刻、装备和依据。错误选择保留后再试，三塔逐个熄灭后再进入魔王战。用图表和决策推动剧情，避免只运行代码。

## 故障恢复与概念核对

- 找不到common：确认整个压缩包已解压，Notebook与common.py同目录。
- 在线三塔站连接失败：将练习一的 `url = ...` 改为环境格打印的备用本机地址，再运行练习一。
- 本机站连接失败：重跑环境格，使用新打印的临时端口；不把端口写死。关闭Notebook内核即可停站。
- 找不到CSV：先完成对应获取与保存；必要时使用expected-output恢复，并告诉学生用了备用数据。
- 能量与防御均为0—100。严格低于30才满足破罩条件，等于30不满足。进攻窗口中再比较守卫防御；不把平均最低等同于此刻可攻击。
- 折线只连接已观测点，不能保证未测量时刻或下一天会重复。三塔阵前读数与历史分开，魔王情报另存新文件。
- 网页表格、CSV原文、教师输出、Notebook与课件均来自study-data.ts；展示、复制与Python参考来自practice-content.ts。
""")
    for obsolete in ["reference-plots/tower-means.png", "reference-plots/tower-current.png"]:
        (OUT / obsolete).unlink(missing_ok=True)
    build_zip()
    print(f"Built lesson 06: {len(data['history'])} tower observations, 3 deployments, "
          f"{len(data['bossRecords'])} boss parts; 3 class exercises + 3 fill-ins + 1 final demonstration.")


if __name__ == "__main__":
    build()
