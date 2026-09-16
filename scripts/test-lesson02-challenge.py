"""Check challenge records against scout.html and execute the taught Python.

Run: python3 scripts/test-lesson02-challenge.py
Requires Node >= 22.18 and BeautifulSoup (already used by the course).
"""

import contextlib
import io
import json
from pathlib import Path
import subprocess
import unittest

from bs4 import BeautifulSoup


ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "app/courses/ai-with-python/lesson-02/challenge-data.ts"
EXPORT = f'import {{ levels }} from {json.dumps(DATA.as_uri())}; console.log(JSON.stringify(levels));'
LEVELS = json.loads(subprocess.check_output(["node", "--input-type=module", "-e", EXPORT], text=True))
SCOUT = BeautifulSoup((ROOT / "public/scout.html").read_text(), "html.parser")
FIELDS = ("name", "location", "attribute", "weakness")


def record_data(record):
    return {field: record.find(class_=field).get_text(strip=True) for field in FIELDS}


class ChallengeDataTest(unittest.TestCase):
    def test_all_intelligence_matches_real_sample(self):
        source = {record_data(r)["name"]: record_data(r) for r in SCOUT.find_all(class_="record")}
        for level in LEVELS:
            soup = BeautifulSoup(level["html"], "html.parser")
            actual = [record_data(r) for r in soup.find_all(class_="record")]
            self.assertEqual(actual, level["records"])
            self.assertEqual(actual, [source[r["name"]] for r in actual])
            self.assertLessEqual(len(level["html"].splitlines()), 12)
            for question in level["questions"]:
                for highlight in question["highlight"]:
                    self.assertIn(highlight, level["html"])

    def test_nine_questions_have_balanced_answers(self):
        self.assertEqual([level["seconds"] for level in LEVELS], [60, 50, 45])
        for level in LEVELS:
            self.assertEqual(len(level["questions"]), 3)
            self.assertEqual(sorted(q["correct"] for q in level["questions"]), [0, 1, 2])
            for question in level["questions"]:
                self.assertEqual(len(question["options"]), 3)
                self.assertTrue(all(option["feedback"] for option in question["options"]))
                for option in question["options"]:
                    code_lines = option.get("code", "").splitlines()
                    self.assertLessEqual(len(code_lines), 2)
                    self.assertTrue(all(len(line) <= 42 for line in code_lines))
                self.assertLessEqual(max(map(len, question["code"].splitlines())), 55)

    def test_every_cumulative_program_runs_and_final_output_matches(self):
        expected = [
            "怕强光\n",
            "迷雾森林 藤蔓 怕火\n",
            "炎角兽 北方峡谷 火焰 怕强光\n冰翼魔 冰封山口 寒冰 怕热\n",
        ]
        for level, output in zip(LEVELS, expected):
            soup = BeautifulSoup(level["html"], "html.parser")
            for index, question in enumerate(level["questions"]):
                namespace = {"soup": soup, "record": soup.find(class_="record")}
                capture = io.StringIO()
                with contextlib.redirect_stdout(capture):
                    exec(question["code"], namespace)
                if index == 2:
                    self.assertEqual(capture.getvalue(), output)
                elif index == 1 and level["id"] == "canyon":
                    self.assertEqual(namespace["element"]["class"], ["weakness"])
                elif index == 1 and level["id"] == "forest":
                    for field in FIELDS[1:]:
                        self.assertEqual(namespace[field]["class"], [field])
                elif index == 1:
                    self.assertEqual(len(namespace["records"]), 2)

    def test_correct_options_with_code_match_the_completed_program(self):
        for level in LEVELS:
            soup = BeautifulSoup(level["html"], "html.parser")
            namespace = {"soup": soup, "record": soup.find(class_="record")}
            for question in level["questions"]:
                option = question["options"][question["correct"]]
                with contextlib.redirect_stdout(io.StringIO()):
                    exec(question["code"], namespace)
                if "code" not in option:
                    continue
                if option["code"].startswith("print("):
                    capture = io.StringIO()
                    with contextlib.redirect_stdout(capture):
                        exec(option["code"], namespace)
                    self.assertEqual(capture.getvalue().strip(), "迷雾森林 藤蔓 怕火")
                else:
                    result = eval(option["code"], namespace)
                    if level["id"] == "canyon":
                        self.assertIn("怕强光", str(result))
                    elif level["id"] == "forest":
                        self.assertEqual(result, "迷雾森林")
                    else:
                        self.assertEqual([record_data(r) for r in result], level["records"])

    def test_final_level_reorders_fields_to_require_attribute_matching(self):
        soup = BeautifulSoup(LEVELS[-1]["html"], "html.parser")
        records = soup.find_all(class_="record")
        self.assertEqual(records[0].find("span")["class"], ["weakness"])
        self.assertEqual(records[1].find("span")["class"], ["attribute"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
