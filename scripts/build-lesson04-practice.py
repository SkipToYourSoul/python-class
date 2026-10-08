"""Build lesson 04 practice files from the same data/code used by the slides."""

import csv
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/courses/ai-with-python/lesson-04/practice"
SOURCE = ROOT / "app/courses/ai-with-python/lesson-04/practice-content.ts"
FIELDS = ["记录编号", "地点", "出现的恶魔", "威胁值", "持续分钟数"]


def load_source():
    result = subprocess.run(
        ["node", "--experimental-strip-types", "--input-type=module", "--eval",
         f"import * as source from {json.dumps(SOURCE.as_uri())}; "
         "process.stdout.write(JSON.stringify(source));"],
        capture_output=True, text=True, check=True,
    )
    return json.loads(result.stdout)


def markdown(text):
    return {"cell_type": "markdown", "metadata": {}, "source": text.splitlines(True)}


def empty_cell():
    return {"cell_type": "code", "metadata": {"tags": ["student-input"]},
            "source": [], "outputs": [], "execution_count": None}


def reference_outputs(codes):
    """Execute the exact classroom blocks in a fresh process, in teaching order."""
    with tempfile.TemporaryDirectory() as temporary:
        work = Path(temporary)
        shutil.copyfile(OUT / "attack-records.csv", work / "attack-records.csv")
        runner = (
            "from contextlib import redirect_stdout\nimport io, json\n"
            f"codes = {codes!r}\nnamespace = {{}}\noutputs = {{}}\n"
            "for key, code in codes.items():\n"
            "    buffer = io.StringIO()\n"
            "    with redirect_stdout(buffer):\n"
            "        exec(code, namespace)\n"
            "    outputs[key] = buffer.getvalue()\n"
            "print(json.dumps(outputs, ensure_ascii=False))\n"
        )
        import sys
        result = subprocess.run([sys.executable, "-c", runner], cwd=work,
                                capture_output=True, text=True, check=True)
        return json.loads(result.stdout)


