"""Generate the Notebook and model evidence after installing the project dependencies."""

from contextlib import redirect_stdout
from io import StringIO
import json
from pathlib import Path
import subprocess
import zipfile

import sklearn

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/courses/ai-with-python/lesson-07/practice"
GIFT_INDEX = 133
FEATURES = ["萼片长", "萼片宽", "花瓣长", "花瓣宽"]
LABELS = ["山鸢尾", "变色鸢尾", "维吉尼亚鸢尾"]

SPLIT = """from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

iris = load_iris()
X, y = iris.data, iris.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.30, random_state=42, stratify=y
)
print(len(X_train), len(X_test))"""

EXPLORE = """import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

flowers = pd.DataFrame(X_train, columns=iris.feature_names)
flowers["species"] = iris.target_names[y_train]
print(flowers.head().to_string(index=False))"""

SCATTER = """plt.figure(figsize=(7, 4.5))
ax = sns.scatterplot(
    data=flowers,
    x="petal length (cm)",
    y="petal width (cm)",
    hue="species",
    hue_order=iris.target_names,
    palette=["#1457d9", "#087d68", "#ab4673"]
)

gift_petal_length, gift_petal_width = gift[0][2:4]
ax.scatter(
    gift_petal_length, gift_petal_width,
    marker="D", color="#ffc91c", edgecolors="#071a3d",
    s=100, label="Gift", zorder=3
)
ax.legend()
plt.show()"""

PAIRPLOT = """sns.pairplot(flowers, hue="species", diag_kind="hist")
plt.show()"""

TREE = """from sklearn.metrics import accuracy_score, classification_report
from sklearn.tree import DecisionTreeClassifier, plot_tree

tree = DecisionTreeClassifier(max_depth=3, random_state=42)
tree.fit(X_train, y_train)
tree_predictions = tree.predict(X_test)

print(f"准确率：{accuracy_score(y_test, tree_predictions):.2%}")
print(classification_report(
    y_test, tree_predictions, target_names=iris.target_names
))"""

PLOT_TREE = """plt.figure(figsize=(15, 7))
plot_tree(
    tree, feature_names=iris.feature_names,
    class_names=list(iris.target_names), filled=True
)
plt.show()"""

SVM = """from sklearn.svm import SVC

svm = SVC(kernel="linear")
svm.fit(X_train, y_train)
svm_predictions = svm.predict(X_test)

print(f"准确率：{accuracy_score(y_test, svm_predictions):.2%}")
print(classification_report(
    y_test, svm_predictions, target_names=iris.target_names
))"""

STUDENT_SPLIT = """from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report

iris = load_iris()
X, y = iris.data, iris.target
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)"""

STUDENT_TRAIN = """svm_classifier = SVC(kernel="linear")
svm_classifier.fit(X_train, y_train)

y_pred = svm_classifier.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)"""

STUDENT_REPORT = """print(f"准确率：{accuracy:.2%}")
print(classification_report(
    y_test, y_pred, target_names=iris.target_names
))"""

STUDENT_MEASURE = """sepal_length = None
sepal_width = None
petal_length = None
petal_width = None"""

STUDENT_PREDICT = """my_flower_feature = [
    sepal_length, sepal_width,
    petal_length, petal_width,
]
if None in my_flower_feature:
    raise ValueError("请先填入四项测量值（厘米）。")

my_flower_res = svm_classifier.predict(
    [my_flower_feature]
)
name = iris.target_names[my_flower_res[0]]
print("我的鸢尾花属于：", name)"""

PCA = """from sklearn.decomposition import PCA
from sklearn.inspection import DecisionBoundaryDisplay
from matplotlib.colors import ListedColormap

pca = PCA(n_components=2)
plane_train = pca.fit_transform(X_train)
plane_test = pca.transform(X_test)
plane_model = SVC(kernel="linear").fit(plane_train, y_train)
colors = ["tab:red", "tab:green", "tab:blue"]
class_colors = ListedColormap(colors)
display = DecisionBoundaryDisplay.from_estimator(
    plane_model, plane_train, response_method="predict", alpha=0.2,
    multiclass_colors=colors
)
display.ax_.scatter(*plane_train.T, c=y_train, cmap=class_colors, label="training")
display.ax_.scatter(
    *plane_test.T, c=y_test, cmap=class_colors, marker="x", label="test"
)
display.ax_.set(xlabel="PC1", ylabel="PC2", title="PCA projection (2D illustration)")
display.ax_.legend()
plt.show()"""


