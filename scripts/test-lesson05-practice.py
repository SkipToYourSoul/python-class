"""Verify the lesson's exact displayed code against its offline teaching data."""

import csv
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import zipfile

os.environ.setdefault("MPLBACKEND", "Agg")
os.environ.setdefault("MPLCONFIGDIR", str(Path(tempfile.gettempdir()) / "lesson05-matplotlib"))
os.environ.setdefault("XDG_CACHE_HOME", str(Path(tempfile.gettempdir()) / "lesson05-cache"))

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/courses/ai-with-python/lesson-05/practice"
LESSON = ROOT / "app/courses/ai-with-python/lesson-05"
spec = importlib.util.spec_from_file_location("build_lesson05", ROOT / "scripts/build-lesson05-practice.py")
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)
code = builder.load_codes()


def main():
    os.chdir(OUT)
    stats = json.loads((OUT / "data-summary.json").read_text())
    assert hashlib.sha256((OUT / "penguins-original.csv").read_bytes()).hexdigest() == stats["penguinOriginalSha256"]
    result = subprocess.run(
        ["node", "--experimental-strip-types", "--input-type=module", "--eval",
         f"import * as source from {json.dumps((LESSON / 'study-data.ts').as_uri())}; "
         "process.stdout.write(JSON.stringify(source));"], capture_output=True, text=True, check=True)
    slides = json.loads(result.stdout)
    for name in ("demons", "patrol", "penguins"):
        assert pd.read_csv(f"{name}.csv").to_dict("records") == slides[name], f"{name}: slide and CSV diverged"
    kind_patrol = pd.read_csv("patrol-by-kind.csv")
    assert kind_patrol.to_dict("records") == slides["kindPatrol"]
    assert len(kind_patrol) == 18 and not kind_patrol.duplicated(["id", "hour"]).any()
    assert kind_patrol.groupby("kind").id.nunique().tolist() == [1, 1, 1]
    for individual, sample in kind_patrol.groupby("id", sort=False):
        assert sample.hour.tolist() == [8, 10, 12, 14, 16, 18]
        source = next(d for d in slides["demons"] if d["id"] == individual)
        assert sample.kind.unique().tolist() == [source["kind"]]
        assert sample.speed.iloc[0] == source["speed"]
    assert kind_patrol.loc[kind_patrol.id == "D001", ["hour", "speed"]].to_dict("records") == slides["patrol"]
    assert kind_patrol.speed.between(0, 10).all(), "Grouped patrol must fit the unchanged original scale"
    demons = pd.read_csv("demons.csv")
    penguins = pd.read_csv("penguins.csv")
    original = pd.read_csv("penguins-original.csv")
    assert len(demons) == 90 and demons.id.is_unique
    assert demons.groupby("kind").size().tolist() == [30, 30, 30]
    assert len(penguins) == 342 and penguins.id.is_unique and not penguins.isna().any().any()
    source_fields = ["bill_length_mm", "bill_depth_mm", "flipper_length_mm", "body_mass_g"]
    complete = original.dropna(subset=source_fields)
    np.testing.assert_array_equal(complete[source_fields].to_numpy(), penguins[["billLength", "billDepth", "flipper", "mass"]].to_numpy())
    assert demons.height.corr(demons.speed) < -0.5
    assert demons.loc[demons.id == "D004", "speed"].item() > 11
    plots = OUT / "reference-plots"
    plots.mkdir(exist_ok=True)
    names = ["01-individual-heights", "02-speed-histogram", "03-height-speed", "04-patrol",
             "05-kind-mean-speeds", "06-practice-height-speed", "07-practice-patrol", "08-practice-kind-mean-speeds",
             "09-demon-kinds", "10-penguin-kinds"]
    for path in plots.glob("*.png"):
        if path.stem not in names:
            path.unlink()
    patrol = pd.read_csv("patrol.csv")
    counts = []
    original_show = plt.show

    def check_scatter(axis):
        assert axis.get_xlabel() == code["SCATTER_AXIS_LABELS"]["x"]
        assert axis.get_ylabel() == code["SCATTER_AXIS_LABELS"]["y"]
        assert len(axis.collections) == 1 and axis.get_legend() is None
        np.testing.assert_allclose(axis.collections[0].get_offsets(), demons[["height", "speed"]])
        assert len(axis.collections[0].get_offsets()) == 90

    def check_patrol(axis):
        assert axis.get_xlabel() == code["LINE_AXIS_LABELS"]["x"]
        assert axis.get_ylabel() == code["LINE_AXIS_LABELS"]["y"]
        np.testing.assert_array_equal(axis.lines[0].get_xdata(), patrol.hour)
        np.testing.assert_allclose(axis.lines[0].get_ydata(), patrol.speed)
        assert len(axis.lines[0].get_xdata()) == 6 and axis.lines[0].get_marker() == "o"

    def check_kind_means(axis):
        assert axis.get_xlabel() == code["KIND_BAR_AXIS_LABELS"]["x"]
        assert axis.get_ylabel() == code["KIND_BAR_AXIS_LABELS"]["y"]
        kinds = [tick.get_text() for tick in axis.get_xticklabels()]
        assert kinds == list(demons.kind.unique())
        np.testing.assert_allclose([p.get_height() for p in axis.patches],
                                   [demons.loc[demons.kind == kind, "speed"].mean() for kind in kinds])
        assert len(kinds) == len(axis.patches) == 3 and not axis.lines

    practice_checks = {"scatter": check_scatter, "line": check_patrol, "bar": check_kind_means}

    def save_plot():
        index = len(counts)
        axis = plt.gca()
        if index == 0:
            np.testing.assert_allclose([p.get_height() for p in axis.patches], demons.head(5).height)
        elif index == 1:
            assert axis.get_xlabel() == code["HIST_AXIS_LABELS"]["x"]
            assert axis.get_ylabel() == code["HIST_AXIS_LABELS"]["y"]
            np.testing.assert_array_equal([p.get_height() for p in axis.patches], [b["count"] for b in stats["demonSpeedBins"]])
            np.testing.assert_allclose([p.get_x() for p in axis.patches], [b["low"] for b in slides["demonHistograms"]["speed"]])
            np.testing.assert_allclose([p.get_width() for p in axis.patches], [b["high"] - b["low"] for b in slides["demonHistograms"]["speed"]])
            assert "bins=" not in code["HIST_CODE"]
            assert sum(p.get_height() for p in axis.patches) == 90
        elif index in (2, 5):
            check_scatter(axis)
        elif index in (3, 6):
            check_patrol(axis)
        elif index in (4, 7):
            check_kind_means(axis)
        elif index in (8, 9):
            expected = len(penguins) if index == 9 else len(demons)
            assert sum(len(collection.get_offsets()) for collection in axis.collections) == expected
            if index == 8:
                assert axis.get_xlabel() == code["SCATTER_AXIS_LABELS"]["x"]
                assert axis.get_ylabel() == code["SCATTER_AXIS_LABELS"]["y"]
        plt.gcf().set_size_inches(10, 6)
        plt.tight_layout()
        plt.savefig(plots / f"{names[index]}.png", dpi=150)
        counts.append(index)
        plt.close("all")

    plt.show = save_plot
    try:
        exec(compile(code["COMPLETE_CODE"], "完整参考.py", "exec"), {})
    finally:
        plt.show = original_show
    assert len(counts) == 10
    # Each plotting cell works after the same font and shared preparation cells.
    assert [step["id"] for step in code["PRACTICE_02_PLOTS"]] == ["scatter", "line", "bar"]
    for step in code["PRACTICE_02_PLOTS"]:
        with tempfile.TemporaryDirectory() as temporary:
            for csv_name in ("demons.csv", "patrol.csv"):
                shutil.copyfile(OUT / csv_name, Path(temporary) / csv_name)
            os.chdir(temporary)
            observed = []

            def check_step():
                axis = plt.gca()
                assert axis.get_xlabel() == step["axisLabels"]["x"]
                assert axis.get_ylabel() == step["axisLabels"]["y"]
                practice_checks[step["id"]](axis)
                observed.append(step["id"])
                plt.close("all")

            plt.show = check_step
            try:
                namespace = {}
                exec(compile(code["FONT_CODE"], "预置字体.py", "exec"), namespace)
                exec(compile(code["PRACTICE_02_PREPARATION"], "练习二共用准备.py", "exec"), namespace)
                exec(compile(step["code"], f"练习二-{step['id']}.py", "exec"), namespace)
                assert observed == [step["id"]]
            finally:
                os.chdir(OUT)
                plt.show = original_show
    # The complete exercise reads both data sources and renders the three distinct examples.
    with tempfile.TemporaryDirectory() as temporary:
        for csv_name in ("demons.csv", "patrol.csv"):
            shutil.copyfile(OUT / csv_name, Path(temporary) / csv_name)
        os.chdir(temporary)
        observed = []

        def check_three():
            practice_checks[["scatter", "line", "bar"][len(observed)]](plt.gca())
            observed.append(True)
            plt.close("all")

        plt.show = check_three
        try:
            namespace = {}
            exec(compile(code["FONT_CODE"], "预置字体.py", "exec"), namespace)
            exec(compile(code["PRACTICE_02_CODE"], "课堂练习二完整参考.py", "exec"), namespace)
            assert len(observed) == 3
        finally:
            os.chdir(OUT)
            plt.show = original_show
    # The challenge's standalone reference must work with only the penguin CSV.
    with tempfile.TemporaryDirectory() as temporary:
        shutil.copyfile(OUT / "penguins.csv", Path(temporary) / "penguins.csv")
        os.chdir(temporary)
        plt.show = lambda: plt.close("all")
        try:
            exec(compile(code["PENGUIN_FULL_CODE"], "企鹅完整参考.py", "exec"), {})
        finally:
            os.chdir(OUT)
            plt.show = original_show
    notebook = json.loads((OUT / "第五课练习.ipynb").read_text())
    assert sum(cell["cell_type"] == "code" and not cell["source"] for cell in notebook["cells"]) == 8
    markdown_cells = ["".join(cell["source"]) for cell in notebook["cells"] if cell["cell_type"] == "markdown"]
    assert sum(text.startswith("## 课堂练习 ") for text in markdown_cells) == 3
    assert sum(text.startswith("## 结课挑战 ") for text in markdown_cells) == 1
    assert any(text.startswith("### 共用准备 ") and code["PRACTICE_02_PREPARATION"] in text for text in markdown_cells)
    for step in code["PRACTICE_02_PLOTS"]:
        assert any(text.startswith("### 步骤 ") and step["code"] in text for text in markdown_cells)
    assert (OUT / "完整参考.py").read_text() == code["COMPLETE_CODE"] + "\n"
    assert (OUT / "课堂练习二完整参考.py").read_text() == code["PRACTICE_02_CODE"] + "\n"
    with zipfile.ZipFile(OUT / "lesson-05-practice.zip", "w", zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(OUT.rglob("*")):
            if path.is_file() and path.suffix != ".zip" and "__pycache__" not in path.parts:
                archive.write(path, path.relative_to(OUT))
    with zipfile.ZipFile(OUT / "lesson-05-practice.zip") as archive:
        assert archive.testzip() is None
        assert archive.read("完整参考.py").decode() == code["COMPLETE_CODE"] + "\n"
        assert archive.read("课堂练习二完整参考.py").decode() == code["PRACTICE_02_CODE"] + "\n"
        assert archive.read("patrol-by-kind.csv") == (OUT / "patrol-by-kind.csv").read_bytes()
        assert len([name for name in archive.namelist() if name.endswith(".png")]) == 10
    print("PASS: exact teaching code generated 10 graphs; axes, slide/CSV equality, histogram counts,")
    print("90-point scatter, six-point patrol line, three kind-mean bars, shared preparation and three plotting cells,")
    print("342 unchanged complete penguin observations, three classroom exercises, one challenge, notebook cells and ZIP verified.")
    print(f"Demon height-speed correlation: {demons.height.corr(demons.speed):.3f}")


if __name__ == "__main__":
    main()
