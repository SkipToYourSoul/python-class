"""Check lesson 04 data semantics, classroom code, outputs and offline package."""

from contextlib import redirect_stdout
import importlib.util
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
import zipfile

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/courses/ai-with-python/lesson-04/practice"
spec = importlib.util.spec_from_file_location("builder", ROOT / "scripts/build-lesson04-practice.py")
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)


class Lesson04PracticeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.records = json.loads((OUT / "attack-records.json").read_text())
        cls.df = pd.read_csv(OUT / "attack-records.csv")
        cls.source = builder.load_source()
        cls.expanded = cls.df.assign(**{
            "出现的恶魔": cls.df["出现的恶魔"].str.split("/")
        }).explode("出现的恶魔")
        cls.summary = cls.expanded.groupby("出现的恶魔")["威胁值"].agg(["mean", "count"])

    def test_canonical_data_matches_csv_and_is_complete(self):
        self.assertEqual(len(self.records), 36)
        self.assertEqual(list(self.df.columns), builder.FIELDS)
        self.assertEqual(len(self.df["记录编号"].unique()), 36)
        self.assertFalse(self.df.isna().any().any())
        self.assertEqual(set().union(*(set(r["demons"]) for r in self.records)), {
            "炎角兽", "藤甲魔", "冰翼魔", "岩背魔", "雾铃魔", "砂爪魔", "镜翼魔", "苔帽魔", "墨鳍魔"})
        for record, (_, row) in zip(self.records, self.df.iterrows()):
            self.assertEqual(set(record), {"id", "place", "demons", "threat", "minutes"})
            self.assertEqual([record["id"], record["place"], "/".join(record["demons"]),
                              record["threat"], record["minutes"]], row.tolist())
            self.assertEqual(len(record["demons"]), len(set(record["demons"])))
            self.assertTrue(0 <= record["threat"] <= 100)
            self.assertGreater(record["minutes"], 0)

    def test_explode_preserves_each_event_value_without_inventing_events(self):
        self.assertEqual(len(self.expanded), 76)
        self.assertEqual(self.expanded["记录编号"].nunique(), 36)
        for record in self.records:
            rows = self.expanded[self.expanded["记录编号"] == record["id"]]
            self.assertEqual(rows["出现的恶魔"].tolist(), record["demons"])
            self.assertEqual(rows["威胁值"].tolist(), [record["threat"]] * len(record["demons"]))
        self.assertEqual(self.summary.loc["雾铃魔", "count"], 10)
        self.assertAlmostEqual(self.summary.loc["雾铃魔", "mean"], 74.6)

    def test_sample_count_changes_the_lead_and_handles_empty_result(self):
        ranked = self.summary.sort_values("mean", ascending=False)
        self.assertEqual(ranked.index[0], "岩背魔")
        self.assertEqual(ranked.loc["岩背魔"].tolist(), [100, 1])
        for threshold, leader in [(2, "冰翼魔"), (3, "冰翼魔"), (5, "冰翼魔"), (10, "雾铃魔")]:
            ranked = self.summary[self.summary["count"] >= threshold].sort_values("mean", ascending=False)
            self.assertEqual(ranked.index[0], leader)
            self.assertNotIn("岩背魔", ranked.index)
        self.assertEqual(self.summary[self.summary["count"] >= 11].index.tolist(), ["藤甲魔"])
        self.assertTrue(self.summary[self.summary["count"] >= 12].empty)

    def test_data_keeps_multiple_plausible_leads_without_revealing_identity(self):
        # Ranking narrows investigation; it must not double as the answer key.
        ranked = self.summary[self.summary["count"] >= 3].sort_values("mean", ascending=False)
        self.assertEqual(ranked.index.get_loc("雾铃魔"), 2)
        self.assertLessEqual(ranked.iloc[0]["mean"] - ranked.iloc[3]["mean"], 4)
        boss_records = [r for r in self.records if "雾铃魔" in r["demons"]]
        other_high = [r for r in self.records if "雾铃魔" not in r["demons"] and r["threat"] >= 85]
        self.assertGreaterEqual(len(other_high), 6)
        self.assertGreaterEqual(sum(r["threat"] <= 65 for r in boss_records), 3)
        for name, group in self.expanded.groupby("出现的恶魔"):
            if name != "岩背魔":
                self.assertGreaterEqual(group["威胁值"].max() - group["威胁值"].min(), 30)
        # Duration offers another legitimate question, not a second hidden boss label.
        duration = self.expanded.groupby("出现的恶魔")["持续分钟数"].mean()
        self.assertNotEqual(duration.idxmax(), "雾铃魔")

    def test_typescript_rankings_match_pandas_at_every_threshold(self):
        path = ROOT / "app/courses/ai-with-python/lesson-04/investigation-data.ts"
        javascript = """
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
const source = readFileSync(process.argv[1], 'utf8').replace(/^import attackRecords[^;]+;/, 'const attackRecords = ' + readFileSync(process.argv[2], 'utf8') + ';');
const moduleSource = stripTypeScriptTypes(source);
const m = await import('data:text/javascript;base64,' + Buffer.from(moduleSource).toString('base64'));
process.stdout.write(JSON.stringify(Array.from({length: 13}, (_, n) => m.rankSuspects(n))));
"""
        result = subprocess.run(["node", "--input-type=module", "-e", javascript,
                                 str(path), str(OUT / "attack-records.json")],
                                capture_output=True, text=True, check=True)
        for threshold, actual in enumerate(json.loads(result.stdout)):
            expected = self.summary[self.summary["count"] >= threshold].sort_values("mean", ascending=False)
            self.assertEqual([r["name"] for r in actual], expected.index.tolist())
            for row in actual:
                self.assertEqual(row["count"], int(expected.loc[row["name"], "count"]))
                self.assertAlmostEqual(row["mean"], expected.loc[row["name"], "mean"])

    def test_exact_classroom_blocks_and_complete_script_run(self):
        expected = json.loads((OUT / "reference-outputs.json").read_text())
        self.assertEqual(list(self.source["codeBlocks"]), [s["key"] for s in self.source["practiceSteps"]])
        with tempfile.TemporaryDirectory() as temporary:
            work = Path(temporary)
            shutil.copyfile(OUT / "attack-records.csv", work / "attack-records.csv")
            old = Path.cwd()
            try:
                os.chdir(work)
                namespace = {}
                for key, code in self.source["codeBlocks"].items():
                    buffer = io.StringIO()
                    with redirect_stdout(buffer):
                        exec(code, namespace)
                    self.assertEqual(buffer.getvalue(), expected[key], key)
                    if key == "rank":
                        self.assertEqual(list(namespace["ranking"].columns), ["出现的恶魔", "威胁值"])
                        self.assertEqual(namespace["ranking"].iloc[0]["出现的恶魔"], "岩背魔")
                        self.assertEqual(namespace["ranking"].iloc[0]["威胁值"], 100)
                self.assertEqual(len(namespace["focus"]), 36)
                self.assertEqual(len(namespace["expanded"]), 76)
                self.assertEqual(namespace["ranking"].index[0], "冰翼魔")
                self.assertEqual(len(namespace["summary"]), 9)
                with redirect_stdout(io.StringIO()):
                    exec(self.source["codeBlocks"]["filter"].replace(">= 3", ">= 12"), namespace)
                    self.assertTrue(namespace["ranking"].empty)
                    exec(self.source["codeBlocks"]["filter"].replace(">= 3", ">= 1"), namespace)
                    self.assertEqual(namespace["ranking"].index[0], "岩背魔")
                self.assertEqual(list(work.iterdir()), [work / "attack-records.csv"])
                with redirect_stdout(io.StringIO()):
                    exec(self.source["codeBlocks"]["select"], namespace)
                    self.assertTrue(namespace["focus"]["出现的恶魔"].map(lambda value: isinstance(value, str)).all())
                    exec(self.source["codeBlocks"]["split"], namespace)
                    exec(self.source["codeBlocks"]["explode"], namespace)
                    self.assertEqual(len(namespace["expanded"]), 76)
                with redirect_stdout(io.StringIO()):
                    exec(self.source["COMPLETE_CODE"], {})
            finally:
                os.chdir(old)
        self.assertEqual((OUT / "完整参考.py").read_text().rstrip(), self.source["COMPLETE_CODE"])

    def test_notebook_and_zip_are_ready_for_students(self):
        notebook = json.loads((OUT / "第四课练习.ipynb").read_text())
        codes = [c for c in notebook["cells"] if c["cell_type"] == "code"]
        self.assertEqual(len(codes), 4 + 3 + 4)
        self.assertTrue(all(not c["source"] and not c["outputs"] for c in codes))
        texts = "\n".join("".join(c["source"]) for c in notebook["cells"])
        for key in ["load", "info", "row", "select"]:
            code = self.source["codeBlocks"][key]
            self.assertIn(code, texts)
        for cell in self.source["practiceThreeCells"]:
            self.assertIn(cell["code"], texts)
        main_cells = [c for c in codes if any(
            tag.startswith("practice-step-") for tag in c["metadata"]["tags"])]
        self.assertEqual([c["metadata"]["tags"][-1] for c in main_cells], [
            f"practice-step-{key}" for key in
            ["load", "info", "row", "select", "expand", "summarize", "investigate"]])
        self.assertEqual(texts.count(self.source["codeBlocks"]["select"]), 1)
        self.assertNotIn(self.source["codeBlocks"]["split"], texts)
        self.assertNotIn(self.source["codeBlocks"]["rank"], texts)
        self.assertIn("1、3、10", texts)
        for threshold in [1, 3, 10]:
            matching = [c for c in codes if f"compare-count-{threshold}" in c["metadata"]["tags"]]
            self.assertEqual(len(matching), 1)
            self.assertIn(self.source["codeBlocks"]["filter"].replace(">= 3", f">= {threshold}"), texts)
        self.assertNotIn("to_csv", texts)
        self.assertNotIn("保存 CSV", texts)
        self.assertNotIn("investigation-result.csv", texts)
        self.assertFalse((OUT / "参考调查结果.csv").exists())
        self.assertIn("被过滤不等于不重要", texts)
        self.assertIn("也可以自拟", texts)
        self.assertIn("只是“地点平均持续时长”的可选示例", texts)
        with zipfile.ZipFile(OUT / "lesson-04-practice.zip") as archive:
            for name in archive.namelist():
                self.assertEqual(archive.read(name), (OUT / name).read_bytes())
            self.assertNotIn("参考调查结果.csv", archive.namelist())
            self.assertIn("attack-records.csv", archive.namelist())
            self.assertIn("第四课练习.ipynb", archive.namelist())

    def test_three_cells_repeat_safely_and_match_both_printed_outputs(self):
        expected = json.loads((OUT / "practice-three-outputs.json").read_text())
        cells = self.source["practiceThreeCells"]
        self.assertEqual([cell["key"] for cell in cells], ["expand", "summarize", "investigate"])
        self.assertEqual(self.source["PRACTICE_THREE_CODE"], "\n\n".join(cell["code"] for cell in cells))
        original = self.df[["记录编号", "出现的恶魔", "威胁值"]].copy()
        namespace = {"focus": original.copy()}
        for _ in range(3):
            for cell in cells:
                buffer = io.StringIO()
                with redirect_stdout(buffer):
                    exec(cell["code"], namespace)
                self.assertEqual(buffer.getvalue(), expected[cell["key"]])
                pd.testing.assert_frame_equal(namespace["focus"], original)
            self.assertEqual(len(namespace["expanded"]), 76)
            pd.testing.assert_frame_equal(namespace["summary"], self.summary)
            ranking = namespace["ranking"]
            self.assertEqual(len(ranking), 8)
            self.assertEqual(ranking.index[0], "冰翼魔")
            self.assertNotIn("岩背魔", ranking.index)
        self.assertEqual(expected["expand"], "")
        self.assertIn("岩背魔", expected["summarize"])
        self.assertNotIn("岩背魔", expected["investigate"])
        self.assertEqual(sum("print(" in cell["code"] for cell in cells), 2)
        self.assertEqual(self.source["COMPLETE_CODE"].count(".sort_values("), 1)


if __name__ == "__main__":
    unittest.main(verbosity=2)