def evidence():
    state = {}
    outputs = {}
    for section, source in [("split", SPLIT), ("tree", TREE), ("svm", SVM)]:
        with redirect_stdout(StringIO()) as output:
            exec(source, state)
        outputs[section] = output.getvalue().strip()

    iris = state["iris"]
    gift = iris.data[GIFT_INDEX]
    train_indices, test_indices = state["train_test_split"](
        list(range(len(iris.target))), test_size=0.30, random_state=42, stratify=iris.target
    )
    assert GIFT_INDEX in test_indices
    assert (state["X_train"] == iris.data[train_indices]).all()
    assert (state["X_test"] == iris.data[test_indices]).all()

    tree = state["tree"]
    nodes = []
    for node_id in range(tree.tree_.node_count):
        left = int(tree.tree_.children_left[node_id])
        feature = int(tree.tree_.feature[node_id])
        nodes.append({
            "feature": feature if left != -1 else None,
            "threshold": round(float(tree.tree_.threshold[node_id]), 2) if left != -1 else None,
            "left": left if left != -1 else None,
            "right": int(tree.tree_.children_right[node_id]) if left != -1 else None,
            "prediction": int(tree.classes_[tree.tree_.value[node_id, 0].argmax()]),
            "samples": int(tree.tree_.n_node_samples[node_id]),
            "gini": round(float(tree.tree_.impurity[node_id]), 3),
        })
    path = tree.decision_path([gift]).indices.tolist()
    steps = []
    for node_id, next_node in zip(path, path[1:]):
        node = nodes[node_id]
        feature = node["feature"]
        steps.append({
            "node": node_id,
            "feature": feature,
            "threshold": node["threshold"],
            "value": float(gift[feature]),
            "wentLeft": node["left"] == next_node,
        })

    results = {}
    for key in ["tree", "svm"]:
        results[key] = {
            "prediction": int(state[key].predict([gift])[0]),
            "correct": int(sum(state[f"{key}_predictions"] == state["y_test"])),
            "total": len(state["y_test"]),
            "report": outputs[key].split("\n", 1)[1].strip("\n"),
        }
    results["tree"].update({
        "nodes": nodes,
        "steps": steps,
        "path": [
            f'{FEATURES[step["feature"]]} {step["value"]:g} '
            f'{"≤" if step["wentLeft"] else ">"} {step["threshold"]:.2f}'
            for step in steps
        ],
    })

    gift_source = f"gift = {[gift.tolist()]}"
    gift_tree = 'print("决策树预测：", iris.target_names[tree.predict(gift)[0]])'
    gift_svm = 'print("SVM 预测：", iris.target_names[svm.predict(gift)[0]])'
    return {
        "sklearnVersion": sklearn.__version__,
        "features": FEATURES,
        "featureNames": iris.feature_names,
        "labels": LABELS,
        "species": iris.target_names.tolist(),
        "points": [
            [float(row[2]), float(row[3]), int(label)]
            for row, label in zip(state["X_train"], state["y_train"])
        ],
        "tableRows": [
            [*row.tolist(), int(label)]
            for row, label in zip(state["X_train"][:5], state["y_train"][:5])
        ],
        "gift": {
            "index": GIFT_INDEX,
            "values": gift.tolist(),
            "label": int(iris.target[GIFT_INDEX]),
        },
        **results,
        "code": {
            "explore": EXPLORE,
            "scatter": SCATTER,
            "pairplot": PAIRPLOT,
            "split": SPLIT,
            "tree": TREE,
            "plotTree": PLOT_TREE,
            "svm": SVM,
            "pca": PCA,
            "gift": gift_source,
            "giftTree": gift_tree,
            "giftSvm": gift_svm,
        },
    }


def cell(cell_type, source, cell_id, **fields):
    return {
        "cell_type": cell_type,
        "id": cell_id,
        "metadata": {},
        "source": source.splitlines(keepends=True),
        **fields,
    }


