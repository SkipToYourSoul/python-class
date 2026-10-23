"""Run classroom Python against a local HTTP fixture and verify data and charts."""

import importlib.util
from contextlib import redirect_stdout
import io
import json
import os
from pathlib import Path
import shutil
import sys
import tempfile
import zipfile

os.environ.setdefault("MPLCONFIGDIR", "/tmp/lesson06-matplotlib")
os.environ.setdefault("XDG_CACHE_HOME", "/tmp/lesson06-cache")
os.environ.setdefault("MPLBACKEND", "Agg")
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("lesson06_builder", ROOT / "scripts/build-lesson06-practice.py")
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)
OUT = builder.OUT


def parsed_csv(html):
    soup = BeautifulSoup(html, "html.parser")
    text = soup.find(id="intel-data").get_text()
    return pd.read_csv(io.StringIO(text))


def fill_code(reference, answers):
    for answer in answers:
        reference = reference.replace("____", answer, 1)
    assert "____" not in reference
    return reference


def main():
    builder.build()
    source = builder.load_module("study-data.ts")
    codes = builder.load_module("practice-content.ts")
    assert codes["HISTORY_URL"] == "https://www.creaai.online/battle-towers.html"
    assert f'url = "{codes["HISTORY_URL"]}"' in codes["FETCH_CODE"]
    classroom_fill = codes["PRACTICE_01_FILL_CODE"]
    classroom_answers = codes["PRACTICE_01_FILL_ANSWERS"]
    assert classroom_fill.count("____") == len(classroom_answers) == 8
    completed_classroom = fill_code(classroom_fill, classroom_answers)
    assert completed_classroom == codes["PRACTICE_01_CODE"]
    analysis_fill = codes["PRACTICE_02_FILL_CODE"]
    analysis_answers = codes["PRACTICE_02_FILL_ANSWERS"]
    assert analysis_answers == ["read_csv", "head", "info", "groupby", "mean", "count", "energy", "sort_values"]
    assert analysis_fill.count("____") == len(analysis_answers) == 8
    completed_analysis = fill_code(analysis_fill, analysis_answers)
    assert completed_analysis == codes["PRACTICE_02_CODE"]
    assert "\n\n".join(section["code"] for section in codes["PRACTICE_02_FILL_SECTIONS"]) == analysis_fill
    assert codes["PRACTICE_02_FILL_SECTIONS"][0]["code"].count("____") == 3
    assert codes["PRACTICE_02_FILL_SECTIONS"][1]["code"].count("____") == 5
    assert 'defense_mean=("defense", "mean")' in analysis_fill
    visualization_fill = codes["PRACTICE_03_FILL_CODE"]
    visualization_answers = codes["PRACTICE_03_FILL_ANSWERS"]
    assert visualization_answers == ["read_csv", "lineplot", "hour", "energy", "hue", "scatterplot", "defense", "savefig"]
    assert visualization_fill.count("____") == len(visualization_answers) == 8
    completed_visualization = fill_code(visualization_fill, visualization_answers)
    assert completed_visualization == codes["PRACTICE_03_CODE"]
    assert "\n\n".join(section["code"] for section in codes["PRACTICE_03_FILL_SECTIONS"]) == visualization_fill
    assert codes["PRACTICE_03_FILL_SECTIONS"][0]["code"].count("____") == 5
    assert codes["PRACTICE_03_FILL_SECTIONS"][1]["code"].count("____") == 3
    history = pd.DataFrame(source["history"])
    current = pd.DataFrame(source["battleReadings"])
    boss = pd.DataFrame(source["bossRecords"])
    assert len(history) == 36 and len(current) == 3 and len(boss) == 9
    evidence = json.loads((builder.LESSON / "analysis-evidence.json").read_text())
    assert evidence == builder.analysis_evidence()
    assert evidence == json.loads((OUT / "analysis-evidence.json").read_text())
    assert "RangeIndex: 36 entries, 0 to 35" in evidence["info"]
    assert "Data columns (total 8 columns):" in evidence["info"]
    assert evidence["info"].count("36 non-null") == 8
    assert history.notna().all().all()
    assert list(history.columns) == builder.TOWER_FIELDS
    assert history.guard.tolist() == [f"G{number:03}" for number in range(1, 37)]
    assert not history.duplicated(["tower", "hour"]).any()
    for tower, group in history.groupby("tower"):
        assert list(group.hour) == list(range(6, 18)) and len(group) == 12
        assert group.energy.between(0, 100).all()
        assert group.defense.between(0, 100).all()
        assert group.weakness.nunique() == 1 and group.kind.nunique() == 1
    windows = history[history.energy < source["ATTACK_THRESHOLD"]]
    assert len(windows) == 6
    pd.testing.assert_frame_equal(
        pd.DataFrame(source["windows"]).sort_values(["tower", "defense"]).reset_index(drop=True),
        windows.sort_values(["tower", "defense"]).reset_index(drop=True),
    )
    assert [(row["tower"], row["hour"], row["weakness"]) for row in source["plans"]] == [
        ("北塔", 11, "强光"), ("东塔", 14, "火焰"), ("西塔", 17, "热量")]
    north = history[history.tower == "北塔"]
    assert north.loc[north.energy.idxmin(), "hour"] == 10
    assert north[north.hour == 10].defense.iloc[0] == 42
    assert north[north.hour == 11].defense.iloc[0] == 30
    assert current.hour.tolist() == [11, 14, 17]
    assert current.energy.tolist() == [21, 24, 22]
    assert (current.energy < source["ATTACK_THRESHOLD"]).all()
    assert all(team["equipment"] == plan["weakness"] and team["tower"] == plan["tower"]
               for team, plan in zip(source["TEAMS"], source["plans"]))
    boss_candidates = boss[boss.energy < 30].sort_values("defense")
    assert boss_candidates.part.tolist() == ["胸甲", "腰甲", "左臂"]
    assert boss_candidates.iloc[0].weakness == "火焰"
    assert boss_candidates.iloc[0].energy == 18 and boss_candidates.iloc[0].defense == 24
    for filename, frame in [("battle-towers.html", history),
                            ("battle-towers-current.html", current),
                            ("boss-intel.html", boss)]:
        html = (OUT / "samples" / filename).read_text()
        pd.testing.assert_frame_equal(parsed_csv(html), frame)
        soup = BeautifulSoup(html, "html.parser")
        assert len(soup.select("tbody tr.record")) == len(frame)
        for row, record in zip(soup.select("tbody tr.record"), frame.to_dict("records")):
            assert [cell.get_text() for cell in row.select("td")] == [str(value) for value in record.values()]
        assert (OUT / "samples" / filename).read_bytes() == (ROOT / "public" / filename).read_bytes()

    original_show = plt.show
    original_cwd = Path.cwd()
    snapshots = []

    def check_plot():
        axis = plt.gca()
        assert axis.get_ylim() == (0.0, 100.0)
        assert axis.get_ylabel() == "外罩强度"
        if len(snapshots) == 0:
            lines = [line for line in axis.lines if len(line.get_xdata()) == 12]
            assert len(lines) == 3
            assert axis.get_xlabel() == "观测时刻（时）"
            for tower, line in zip(source["TOWER_NAMES"], lines):
                expected = history[history.tower == tower]
                np.testing.assert_array_equal(line.get_xdata(), expected.hour)
                np.testing.assert_array_equal(line.get_ydata(), expected.energy)
            assert set(text.get_text() for text in axis.get_legend().get_texts()) == set(source["TOWER_NAMES"])
        else:
            frame = history if len(snapshots) == 1 else boss
            assert axis.get_xlabel() == ("守卫防御力" if len(snapshots) == 1 else "部位防御力")
            assert len(axis.collections[0].get_offsets()) == len(frame)
            np.testing.assert_array_equal(axis.collections[0].get_offsets(), frame[["defense", "energy"]])
            hue = "tower" if len(snapshots) == 1 else "weakness"
            if len(snapshots) == 2:
                assert axis.get_xlim() == (0.0, 100.0)
                assert [text.get_text() for text in axis.get_legend().get_texts()] == ["强光", "火焰", "热量"]
                colors = {"强光": "#1457D9", "火焰": "#BE4B2B", "热量": "#16806A"}
                expected_colors = [matplotlib.colors.to_rgba(colors[value]) for value in boss.weakness]
                np.testing.assert_allclose(axis.collections[0].get_facecolors(), expected_colors)
                assert [text.get_text() for text in axis.texts] == boss.part.tolist()
            assert set(text.get_text() for text in axis.get_legend().get_texts()) == set(frame[hue])
        thresholds = [line for line in axis.lines if list(line.get_ydata()) == [30, 30]]
        assert len(thresholds) == 1
        snapshots.append(True)
        plt.close("all")

    with tempfile.TemporaryDirectory(prefix="lesson06-") as temporary:
        work = Path(temporary)
        shutil.copyfile(OUT / "common.py", work / "common.py")
        shutil.copytree(OUT / "samples", work / "samples")
        sys.path.insert(0, temporary)
        os.chdir(work)
        plt.show = check_plot
        namespace = {}
        try:
            exec(compile(codes["PREPARATION_CODE"], "环境格.py", "exec"), namespace)
            assert plt.rcParams["font.size"] == 14
            station = namespace["station"]
            assert namespace["local_sample_server"]() == station
            assert requests.get(station + "/does-not-exist", timeout=5).status_code == 404
            for number in range(1, 4):
                key = f"PRACTICE_{number:02}_CODE"
                classroom_code = {1: completed_classroom, 2: completed_analysis, 3: completed_visualization}[number]
                # Keep tests independent of deployment; only substitute the station address.
                classroom_code = classroom_code.replace(codes["HISTORY_URL"], station + "/battle-towers.html")
                exec(compile(classroom_code, key + ".py", "exec"), namespace)
                if number == 1:
                    pd.testing.assert_frame_equal(pd.read_csv("towers.csv"), history)
                if number == 2:
                    result = namespace["summary"]
                    expected = history.groupby(["tower", "weakness"]).agg(
                        energy_mean=("energy", "mean"), defense_mean=("defense", "mean"),
                        count=("guard", "count")).round(1)
                    pd.testing.assert_frame_equal(result, expected)
                    assert result["count"].tolist() == [12, 12, 12]
                    pd.testing.assert_frame_equal(namespace["windows"], windows.sort_values(["tower", "defense"]))
                filled = fill_code(codes[f"HOMEWORK_{number:02}_CODE"], codes[f"HOMEWORK_{number:02}_ANSWERS"])
                exec(compile(filled, f"课后填空{number}.py", "exec"), namespace)
                plt.close("all")
            exec(compile(codes["CURRENT_CODE"], "魔王挑战.py", "exec"), namespace)
            pd.testing.assert_frame_equal(pd.read_csv("towers.csv"), history)
            pd.testing.assert_frame_equal(pd.read_csv("boss.csv"), boss)
            pd.testing.assert_frame_equal(namespace["weak"].sort_values("defense"), boss_candidates)
            assert len(snapshots) == 3
            destination = OUT / "reference-plots"
            destination.mkdir(exist_ok=True)
            for filename in ["tower-history.png", "tower-weakness.png", "boss-weakness.png"]:
                assert (work / filename).stat().st_size > 10000
                shutil.copyfile(work / filename, destination / filename)
            for filename, frame in [("battle-towers.html", history),
                                    ("battle-towers-current.html", current),
                                    ("boss-intel.html", boss)]:
                response = requests.get(station + "/" + filename, timeout=5)
                response.encoding = "utf-8"
                pd.testing.assert_frame_equal(parsed_csv(response.text), frame)
        finally:
            sys.modules["common"].stop_sample_server()
            sys.modules.pop("common", None)
            sys.path.pop(0)
            os.chdir(original_cwd)
            plt.show = original_show

    notebook = json.loads((OUT / "第六课练习.ipynb").read_text())
    assert sum(cell["cell_type"] == "code" and not cell["source"] for cell in notebook["cells"]) == 4
    assert sum("environment-setup" in cell["metadata"].get("tags", []) for cell in notebook["cells"]) == 1
    assert sum("student-input" in cell["metadata"].get("tags", []) for cell in notebook["cells"]) == 4
    assert sum("homework-fill-in" in cell["metadata"].get("tags", []) for cell in notebook["cells"]) == 3
    classroom_cells = [cell for cell in notebook["cells"]
                       if "classroom-fill-in" in cell["metadata"].get("tags", [])]
    assert len(classroom_cells) == 3
    for cell, expected_code in zip(classroom_cells, [classroom_fill, analysis_fill, visualization_fill]):
        assert "".join(cell["source"]) == expected_code
        assert not cell["outputs"] and cell["execution_count"] is None
    markdown = ["".join(cell["source"]) for cell in notebook["cells"] if cell["cell_type"] == "markdown"]
    assert sum(text.startswith("## 课堂练习 ") for text in markdown) == 3
    assert sum(text.startswith("## CHECKPOINT ") for text in markdown) == 3
    assert sum(text.startswith("## 结课挑战") for text in markdown) == 1
    for key in ["CURRENT_CODE",
                "HOMEWORK_01_CODE", "HOMEWORK_02_CODE", "HOMEWORK_03_CODE"]:
        assert any(codes[key] in text for text in markdown)
    assert not any(codes["PRACTICE_01_CODE"] in text for text in markdown)
    assert not any(codes["PRACTICE_02_CODE"] in text for text in markdown)
    assert not any(codes["PRACTICE_03_CODE"] in text for text in markdown)
    assert (OUT / "完整参考.py").read_text() == codes["COMPLETE_CODE"] + "\n"
    assert not (OUT / "towers.csv").exists() and not (OUT / "boss.csv").exists()
    builder.build_zip()
    with zipfile.ZipFile(OUT / "lesson-06-practice.zip") as archive:
        assert archive.testzip() is None
        assert archive.read("完整参考.py").decode() == codes["COMPLETE_CODE"] + "\n"
        assert len([name for name in archive.namelist() if name.endswith(".png")]) == 3
        assert "towers.csv" not in archive.namelist() and "boss.csv" not in archive.namelist()
        assert {"expected-output/towers.csv", "expected-output/boss.csv", "课后填空答案.txt"}.issubset(archive.namelist())
        assert archive.read("课堂填空答案.txt").decode() == (
            "课堂练习 01：" + "、".join(classroom_answers) + "\n\n"
            + "课堂练习 02：" + "、".join(analysis_answers) + "\n\n"
            + "课堂练习 03：" + "、".join(visualization_answers) + "\n")
        assert json.loads(archive.read("analysis-evidence.json")) == evidence
        assert not any("__pycache__" in name for name in archive.namelist())
    print("PASS: teaching Python with a local station URL requested real HTTP, saved 36×8 tower and 9×4 boss CSVs;")
    print("grouped means/counts, six attack windows, three deployments, line/scatter evidence verified;")
    print("three eight-blank classroom flows, three short homework fill-ins, four blank student cells, actual info/head/dtypes evidence, reused server and ZIP verified.")


if __name__ == "__main__":
    main()
