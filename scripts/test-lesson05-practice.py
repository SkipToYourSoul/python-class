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
import seaborn as sns
from scipy.stats import gaussian_kde

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
    source_hash = hashlib.sha256((OUT / builder.PENGUIN_SOURCE).read_bytes()).hexdigest()
    assert source_hash == stats["penguinSourceSha256"]
    assert source_hash == "1b6fbc2bd8b3a0f78753adda0372a9b8ec98798a0bad41bfb61e81fb229052a1"
    assert stats["penguinSource"] == builder.PENGUIN_SOURCE
    assert not (OUT / "penguins.csv").exists() and not (OUT / "penguins-original.csv").exists()
    result = subprocess.run(
        ["node", "--experimental-strip-types", "--input-type=module", "--eval",
         f"import * as source from {json.dumps((LESSON / 'study-data.ts').as_uri())}; "
         f"import {{ estimateDensity }} from {json.dumps((LESSON / 'penguin-density.ts').as_uri())}; "
         f"import {{ getPenguinFullCode }} from {json.dumps((LESSON / 'practice-content.ts').as_uri())}; "
         "const densities = Object.fromEntries(['billLength','billDepth','flipper','mass'].map(field => "
         "[field, source.penguinKinds.map(kind => ({kind, ...estimateDensity("
         "source.penguins.filter(p => p.kind === kind).map(p => p[field]), source.penguins.length)}))])); "
         "const dynamicCodes = ['billLength','billDepth','flipper','mass'].flatMap(x => "
         "['billLength','billDepth','flipper','mass'].flatMap(y => [false,true].map(colored => "
         "({x,y,colored,code:getPenguinFullCode(x,y,colored)})))); "
         "process.stdout.write(JSON.stringify({...source, densities, dynamicCodes}));"], capture_output=True, text=True, check=True)
    slides = json.loads(result.stdout)
    for name in ("demons", "patrol"):
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
    penguins = pd.read_csv(builder.PENGUIN_SOURCE)
    assert len(demons) == 90 and demons.id.is_unique
    assert demons.groupby("kind").size().tolist() == [30, 30, 30]
    assert list(penguins.columns) == ["species", "island", "culmen_length_mm", "culmen_depth_mm",
                                     "flipper_length_mm", "body_mass_g", "sex"]
    assert len(penguins) == 342 and not penguins[list(builder.PENGUIN_FIELDS.values())].isna().any().any()
    assert penguins.sex.isna().sum() == stats["penguinMissingSexCount"] == 9
    expected_slides = [{"id": f"P{index:03}", "kind": builder.PENGUIN_KINDS[row.species],
                        "species": row.species, "island": row.island,
                        "sex": None if pd.isna(row.sex) else row.sex,
                        **{key: row[value] for key, value in builder.PENGUIN_FIELDS.items()}}
                       for index, (_, row) in enumerate(penguins.iterrows(), 1)]
    assert slides["penguins"] == expected_slides, "All source rows and their original ordering must survive the slide adapter"
    assert penguins.species.value_counts().to_dict() == {"Adelie": 151, "Chinstrap": 68, "Gentoo": 123}
    assert demons.height.corr(demons.speed) < -0.5
    assert demons.loc[demons.id == "D004", "speed"].item() > 11
    # Verify the browser's density estimator against SciPy, not a second copy of its formula.
    for field, curves in slides["densities"].items():
        for curve in curves:
            values = penguins.loc[penguins.species.map(builder.PENGUIN_KINDS) == curve["kind"], builder.PENGUIN_FIELDS[field]]
            kernel = gaussian_kde(values)
            bandwidth = np.sqrt(kernel.covariance.item())
            support = np.linspace(values.min() - 3 * bandwidth, values.max() + 3 * bandwidth, 200)
            np.testing.assert_allclose(curve["bandwidth"], bandwidth, rtol=1e-12)
            np.testing.assert_allclose([p["value"] for p in curve["points"]], support, rtol=1e-12)
            np.testing.assert_allclose([p["density"] for p in curve["points"]],
                                       kernel(support) * len(values) / len(penguins), rtol=1e-12)
    plots = OUT / "reference-plots"
    plots.mkdir(exist_ok=True)
    names = ["01-individual-heights", "02-speed-histogram", "03-height-speed", "04-patrol",
             "05-kind-mean-speeds", "06-practice-height-speed", "07-practice-patrol", "08-practice-kind-mean-speeds",
             "09-demon-kinds", "10-penguin-overview", "11-penguin-kinds"]
    for path in plots.glob("*.png"):
        if path.stem not in names:
            path.unlink()
    patrol = pd.read_csv("patrol.csv")
    counts = []
    original_show = plt.show
    original_pairplot = sns.pairplot
    pairplots = []

    def record_pairplot(*args, **kwargs):
        grid = original_pairplot(*args, **kwargs)
        pairplots.append(grid)
        return grid

    def check_points(axis, expected):
        points = np.concatenate([collection.get_offsets() for collection in axis.collections
                                 if len(collection.get_offsets())])
        assert len(points) == len(expected)
        # Every observation remains present even if hue changes collection order.
        np.testing.assert_allclose(sorted(map(tuple, points)), sorted(map(tuple, expected.to_numpy())))

    def check_penguin(axis):
        assert axis.get_xlabel() == code["PENGUIN_AXIS_LABELS"]["x"]
        assert axis.get_ylabel() == code["PENGUIN_AXIS_LABELS"]["y"]
        check_points(axis, penguins[["culmen_length_mm", "culmen_depth_mm"]])
        assert {text.get_text() for text in axis.get_legend().get_texts()} == set(penguins.species)

    def check_pairplot(grid, colored=True):
        fields = list(builder.PENGUIN_FIELDS.values())
        assert grid.axes.shape == (4, 4) and len(grid.diag_axes) == 4
        assert grid.x_vars == fields and grid.y_vars == fields
        if colored:
            assert {text.get_text() for text in grid.legend.get_texts()} == set(penguins.species)
        else:
            assert grid.legend is None
        for row, y in enumerate(fields):
            for column, x in enumerate(fields):
                axis = grid.axes[row, column]
                if row != column:
                    check_points(axis, penguins[[x, y]])
                if row == 3:
                    assert axis.get_xlabel() == x
                if column == 0:
                    assert axis.get_ylabel() == y
        for axis, field in zip(grid.diag_axes, fields):
            if not colored:
                expected_counts, expected_edges = np.histogram(penguins[field], bins="auto")
                np.testing.assert_array_equal([patch.get_height() for patch in axis.patches], expected_counts)
                np.testing.assert_allclose([patch.get_x() for patch in axis.patches], expected_edges[:-1])
                assert sum(patch.get_height() for patch in axis.patches) == 342
                continue
            assert not axis.patches and len(axis.collections) == 3
            matched = set()
            for collection in axis.collections:
                vertices = collection.get_paths()[0].vertices
                support = np.unique(vertices[:, 0])
                density = [vertices[vertices[:, 0] == x, 1].max() for x in support]
                assert len(support) == 200
                slide_field = next(key for key, value in builder.PENGUIN_FIELDS.items() if value == field)
                matches = [curve["kind"] for curve in slides["densities"][slide_field]
                           if np.allclose(support, [p["value"] for p in curve["points"]])
                           and np.allclose(density, [p["density"] for p in curve["points"]], rtol=1e-10)]
                assert len(matches) == 1 and matches[0] not in matched
                matched.add(matches[0])
            assert matched == set(penguins.species.map(builder.PENGUIN_KINDS))

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
        elif index == 8:
            check_points(axis, demons[["height", "speed"]])
            assert axis.get_xlabel() == code["SCATTER_AXIS_LABELS"]["x"]
            assert axis.get_ylabel() == code["SCATTER_AXIS_LABELS"]["y"]
            assert {text.get_text() for text in axis.get_legend().get_texts()} == set(demons.kind)
        elif index == 9:
            check_pairplot(pairplots[-1])
        elif index == 10:
            check_penguin(axis)
        plt.gcf().set_size_inches(12, 12) if index == 9 else plt.gcf().set_size_inches(10, 6)
        pairplots[-1].tight_layout() if index == 9 else plt.tight_layout()
        plt.savefig(plots / f"{names[index]}.png", dpi=150)
        counts.append(index)
        plt.close("all")

    plt.show = save_plot
    sns.pairplot = record_pairplot
    try:
        exec(compile(code["COMPLETE_CODE"], "完整参考.py", "exec"), {})
    finally:
        plt.show = original_show
        sns.pairplot = original_pairplot
    assert len(counts) == 11
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
    # Exercise 03 is self-contained after the preconfigured font cell.
    with tempfile.TemporaryDirectory() as temporary:
        shutil.copyfile(OUT / builder.PENGUIN_SOURCE, Path(temporary) / builder.PENGUIN_SOURCE)
        os.chdir(temporary)
        observed = []

        def check_penguin_practice():
            check_penguin(plt.gca())
            observed.append(True)
            plt.close("all")

        plt.show = check_penguin_practice
        try:
            namespace = {}
            exec(compile(code["FONT_CODE"], "预置字体.py", "exec"), namespace)
            exec(compile(code["PENGUIN_PRACTICE_CODE"], "课堂练习三.py", "exec"), namespace)
            assert observed == [True]
        finally:
            os.chdir(OUT)
            plt.show = original_show
    # Teacher references work with only the provided penguin CSV.
    with tempfile.TemporaryDirectory() as temporary:
        shutil.copyfile(OUT / builder.PENGUIN_SOURCE, Path(temporary) / builder.PENGUIN_SOURCE)
        os.chdir(temporary)
        plt.show = lambda: plt.close("all")
        try:
            exec(compile(code["PENGUIN_FULL_CODE"], "企鹅完整参考.py", "exec"), {})
            sns.pairplot = record_pairplot
            exec(compile(code["PAIRPLOT_FULL_CODE"], "企鹅关系总览参考.py", "exec"), {})
            check_pairplot(pairplots[-1])
            exec(compile(code["PAIRPLOT_UNCOLORED_FULL_CODE"], "企鹅未着色总览参考.py", "exec"), {})
            check_pairplot(pairplots[-1], colored=False)
            # Every dropdown combination exports code for its actual fields and color mode.
            for dynamic in slides["dynamicCodes"]:
                observed = []

                def check_dynamic():
                    axis = plt.gca()
                    x = code["PENGUIN_PLOT_FIELDS"][dynamic["x"]]
                    y = code["PENGUIN_PLOT_FIELDS"][dynamic["y"]]
                    assert axis.get_xlabel() == x["label"] and axis.get_ylabel() == y["label"]
                    check_points(axis, penguins[[x["column"], y["column"]]])
                    if dynamic["colored"]:
                        assert {text.get_text() for text in axis.get_legend().get_texts()} == set(penguins.species)
                    else:
                        assert axis.get_legend() is None and len(axis.collections) == 1
                    observed.append(True)
                    plt.close("all")

                plt.show = check_dynamic
                exec(compile(dynamic["code"], "企鹅动态维度参考.py", "exec"), {})
                assert observed == [True]
        finally:
            os.chdir(OUT)
            plt.show = original_show
            sns.pairplot = original_pairplot
    notebook = json.loads((OUT / "第五课练习.ipynb").read_text())
    assert sum(cell["cell_type"] == "code" and not cell["source"] for cell in notebook["cells"]) == 7
    markdown_cells = ["".join(cell["source"]) for cell in notebook["cells"] if cell["cell_type"] == "markdown"]
    assert sum(text.startswith("## 课堂练习 ") for text in markdown_cells) == 3
    assert not any("结课挑战" in text for text in markdown_cells)
    assert any(text.startswith("### 共用准备 ") and code["PRACTICE_02_PREPARATION"] in text for text in markdown_cells)
    for step in code["PRACTICE_02_PLOTS"]:
        assert any(text.startswith("### 步骤 ") and step["code"] in text for text in markdown_cells)
    assert any(text.startswith("跟写参考：") and code["PENGUIN_PRACTICE_CODE"] in text for text in markdown_cells)
    demon_demo = next(i for i, text in enumerate(markdown_cells) if text.startswith("## 教师演示参考 · 恶魔种类"))
    penguin_overview = next(i for i, text in enumerate(markdown_cells) if text.startswith("## 教师演示参考 · 企鹅四项"))
    practice_three = next(i for i, text in enumerate(markdown_cells) if text.startswith("## 课堂练习 03"))
    assert demon_demo < penguin_overview < practice_three
    assert code["PAIRPLOT_FULL_CODE"] in markdown_cells[penguin_overview]
    assert code["PAIRPLOT_UNCOLORED_FULL_CODE"] in markdown_cells[penguin_overview]
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
        assert archive.read(builder.PENGUIN_SOURCE) == (OUT / builder.PENGUIN_SOURCE).read_bytes()
        assert "penguins.csv" not in archive.namelist() and "penguins-original.csv" not in archive.namelist()
        assert len([name for name in archive.namelist() if name.endswith(".png")]) == 11
    print("PASS: exact teaching code generated 11 output figures; axes, slide/CSV equality, histogram counts,")
    print("90-point scatter, six-point patrol line, three kind-mean bars, shared preparation and three plotting cells,")
    print("4×4 penguin pairplot: default histograms without hue, density diagonals with hue,")
    print("12 browser KDE curves match SciPy and Seaborn, 342 points in every scatter cell,")
    print("standalone penguin exercise and 32 dropdown code combinations with matching labels and species legend,")
    print("342 provided observations in original order, 9 missing sex records retained, original CSV bytes preserved,")
    print("three classroom exercises, notebook order, seven empty input cells and ZIP verified.")
    print(f"Demon height-speed correlation: {demons.height.corr(demons.speed):.3f}")


if __name__ == "__main__":
    main()