def make_notebook(data):
    cells = []

    def markdown(source):
        cells.append(cell("markdown", source, f"lesson07-{len(cells):02}"))

    def code(source=""):
        cells.append(cell("code", source, f"lesson07-{len(cells):02}", outputs=[], execution_count=None))

    def reference(title, instruction, source, expected):
        markdown(f"### {title}\n\n{instruction}\n\n```python\n{source}\n```")
        code()
        markdown(f"**运行后核对**　{expected}")

    markdown(
        "# 第七课 · 送你一朵小红花\n\n"
        "公主送给勇士一朵鸢尾花。先看看城堡花谱，再训练两种模型，最后打开花签核对。\n\n"
        "在安装了 `scikit-learn`、`matplotlib`、`pandas`、`seaborn` 的 "
        "Python 3 内核中打开本笔记本。先运行准备格，再按顺序在空白格跟写并运行。"
        "三个练习共用同一内核。重启内核后，从准备格重新运行。"
    )
    markdown("### 准备格\n\n从 Iris 花谱取出四项测量和种类标签。园丁先把考卷分开放好。")
    code(SPLIT)
    markdown(
        "运行后看到 `105 45`。105 条用于看图与训练，45 条留给测试。"
        "下面四个数来自花谱中的示例花。课堂上请换成礼花的实测读数，"
        "顺序是萼片长、萼片宽、花瓣长、花瓣宽，单位是厘米。"
    )
    code(data["code"]["gift"])

    markdown("## CHECKLIST 01 · 课堂练习 01 · 画散点图，猜花种")
    reference(
        "准备画图数据",
        "跟写下方代码，把 105 条训练记录整理成表，给每条记录加上种类名称。",
        EXPLORE,
        "预览前 5 条记录。每行有四项测量和一个 `species`（种类）。",
    )
    reference(
        "画出三类样本和礼花",
        "跟写下方代码。先用花瓣长、花瓣宽画出三类训练样本，再把礼花标在同一张图上。",
        SCATTER,
        "横轴是花瓣长，纵轴是花瓣宽，单位是厘米。三种颜色表示三类训练样本，黄色菱形是礼花。",
    )
    markdown(
        "### 看图并记录\n\n"
        "先找较容易分开的一类，再找两类点挨得近或重叠的地方。"
        "定位黄色菱形，比较它附近两类样本的分布。双击下方记录区，写下你看见的依据和初判。"
    )
    markdown(
        "- 最容易分开的一类：\n"
        "- 挨得近或有重叠的两类：\n"
        "- 礼花附近的样本与我的依据：\n"
        "- 我猜礼花是："
    )
    reference(
        "换几组坐标再看",
        "延续原课件的成对图，同一批记录换轴比较。",
        PAIRPLOT,
        "看到四项特征的成对关系。选一组你认为容易区分的坐标，指出依据。",
    )
    markdown(
        "### AI Time\n\n可以问：“`hue='species'` 控制图上的什么？”"
        "对照图例，指认两个同色的训练点，用图核对 AI 的解释。"
    )

    markdown("## CHECKLIST 02 · 课堂练习 02 · 训练决策树")
    markdown(
        "回看准备格。输入是四项测量 `X`，答案是种类标签 `y`。"
        "`fit` 只使用训练集；`predict` 读取考卷测量值，再用考卷原标签计算准确率。"
    )
    reference(
        "训练、答卷和判分",
        "跟写模型和检验代码，把答对数和准确率写进鉴定卡。",
        TREE,
        f"本课参考运行答对 {data['tree']['correct']} / {data['tree']['total']} 条。"
        "分类报告的 support 表示测试集中该类样本数，每类 15 条。",
    )
    reference(
        "画出真实的树，沿礼花路径走一遍",
        "先画树，再运行礼花预测。记下你走过的一个条件。",
        f"{PLOT_TREE}\n\n{data['code']['giftTree']}",
        "画出深度至多为 3 的树，并得到一个礼花种类预测。",
    )
    markdown(
        "### AI Time\n\n可以问：“在这段代码里，哪一行让模型学习，哪一行让它答题？”"
        "在自己的代码里指出两行，用 `X_train` 和 `X_test` 核对。"
    )

    markdown("## CHECKLIST 03 · 课堂练习 03 · 用 SVM 对照")
    reference(
        "换成 SVM，复用同一份考卷",
        "跟写线性 SVM，使用同一批训练和测试数据，再用同样的四项测量预测礼花。",
        f"{SVM}\n\n{data['code']['giftSvm']}",
        f"本课参考运行答对 {data['svm']['correct']} / {data['svm']['total']} 条。"
        "记录礼花预测，比较两次答卷。这是一次划分上的结果。",
    )
    markdown(
        "### AI Time\n\n可以问：“`kernel='linear'` 是什么意思？"
        "为什么两种模型要用同一份考卷？”用准备格和两段训练代码核对。"
    )
    reference(
        "教师扩展 · 特征降维后的分界图",
        "把四项测量投影到两个坐标，再单独训练示意模型。PCA 只用训练集拟合投影。"
        "这个二维示意模型与上面使用四项测量进行判断的模型各自训练。",
        PCA,
        "看到 PCA 坐标中的三类颜色区域。圆点是训练样本，叉号是测试样本。",
    )

    markdown(
        "## 结课挑战 · 打开花签\n\n"
        "先写下你的初判、散点图依据、决策树预测及一条路径条件、SVM 预测及考卷表现。"
        "教师打开课件里的花签后，看看真实种名是否出现在花谱的三个标签里。"
        "如果没有，说说还需要补充什么数据。"
    )
    return {
        "cells": cells,
        "metadata": {
            "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
            "language_info": {"name": "python", "file_extension": ".py"},
        },
        "nbformat": 4,
        "nbformat_minor": 5,
    }


