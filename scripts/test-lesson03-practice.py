"""Run the shipped lesson 03 teaching code against the downloadable practice pack."""

from contextlib import contextmanager, redirect_stdout
import csv
import hashlib
import importlib.util
import io
import json
import os
from pathlib import Path
import re
import tempfile
import unittest
import zipfile
from bs4 import BeautifulSoup


ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("lesson03_builder", ROOT / "scripts/build-lesson03-practice.py")
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)
SOURCE = builder.load_source()
CODES = SOURCE["codes"]
PACK = ROOT / "public/courses/ai-with-python/lesson-03/practice/lesson-03-practice.zip"


@contextmanager
def extracted_pack():
    previous = Path.cwd()
    with tempfile.TemporaryDirectory(prefix="lesson03-check-") as directory:
        with zipfile.ZipFile(PACK) as archive:
            archive.extractall(directory)
        workdir = Path(directory) / "lesson-03-practice"
        os.chdir(workdir)
        try:
            yield workdir
        finally:
            os.chdir(previous)


def run(code, namespace=None):
    namespace = {} if namespace is None else namespace
    stdout = io.StringIO()
    with redirect_stdout(stdout):
        exec(compile(code, "<lesson03-reference>", "exec"), namespace)
    return stdout.getvalue(), namespace


class Lesson03PracticeTests(unittest.TestCase):
    def test_classroom_handoff_instructions_match_the_complete_flow(self):
        with extracted_pack():
            readme = Path("README.md").read_text(encoding="utf-8")
            checklist = next(line for line in readme.splitlines() if line.startswith("- CHECKLIST 02"))
            self.assertIn("reports", checklist)
            self.assertIn("for line in f", checklist)
            self.assertIn("每条一行", checklist)
            self.assertNotIn("重启内核", checklist)
            self.assertNotIn("读原始敌情", checklist)
            notebook = json.loads(Path("第三课练习.ipynb").read_text(encoding="utf-8"))
            lesson = next("".join(cell["source"]) for cell in notebook["cells"]
                          if cell["cell_type"] == "markdown" and "### 02 · 写好交接记录" in "".join(cell["source"]))
            self.assertIn("定义 reports 列表", lesson)
            self.assertIn(CODES["REPORT_COMPLETE_CODE"], lesson)

    def test_homework_contract_matches_the_classroom_tasks(self):
        # The page and pack now share these tasks; a stale generated pack must fail here.
        file_task = SOURCE["homework"]["file"]
        atlas_task = SOURCE["homework"]["atlas"]
        with extracted_pack():
            readme = Path("README.md").read_text(encoding="utf-8")
            notebook = json.loads(Path("第三课练习.ipynb").read_text(encoding="utf-8"))
            markdown_cells = ["".join(cell["source"]) for cell in notebook["cells"] if cell["cell_type"] == "markdown"]
            first = next(text for text in markdown_cells if text.startswith("## CHECKPOINT 01"))
            for requirement in ("两条新的冒险记录", "自己命名的新文件", "重新读取", "测试副本", "预测", "验证"):
                self.assertIn(requirement, first)
            self.assertRegex(first, r"每条一行|各占一行")
            self.assertNotIn("my-handover.txt", first)
            self.assertIn("两条新的冒险记录", readme)
            self.assertIn("自己文件的测试副本", readme)

            second = next(text for text in markdown_cells if text.startswith("## CHECKPOINT 02"))
            for requirement in ("自己的情报表", "原表", "找到记录"):
                self.assertIn(requirement, second)
            self.assertNotRegex(second, r"三个恶魔|三张卡片|三只恶魔|handover\.csv")
            for task, section in ((file_task, first), (atlas_task, second)):
                for field in ("title", "question", "instruction", "tip"):
                    self.assertIn(task[field], section)
                for field in ("title", "instruction", "tip"):
                    self.assertIn(task[field], readme)
            for item in file_task["evidence"] + [file_task["variation"]]:
                self.assertIn(item, first)
                self.assertIn(item, readme)
            for item in atlas_task["directions"] + [atlas_task["evidence"]]:
                self.assertIn(item, second)
                self.assertIn(item, readme)

    def test_write_comparison_demonstrates_actual_file_line_breaks(self):
        with extracted_pack():
            output, namespace = run(CODES["WRITE_JOINED_LINES"])
            joined = Path("line-break-test.txt").read_text(encoding="utf-8")
            self.assertEqual(output, "")
            self.assertEqual(joined, "炎角兽怕强光。藤甲魔怕火。")
            self.assertEqual(joined, SOURCE["joinedLines"])
            self.assertEqual(len(joined.splitlines()), 1)
            self.assertTrue(namespace["f"].closed)

            output, namespace = run(CODES["WRITE_SEPARATE_LINES"])
            separate = Path("line-break-test.txt").read_text(encoding="utf-8")
            self.assertEqual(output, "")
            self.assertEqual(separate, "炎角兽怕强光。\n藤甲魔怕火。\n")
            self.assertEqual(separate, SOURCE["separateLines"])
            self.assertEqual(len(separate.splitlines()), 2)
            self.assertTrue(namespace["f"].closed)

            notebook = json.loads(Path("第三课练习.ipynb").read_text(encoding="utf-8"))
            markdown = "\n\n".join("".join(cell["source"]) for cell in notebook["cells"] if cell["cell_type"] == "markdown")
            self.assertIn(CODES["WRITE_JOINED_LINES"], markdown)
            self.assertIn(CODES["WRITE_SEPARATE_LINES"], markdown)
            self.assertIn("写文件没有 print，输出区为空", markdown)
            self.assertIn("文件内容示例", markdown)

    def test_zip_and_direct_downloads_contain_the_same_materials(self):
        practice = ROOT / "public/courses/ai-with-python/lesson-03/practice"
        with zipfile.ZipFile(PACK) as archive:
            for name in archive.namelist():
                with self.subTest(file=name):
                    self.assertTrue(name.startswith("lesson-03-practice/"))
                    local = practice / name.removeprefix("lesson-03-practice/")
                    self.assertTrue(local.is_file())
                    self.assertEqual(archive.read(name), local.read_bytes())

    def test_parser_uses_detail_page_attributes_from_ppt18(self):
        # Independent fixture: detail-page selectors transcribed from PPT page 18.
        # Decoy class names must not be mistaken for the movie's actual fields.
        html = '''<h1><span property="v:itemreviewed">片名样本</span></h1>
        <div id="info"><a rel="v:directedBy">导演样本</a>
        <a rel="v:starring">演员甲</a><a rel="v:starring">演员乙</a></div>
        <strong property="v:average">8.8</strong>
        <span class="title">无关标题</span><span class="director">无关导演</span>
        <span class="actor">无关人员</span><span class="rating_num">0.0</span>'''
        expected = '片名：片名样本\n导演：导演样本\n评分：8.8\n演员：演员甲\n演员：演员乙\n'
        output, _ = run(CODES["PARSE_MOVIE"], {"html": html})
        self.assertEqual(output, expected)
        with extracted_pack():
            Path("detail-fixture.txt").write_text(html, encoding="utf-8")
            output, _ = run(CODES["MOVIE_COMPLETE_CODE"].replace(
                SOURCE["movies"][0]["path"], "./detail-fixture.txt"
            ))
            self.assertEqual(output, expected)

    def test_downloaded_samples_support_ppt18_selectors(self):
        with extracted_pack():
            for movie in SOURCE["movies"]:
                with self.subTest(movie=movie["title"]):
                    soup = BeautifulSoup(Path(movie["path"]).read_text(encoding="utf-8"), "html.parser")
                    self.assertEqual(soup.find("span", attrs={"property": "v:itemreviewed"}).get_text(), movie["title"])
                    self.assertEqual(soup.find("a", attrs={"rel": "v:directedBy"}).get_text(), movie["director"])
                    self.assertEqual(soup.find("strong", attrs={"property": "v:average"}).get_text(), movie["score"])
                    self.assertEqual([a.get_text() for a in soup.find_all("a", attrs={"rel": "v:starring"})], movie["actors"])

    def test_all_three_movies_parse_their_actual_fields(self):
        with extracted_pack():
            for movie in SOURCE["movies"]:
                with self.subTest(movie=movie["title"]):
                    read_code = CODES["READ_MOVIE"].replace(SOURCE["movies"][0]["path"], movie["path"])
                    html_output, namespace = run(read_code)
                    self.assertIn("教学节选", html_output)
                    self.assertIn(movie["title"], html_output)
                    output, _ = run(CODES["PARSE_MOVIE"], namespace)
                    self.assertEqual(output.rstrip("\n"), movie["output"])
                    self.assertTrue(namespace["f"].closed)

    def test_complete_movie_flow_runs_alone_and_rendered_page_matches_source(self):
        with extracted_pack():
            self.assertEqual(
                Path("film_1292052.html").read_bytes(),
                Path("film_1292052.txt").read_bytes(),
            )
            for movie in SOURCE["movies"]:
                with self.subTest(movie=movie["title"]):
                    self.assertEqual(movie["path"], f"./film_{movie['id']}.txt")
                    complete = CODES["MOVIE_COMPLETE_CODE"].replace(
                        SOURCE["movies"][0]["path"], movie["path"]
                    )
                    output, namespace = run(complete)
                    self.assertEqual(output.rstrip("\n"), movie["output"])
                    self.assertTrue(namespace["f"].closed)

    def test_report_round_trip_restart_overwrite_and_original_preserved(self):
        with extracted_pack():
            original = Path("samples/intel-archive.txt")
            initial_hash = hashlib.sha256(original.read_bytes()).hexdigest()
            output, namespace = run(CODES["READ_ARCHIVE"])
            self.assertEqual(output, SOURCE["archive"])
            run(CODES["WRITE_REPORT"], namespace)
            expected = SOURCE["reportOutput"] + "\n"
            self.assertEqual(Path("handover.txt").read_text(encoding="utf-8"), expected)
            # A fresh namespace models a restarted kernel: no variables survive.
            output, fresh_namespace = run(CODES["READ_REPORT"])
            self.assertEqual(output, expected)
            self.assertTrue(fresh_namespace["f"].closed)
            Path("handover.txt").write_text(expected + "过期旧内容\n", encoding="utf-8")
            run(CODES["WRITE_REPORT"])
            self.assertEqual(Path("handover.txt").read_text(encoding="utf-8"), expected)
            output, _ = run(CODES["LINE_BY_LINE"])
            self.assertEqual(output, expected)
            self.assertEqual(hashlib.sha256(original.read_bytes()).hexdigest(), initial_hash)

    def test_handoff_practice_writes_then_iterates_lines_without_source_file(self):
        with tempfile.TemporaryDirectory() as directory:
            previous = Path.cwd()
            os.chdir(directory)
            try:
                output, namespace = run(CODES["REPORT_COMPLETE_CODE"])
                expected = SOURCE["reportOutput"] + "\n"
                self.assertEqual(output, expected)
                self.assertEqual(Path("handover.txt").read_text(encoding="utf-8"), expected)
                self.assertEqual(len(output.splitlines()), 3)
                self.assertTrue(namespace["f"].closed)
            finally:
                os.chdir(previous)

    def test_csv_round_trip_newlines_and_quoted_fields(self):
        with extracted_pack():
            run(CODES["WRITE_CSV"])
            raw = Path("handover.csv").read_bytes()
            self.assertNotIn(b"\r\r\n", raw)
            with open("handover.csv", "r", newline="", encoding="utf-8") as stream:
                actual = list(csv.DictReader(stream))
            expected = [dict(zip(("恶魔", "地点", "弱点"), (row["name"], row["location"], row["weakness"]))) for row in SOURCE["intel"]]
            self.assertEqual(actual, expected)
            self.assertEqual(Path("handover.csv").read_text(encoding="utf-8").rstrip("\n"), SOURCE["csvPreview"])
            output, _ = run(CODES["READ_CSV"])
            self.assertEqual(len(output.splitlines()), 3)
            self.assertIn("藤甲魔 迷雾森林 怕火", output)
            # The taught writer must also handle genuine CSV special characters.
            records = [{"恶魔": '中文,"名称"', "地点": "第一行\n第二行", "弱点": "怕强光"}]
            run(CODES["CSV_WRITER"], {"records": records})
            with open("handover.csv", "r", newline="", encoding="utf-8") as stream:
                self.assertEqual(list(csv.DictReader(stream)), records)

    def test_missing_path_is_observable_and_overwrite_demo_is_correct(self):
        with extracted_pack():
            with self.assertRaises(FileNotFoundError):
                run(CODES["READ_MOVIE"].replace("film_1292052.txt", "missing.txt"))
            self.assertFalse(Path("missing.txt").exists())
            run(CODES["OVERWRITE_FIRST"])
            output, _ = run(CODES["OVERWRITE_SECOND"])
            self.assertEqual(output, "第二份记录\n")

    def test_notebook_has_blank_student_cells_and_executable_complete_references(self):
        with extracted_pack():
            notebook = json.loads(Path("第三课练习.ipynb").read_text(encoding="utf-8"))
            student_cells = [cell for cell in notebook["cells"] if "student-input" in cell["metadata"].get("tags", [])]
            self.assertGreaterEqual(len(student_cells), 8)
            self.assertTrue(all(not cell["source"] and not cell["outputs"] for cell in student_cells))
            namespace = {}
            references = []
            for cell in notebook["cells"]:
                if cell["cell_type"] == "markdown":
                    references += re.findall(r"```python\n(.*?)\n```", "".join(cell["source"]), re.DOTALL)
            for reference in references:
                if reference == CODES["READ_REPORT"]:
                    namespace = {}
                _, namespace = run(reference, namespace)
            self.assertEqual("\n\n".join(SOURCE["movieParseCells"]), CODES["PARSE_MOVIE"])
            self.assertIn(CODES["MOVIE_COMPLETE_CODE"], references)
            self.assertNotIn(CODES["READ_MOVIE"], references)
            self.assertIn(CODES["REPORT_COMPLETE_CODE"], references)
            self.assertNotIn(CODES["READ_ARCHIVE"], references)
            self.assertIn(CODES["WRITE_CSV"], references)

    def test_zip_contains_sources_only(self):
        with zipfile.ZipFile(PACK) as archive:
            names = archive.namelist()
        self.assertEqual(len([name for name in names if name.endswith(".html")]), 1)
        for movie in SOURCE["movies"]:
            self.assertIn("lesson-03-practice/" + movie["path"].removeprefix("./"), names)
        self.assertFalse(any("samples/movies/" in name for name in names))
        self.assertFalse(any(Path(name).name in {"handover.txt", "handover.csv", "line-break-test.txt", "overwrite-test.txt"} for name in names))
        self.assertFalse(any("__pycache__" in name or name.endswith(".pyc") for name in names))


if __name__ == "__main__":
    unittest.main(verbosity=2)
