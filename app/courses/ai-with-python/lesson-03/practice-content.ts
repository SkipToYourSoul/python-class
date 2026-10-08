/** Lesson 03 teaching source, imported by both the page and practice builder. */
// BEGIN PRACTICE SOURCE
export const practiceSource = {
  movies: [
    {
      id: '1292052',
      title: '肖申克的救赎',
      director: '弗兰克·德拉邦特',
      actors: ['蒂姆·罗宾斯', '摩根·弗里曼'],
      score: '9.7',
      path: './film_1292052.txt',
      source: 'https://movie.douban.com/subject/1292052/',
      output:
        '片名：肖申克的救赎\n导演：弗兰克·德拉邦特\n评分：9.7\n演员：蒂姆·罗宾斯\n演员：摩根·弗里曼',
    },
    {
      id: '1291546',
      title: '霸王别姬',
      director: '陈凯歌',
      actors: ['张国荣', '张丰毅', '巩俐'],
      score: '9.6',
      path: './film_1291546.txt',
      source: 'https://movie.douban.com/subject/1291546/',
      output:
        '片名：霸王别姬\n导演：陈凯歌\n评分：9.6\n演员：张国荣\n演员：张丰毅\n演员：巩俐',
    },
    {
      id: '1292722',
      title: '泰坦尼克号',
      director: '詹姆斯·卡梅隆',
      actors: ['莱昂纳多·迪卡普里奥', '凯特·温斯莱特'],
      score: '9.5',
      path: './film_1292722.txt',
      source: 'https://movie.douban.com/subject/1292722/',
      output:
        '片名：泰坦尼克号\n导演：詹姆斯·卡梅隆\n评分：9.5\n演员：莱昂纳多·迪卡普里奥\n演员：凯特·温斯莱特',
    },
  ],
  intel: [
    {
      name: '炎角兽',
      location: '北方峡谷',
      weakness: '怕强光',
    },
    {
      name: '藤甲魔',
      location: '迷雾森林',
      weakness: '怕火',
    },
    {
      name: '冰翼魔',
      location: '冰封山口',
      weakness: '怕热',
    },
  ],
  archive:
    '侦察档案｜交接前已知情报\n炎角兽｜北方峡谷｜怕强光\n藤甲魔｜迷雾森林｜怕火\n冰翼魔｜冰封山口｜怕热\n',
  reportOutput:
    '炎角兽｜北方峡谷｜怕强光\n藤甲魔｜迷雾森林｜怕火\n冰翼魔｜冰封山口｜怕热',
  csvPreview:
    '恶魔,地点,弱点\n炎角兽,北方峡谷,怕强光\n藤甲魔,迷雾森林,怕火\n冰翼魔,冰封山口,怕热',
  codes: {
    READ_MOVIE:
      'path = "./film_1292052.txt"\nwith open(path, "r", encoding="utf-8") as f:\n    html = f.read()\n\nprint(html)',
    MOVIE_COMPLETE_CODE:
      'from bs4 import BeautifulSoup\n\npath = "./film_1292052.txt"\nwith open(path, "r", encoding="utf-8") as f:\n    html = f.read()\n\nsoup = BeautifulSoup(html, "html.parser")\ntitle = soup.find("span", property="v:itemreviewed")\ndirector = soup.find("a", rel="v:directedBy")\nscore = soup.find("strong", property="v:average")\nactors = soup.find_all("a", rel="v:starring")\n\nprint("片名：" + title.get_text(strip=True))\nprint("导演：" + director.get_text(strip=True))\nprint("评分：" + score.get_text(strip=True))\nfor actor in actors:\n    print("演员：" + actor.get_text(strip=True))',
    PARSE_MOVIE:
      'from bs4 import BeautifulSoup\n\nsoup = BeautifulSoup(html, "html.parser")\ntitle = soup.find("span", property="v:itemreviewed")\ndirector = soup.find("a", rel="v:directedBy")\nprint("片名：" + title.get_text(strip=True))\nprint("导演：" + director.get_text(strip=True))\nscore = soup.find("strong", property="v:average")\nprint("评分：" + score.get_text(strip=True))\n\nactors = soup.find_all("a", rel="v:starring")\nfor actor in actors:\n    print("演员：" + actor.get_text(strip=True))',
    READ_ARCHIVE:
      'with open("samples/intel-archive.txt", "r", encoding="utf-8") as f:\n    archive = f.read()\n\nprint(archive, end="")',
    WRITE_JOINED_LINES:
      'path = "./line-break-test.txt"\nwith open(path, "w", encoding="utf-8") as f:\n    f.write("炎角兽怕强光。")\n    f.write("藤甲魔怕火。")',
    WRITE_SEPARATE_LINES:
      'path = "./line-break-test.txt"\nwith open(path, "w", encoding="utf-8") as f:\n    f.write("炎角兽怕强光。\\n")\n    f.write("藤甲魔怕火。\\n")',
    REPORT_COMPLETE_CODE:
      'reports = [\n    "炎角兽｜北方峡谷｜怕强光",\n    "藤甲魔｜迷雾森林｜怕火",\n    "冰翼魔｜冰封山口｜怕热",\n]\n\npath = "./handover.txt"\nwith open(path, "w", encoding="utf-8") as f:\n    for record in reports:\n        f.write(record + "\\n")\n\nwith open(path, "r", encoding="utf-8") as f:\n    for line in f:\n        print(line, end="")',
    REPORT_RECORDS:
      'reports = [\n    "炎角兽｜北方峡谷｜怕强光",\n    "藤甲魔｜迷雾森林｜怕火",\n    "冰翼魔｜冰封山口｜怕热",\n]',
    REPORT_WRITER:
      'with open("handover.txt", "w", encoding="utf-8") as f:\n    for record in reports:\n        f.write(record + "\\n")',
    WRITE_REPORT:
      'reports = [\n    "炎角兽｜北方峡谷｜怕强光",\n    "藤甲魔｜迷雾森林｜怕火",\n    "冰翼魔｜冰封山口｜怕热",\n]\n\nwith open("handover.txt", "w", encoding="utf-8") as f:\n    for record in reports:\n        f.write(record + "\\n")',
    READ_REPORT:
      'with open("handover.txt", "r", encoding="utf-8") as f:\n    report = f.read()\n\nprint(report, end="")',
    LINE_BY_LINE:
      'with open("handover.txt", "r", encoding="utf-8") as f:\n    for line in f:\n        print(line, end="")',
    CSV_RECORDS:
      'records = [\n    {"恶魔": "炎角兽", "地点": "北方峡谷", "弱点": "怕强光"},\n    {"恶魔": "藤甲魔", "地点": "迷雾森林", "弱点": "怕火"},\n    {"恶魔": "冰翼魔", "地点": "冰封山口", "弱点": "怕热"},\n]',
    CSV_WRITER:
      'import csv\n\nfields = ["恶魔", "地点", "弱点"]\npath = "./handover.csv"\nwith open(path, "w", newline="", encoding="utf-8") as f:\n    writer = csv.DictWriter(f, fieldnames=fields)\n    writer.writeheader()\n    writer.writerows(records)',
    WRITE_CSV:
      'records = [\n    {"恶魔": "炎角兽", "地点": "北方峡谷", "弱点": "怕强光"},\n    {"恶魔": "藤甲魔", "地点": "迷雾森林", "弱点": "怕火"},\n    {"恶魔": "冰翼魔", "地点": "冰封山口", "弱点": "怕热"},\n]\n\nimport csv\n\nfields = ["恶魔", "地点", "弱点"]\npath = "./handover.csv"\nwith open(path, "w", newline="", encoding="utf-8") as f:\n    writer = csv.DictWriter(f, fieldnames=fields)\n    writer.writeheader()\n    writer.writerows(records)',
    READ_CSV:
      'import csv\n\nwith open("handover.csv", "r", newline="", encoding="utf-8") as f:\n    reader = csv.DictReader(f)\n    for row in reader:\n        print(row["恶魔"], row["地点"], row["弱点"])',
    OVERWRITE_FIRST:
      'with open("overwrite-test.txt", "w", encoding="utf-8") as f:\n    f.write("第一份记录\\n")',
    OVERWRITE_SECOND:
      'with open("overwrite-test.txt", "w", encoding="utf-8") as f:\n    f.write("第二份记录\\n")\n\nwith open("overwrite-test.txt", "r", encoding="utf-8") as f:\n    print(f.read(), end="")',
  },
  movieParseCells: [
    'from bs4 import BeautifulSoup\n\nsoup = BeautifulSoup(html, "html.parser")\ntitle = soup.find("span", property="v:itemreviewed")\ndirector = soup.find("a", rel="v:directedBy")\nprint("片名：" + title.get_text(strip=True))\nprint("导演：" + director.get_text(strip=True))\nscore = soup.find("strong", property="v:average")\nprint("评分：" + score.get_text(strip=True))',
    'actors = soup.find_all("a", rel="v:starring")\nfor actor in actors:\n    print("演员：" + actor.get_text(strip=True))',
  ],
  joinedLines: '炎角兽怕强光。藤甲魔怕火。',
  separateLines: '炎角兽怕强光。\n藤甲魔怕火。\n',
  homework: {
    file: {
      title: '给下一班勇士留一份档案',
      question: '换一份内容，你还会读写吗？',
      instruction: '编写两条新的冒险记录，保存到新的文件，再重新读取。',
      tip: '可以记录补给、任务进度或探险发现。',
      evidence: [
        '一个自己命名的新文件。',
        '两条记录各占一行。',
        '重新读取后的正确输出。',
      ],
      variation: '在测试副本上再次用 w 打开。先预测旧内容会怎样，再验证。',
    },
    atlas: {
      title: '让档案变成你的作品',
      question: '你的图鉴是什么样？',
      instruction: '用自己的情报表，设计一页方便伙伴使用的图鉴。',
      tip: '内容与原表一致，样式与布局可以自由设计。',
      directions: [
        '城堡档案：按名字查阅资料。',
        '冒险手账：展示每次发现。',
        '指挥台：清楚显示地点和弱点。',
      ],
      evidence: '与 CSV 逐项一致；没有编造信息；伙伴能看清并找到记录。',
    },
  },
  aiPrompt:
    '请根据我提供的csv文件制作一页 “城堡敌情图鉴” 的网页。\n\n每张卡片显示恶魔、记录地点和已知弱点，支持按恶魔名称搜索。\n\n风格用：【城堡档案 / 冒险手账 / 夜间指挥台 / 自定：____】。文字清楚，适合课堂投屏。',
} as const;
// END PRACTICE SOURCE