def write_json(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def make_svm_student_notebook():
    def cell(kind, source, index):
        result = {"cell_type": kind, "metadata": {}, "id": f"svm-{index}", "source": source.splitlines(keepends=True)}
        if kind == "code":
            result.update(execution_count=None, outputs=[])
        return result

    sources = [
        ("markdown", "# 课堂练习三 · 第三次猜花\n\n用支持向量机给礼花预测种名。沿用练习二的训练集与测试集。"),
        ("markdown", "## 训练并检查成绩\n\n运行下面两个单元格，看模型在 45 张测试卡上答对了多少。"),
        ("code", STUDENT_SPLIT),
        ("code", f"{STUDENT_TRAIN}\n\n{STUDENT_REPORT}"),
        ("markdown", "## 填入你的四项读数\n\n按萼片长、萼片宽、花瓣长、花瓣宽的顺序，把四个 None 改成你测得的数字（厘米）。运行并记下输出的种名。"),
        ("code", f"{STUDENT_MEASURE}\n\n{STUDENT_PREDICT}"),
    ]
    return {
        "cells": [cell(kind, source, index) for index, (kind, source) in enumerate(sources)],
        "metadata": {
            "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
            "language_info": {"name": "python", "file_extension": ".py"},
        },
        "nbformat": 4,
        "nbformat_minor": 5,
    }


def build():
    OUT.mkdir(parents=True, exist_ok=True)
    data = evidence()
    notebook = OUT / "第七课练习.ipynb"
    write_json(notebook, make_notebook(data))
    evidence_path = OUT / "evidence.json"
    write_json(evidence_path, data)
    student_notebook = OUT / "lesson7_exe3.ipynb"
    write_json(student_notebook, make_svm_student_notebook())
    student_cells = OUT / "svm-student-cells.json"
    write_json(student_cells, {
        "split": STUDENT_SPLIT, "train": STUDENT_TRAIN, "report": STUDENT_REPORT,
        "measure": STUDENT_MEASURE, "predict": STUDENT_PREDICT,
    })
    subprocess.run([ROOT / "node_modules/.bin/oxfmt", evidence_path, student_cells], cwd=ROOT, check=True)
    requirements = OUT / "requirements.txt"
    requirements.write_text("scikit-learn>=1.7\nmatplotlib\npandas\nseaborn\n", encoding="utf-8")
    readme = OUT / "README.md"
    readme.write_text(
        "# 第七课练习包\n\n在 JupyterLab 的 Python 3 内核中打开 `第七课练习.ipynb`。"
        "首次安装库可运行 `python -m pip install -r requirements.txt`，随后启动或重启内核。"
        "练习使用 scikit-learn 自带的 Iris 花谱，安装依赖后可以离线运行。\n\n"
        "先运行准备格，依次跟写三项课堂练习，最后跟老师一起打开课件上的花签。\n\n"
        "也可以单独打开 `lesson7_exe3.ipynb` 完成第三次猜花，按顺序运行并在最后一格填入四项测量值。"
        f"本课核对输出由 scikit-learn {sklearn.__version__} 运行生成。\n",
        encoding="utf-8",
    )
    with zipfile.ZipFile(OUT / "lesson-07-practice.zip", "w", zipfile.ZIP_DEFLATED) as archive:
        for path in [notebook, student_notebook, readme, requirements]:
            archive.write(path, path.name)


if __name__ == "__main__":
    build()