def build():
    source = load_source()
    # Retire the old export artifact when rebuilding an existing practice folder.
    (OUT / "参考调查结果.csv").unlink(missing_ok=True)
    records = json.loads((OUT / "attack-records.json").read_text())
    with (OUT / "attack-records.csv").open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(FIELDS)
        for record in records:
            writer.writerow([record["id"], record["place"], "/".join(record["demons"]),
                             record["threat"], record["minutes"]])
    outputs = reference_outputs(source["codeBlocks"])
    (OUT / "reference-outputs.json").write_text(
        json.dumps(outputs, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    practice_steps = [
        {**step, "code": source["codeBlocks"][step["key"]]}
        for step in source["practiceSteps"][:4]
    ] + source["practiceThreeCells"]
    practice_outputs = reference_outputs({step["key"]: step["code"] for step in practice_steps})
    (OUT / "practice-three-outputs.json").write_text(
        json.dumps({step["key"]: practice_outputs[step["key"]]
                    for step in source["practiceThreeCells"]}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8")
    (OUT / "完整参考.py").write_text(source["COMPLETE_CODE"] + "\n", encoding="utf-8")
    (OUT / "requirements.txt").write_text("pandas>=2.2,<4\njupyterlab>=4,<5\n", encoding="utf-8")
    intro = """# 第四课：数据小侦探
## 追查恶魔首领
勇士已经守住城堡。现在从 36 份历次进攻记录中寻找值得优先调查的对象。

## 开始前
- 使用 Python 3.10 或更高版本，在终端运行 `python -m pip install -r requirements.txt`。
- 解压整个练习包，在这个文件夹启动 `python -m jupyterlab`，打开本笔记本。
- 确认 `attack-records.csv` 与本笔记本在同一个文件夹；按从上到下的顺序跟写、运行。
- 参考代码在文字区；下面的空白代码单元格由你亲手输入。选中代码单元，按 Shift + Enter 运行。
- 课堂练习 03 接着练习 02 的 `focus` 继续，按 ①②③ 顺序运行三个单元格。
- 练习 03 在副本 `work` 上拆分名字，原来的 `focus` 仍保留字符串；重做时直接从练习 03 的第一格开始即可。
- 如果修改了练习 02 的代码，请先按顺序重新运行练习 02，再运行练习 03。

如果读取时提示 `ModuleNotFoundError: No module named 'pandas'`，在启动 JupyterLab 的同一个 Python 环境的终端复制运行：

```sh
python -m pip install pandas
```

安装完成后回到笔记本，从第一格按顺序重新运行。

## 战报规则
一行表示一次进攻。`出现的恶魔`中的多个名字用 `/` 分开。记录编号用于辨认事件，不能求平均。
威胁值是哨塔魔力仪记录的每次进攻最高读数，统一为 0—100；数值越大，整场进攻的魔力越强。
它不是某个恶魔的个人伤害。数据中没有“首领”标签。

## CLASS PRACTICE · 课堂练习 01：先写调查办法
先查看 CSV 的前六条。写下初步猜测、依据和你还需要知道什么；保留原来的猜测，最后再核对。
完成标准：说清一个准备通过统计回答的问题，不能只选名字。
"""
    cells = [markdown(intro), markdown("我的初步猜测：\n\n我的依据：\n\n我还想知道：")]
    for step in practice_steps:
        key = step["key"]
        if key == "load":
            cells.append(markdown("## CLASS PRACTICE · 课堂练习 02：读懂调查表\n完成标准：读取 36 行记录，选出三列，并核对第一条。"))
        if key == "expand":
            cells.append(markdown(
                "## CLASS PRACTICE · 课堂练习 03：完成调查\n"
                "前提：已运行练习 02，得到三列的 `focus`。本练习只有三个代码单元格，按顺序运行。\n"
                "完成标准：整理出 76 条关联，计算九个恶魔的均值与次数，筛选得到八个优先调查对象；"
                "比较两次输出，解释岩背魔为什么被筛掉。平均威胁值描述关联进攻，不是个人伤害。"
            ))
        cells.append(markdown(f"### {step['title']}\n{step['instruction']}\n\n跟写参考：\n```python\n{step['code']}\n```"))
        cell = empty_cell()
        cell["metadata"]["tags"].append(f"practice-step-{key}")
        cells.append(cell)
        if practice_outputs[key]:
            note = "（类型名称、内存用量或表格对齐可能因 Pandas 版本略有不同。）" if key == "info" else "（核对数值即可，表格对齐可能因显示环境不同。）"
            cells.append(markdown(f"运行后核对{note}\n```text\n{practice_outputs[key].rstrip()}\n```"))
    cells.append(markdown("""## 写下你的调查结论
- 调整前后，优先调查对象有什么变化？
- 这个平均值描述了什么？为什么不能把它解释成个人伤害？
- 一次高威胁记录为什么还不够？为什么至少 3 次也不能直接证明谁是首领？
- 结课游戏中还要取得什么独立证据，才能确认指挥关系？
"""))
    homework01 = """## 课堂练习 03 · 拓展 A：换条件，解释变化
把最低次数依次改成 1、3、10，在下面三个独立单元格中分别运行筛选、排序和打印代码。
让三组输出同时留在笔记本中，方便对照。
逐组比较名单，写下谁被保留、谁被过滤，并用平均值和次数解释变化。
被过滤不等于不重要；次数多也不自动等于首领。
完成标准：显示 1、3、10 三组结果，并逐组解释条件怎样影响调查方向。
"""
    homework02 = """## 课堂练习 03 · 拓展 B：换一个问题
从现有字段中提出一个可以通过计算回答的问题。下面任选一个，也可以自拟：
- 哪个地点的进攻次数最多？
- 哪个地点的平均持续时长最长？
- 各恶魔关联的进攻，最高威胁值分别是多少？

先写你的问题和预测，再选择字段、分组、计算，最后用结果解释结论。
按地点分析时，使用原始的一行一次进攻的 `df`；按恶魔分析时，使用展开后的 `expanded`。
完成标准：问题可以计算、所用数据与问题对应、代码能运行，并能用结果解释答案。最高威胁值仍是关联进攻的读数，不是恶魔的个人伤害。

下面只是“地点平均持续时长”的可选示例，不必选择同一个问题：

```python
place_means = df.groupby("地点")["持续分钟数"].mean()
print(place_means.sort_values(ascending=False).round(1))
```
"""
    cells.append(markdown(homework01))
    for threshold in [1, 3, 10]:
        code = source["codeBlocks"]["filter"].replace(">= 3", f">= {threshold}")
        cells.append(markdown(
            f"### 至少出现 {threshold} 次\n跟写参考：\n```python\n{code}\n```"
        ))
        cell = empty_cell()
        cell["metadata"]["tags"].append(f"compare-count-{threshold}")
        cells.append(cell)
    cells.append(markdown(homework02))
    cells.append(empty_cell())
    notebook = {"cells": cells, "metadata": {
        "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
        "language_info": {"name": "python", "version": "3.10"}}, "nbformat": 4, "nbformat_minor": 5}
    for index, cell in enumerate(cells):
        cell["id"] = f"lesson04-{index:03}"
    (OUT / "第四课练习.ipynb").write_text(json.dumps(notebook, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (OUT / "参考输出.txt").write_text("\n\n".join(
        f"【{step['title']}】\n{practice_outputs[step['key']].rstrip() or '无打印输出。'}"
        for step in practice_steps) + "\n", encoding="utf-8")
    (OUT / "README.md").write_text(intro + """
## 练习文件
- `第四课练习.ipynb`：参考代码、空白跟写单元和输出对照。
- `attack-records.csv`：36 场进攻记录。
- `完整参考.py`：练习 02 四格与练习 03 三格依次合并的完整代码，用于核对。
- `参考输出.txt`：运行输出与最终名单对照。
- `requirements.txt`：运行依赖。

本课共三个课堂练习；练习 03 完成后，可选做笔记本末尾的拓展任务。完整脚本用于核对，不替代跟写。
在练习文件夹运行 `python 完整参考.py` 可核对全流程，最后打印筛选排序后的调查名单。
参考输出使用一位小数显示，排名和筛选使用未四舍五入的原始计算结果。
同一次进攻里的名字不会重复，所以展开后某个名字的行数等于它出现的进攻次数。

## 重新运行与排错
练习 03 的第一格先执行 `work = focus.copy()`，之后只修改 `work`，因此可以反复按 ①②③ 重做，`focus` 中的名字仍是字符串。
如果你已经运行过课件演示中直接修改 `focus` 的拆分代码，请先重跑练习 02 的“选择调查字段”一格，从原始 `df` 恢复 `focus`，然后运行练习 03。
如果提示 `NameError: name 'focus' is not defined`，请先完成练习 02。不要只重跑第三格来重做整个流程。

筛选至少 3 次是本轮调查选择，可以改变；名单提供调查方向，身份仍需要独立证据。
""" + "\n" + homework01 + "\n" + homework02, encoding="utf-8")
    package_names = ["README.md", "requirements.txt", "attack-records.csv", "完整参考.py",
                     "参考输出.txt", "第四课练习.ipynb"]
    with zipfile.ZipFile(OUT / "lesson-04-practice.zip", "w", zipfile.ZIP_DEFLATED) as archive:
        for name in package_names:
            archive.write(OUT / name, name)
    print(f"Built lesson 04: {len(records)} records, {len(practice_steps)} code steps.")


if __name__ == "__main__":
    build()