export const READ_MOVIE = practiceSource.codes.READ_MOVIE;
export const MOVIE_COMPLETE_CODE = practiceSource.codes.MOVIE_COMPLETE_CODE;
export const PARSE_MOVIE = practiceSource.codes.PARSE_MOVIE;
export const READ_ARCHIVE = practiceSource.codes.READ_ARCHIVE;
export const REPORT_RECORDS = practiceSource.codes.REPORT_RECORDS;
export const REPORT_WRITER = practiceSource.codes.REPORT_WRITER;
export const WRITE_REPORT = practiceSource.codes.WRITE_REPORT;
export const READ_REPORT = practiceSource.codes.READ_REPORT;
export const LINE_BY_LINE = practiceSource.codes.LINE_BY_LINE;
export const CSV_RECORDS = practiceSource.codes.CSV_RECORDS;
export const CSV_WRITER = practiceSource.codes.CSV_WRITER;
export const WRITE_CSV = practiceSource.codes.WRITE_CSV;
export const READ_CSV = practiceSource.codes.READ_CSV;
export const OVERWRITE_FIRST = practiceSource.codes.OVERWRITE_FIRST;
export const OVERWRITE_SECOND = practiceSource.codes.OVERWRITE_SECOND;
export const INTEL_RECORDS = practiceSource.intel;
export const MOVIE_PARSE_CELLS = practiceSource.movieParseCells;
export const MOVIE_SAMPLES = practiceSource.movies;
export const MOVIE_OUTPUT = practiceSource.movies[0].output;
export const REPORT_OUTPUT = practiceSource.reportOutput;
export const ARCHIVE_OUTPUT = practiceSource.archive;
export const CSV_PREVIEW = practiceSource.csvPreview;
export const AI_PROMPT = practiceSource.aiPrompt;
export const PRACTICE_DOWNLOAD_URL =
  '/courses/ai-with-python/lesson-03/practice/lesson-03-practice.zip';

export const REPORT_COMPLETE_CODE = practiceSource.codes.REPORT_COMPLETE_CODE;
