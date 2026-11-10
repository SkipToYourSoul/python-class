/** Slides, copy buttons and practice downloads use these exact strings. */
export const HISTORY_URL = 'https://www.creaai.online/battle-towers.html';
export const BOSS_URL = 'https://pythonwithme.coze.site/boss-intel.html';
export const CURRENT_URL = BOSS_URL;
export const PRACTICE_DOWNLOAD_URL =
  '/courses/ai-with-python/lesson-06/practice/lesson-06-practice.zip';

const PLOT_IMPORTS = `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt`;

export const PREPARATION_CODE = `from common import local_sample_server

# 环境格：直接运行，不用跟写。
station = local_sample_server()
url = station + "/battle-towers.html"
current_url = station + "/boss-intel.html"
print("备用本机情报站：", url)

import matplotlib.pyplot as plt
import seaborn as sns
sns.set_palette(["#1457D9", "#BE4B2B", "#16806A"])
plt.rcParams["font.size"] = 14
plt.rcParams["font.sans-serif"] = [
    "Heiti SC", "Microsoft YaHei",
    "Noto Sans CJK SC",
    "Arial Unicode MS", "DejaVu Sans"
]
plt.rcParams["axes.unicode_minus"] = False`;

export const FETCH_CODE = `import requests
from bs4 import BeautifulSoup

url = "${HISTORY_URL}"
res = requests.get(url, timeout=10)
res.raise_for_status()
res.encoding = "utf-8"`;

export const PARSE_CODE = `soup = BeautifulSoup(
    res.text, "html.parser")
csv_text = soup.find(
    id="intel-data").get_text()`;

export const SAVE_CODE = `with open("towers.csv", "w",
          encoding="utf-8") as f:
    f.write(csv_text)
print("情报已保存：towers.csv")`;

const PRACTICE_01_FETCH_CODE = FETCH_CODE.replace(
  'import requests',
  'import requests  # 请求网页',
)
  .replace('import BeautifulSoup', 'import BeautifulSoup  # 解析')
  .replace('timeout=10)', 'timeout=10)  # 获取');
const PRACTICE_01_PARSE_CODE = PARSE_CODE.replace(
  'soup.find(',
  'soup.find(  # 按属性找元素',
).replace('.get_text()', '.get_text()  # 取文本');
const PRACTICE_01_SAVE_CODE = SAVE_CODE.replace(
  '"w",',
  '"w",  # 打开文件',
).replace('f.write(csv_text)', 'f.write(csv_text)  # 写入情报');
export const PRACTICE_01_CODE = [
  PRACTICE_01_FETCH_CODE,
  PRACTICE_01_PARSE_CODE,
  PRACTICE_01_SAVE_CODE,
].join('\n\n');
export const PRACTICE_01_FILL_ANSWERS = [
  'requests',
  'BeautifulSoup',
  'get',
  'find',
  'intel-data',
  'get_text',
  'open',
  'write',
] as const;
export const PRACTICE_01_FILL_CODE = PRACTICE_01_CODE.replace(
  'import requests',
  'import ____',
)
  .replace('from bs4 import BeautifulSoup', 'from bs4 import ____')
  .replace('requests.get(', 'requests.____(')
  .replace('soup.find(', 'soup.____(')
  .replace('id="intel-data"', 'id="____"')
  .replace('.get_text()', '.____()')
  .replace('with open(', 'with ____(')
  .replace('f.write(', 'f.____(');

const READ_TOWERS_CODE = `import pandas as pd

towers = pd.read_csv("towers.csv")`;

export const INSPECT_CODE = `${READ_TOWERS_CODE}
print(towers.head())
towers.info()
print(towers.dtypes)`;

export const GROUP_CODE = `summary = (
    towers.groupby(["tower", "weakness"])
    .agg(energy_mean=("energy", "mean"),
         defense_mean=("defense", "mean"),
         count=("guard", "count")).round(1)
)
print(summary)`;

export const FILTER_CODE = `windows = towers[towers["energy"] < 30]
windows = windows.sort_values(
    ["tower", "defense"])
print(windows[
    ["tower", "hour", "energy",
     "defense", "weakness"]
])`;

export const ANALYZE_CODE = `${INSPECT_CODE}\n\n${GROUP_CODE}\n\n${FILTER_CODE}`;
const PRACTICE_02_INSPECT_CODE = `${READ_TOWERS_CODE}  # 读 CSV
towers.info()  # 看行列与类型`;
const PRACTICE_02_ANALYZE_CODE = `${GROUP_CODE}\n\n${FILTER_CODE}`
  .replace('summary = (', 'summary = (  # 按塔和弱点分组，求均值和人数')
  .replace('< 30]', '< 30]  # 外罩')
  .replace('["tower", "defense"])', '["tower", "defense"])  # 塔内按防御升序');
export const PRACTICE_02_CODE = `${PRACTICE_02_INSPECT_CODE}\n\n${PRACTICE_02_ANALYZE_CODE}`;
export const PRACTICE_02_FILL_ANSWERS = [
  'read_csv',
  'info',
  'groupby',
  'mean',
  'count',
  'energy',
  'sort_values',
] as const;
export const PRACTICE_02_FILL_SECTIONS = [
  {
    title: '读取与检查',
    code: PRACTICE_02_INSPECT_CODE.replace('pd.read_csv(', 'pd.____(').replace(
      'towers.info()',
      'towers.____()',
    ),
  },
  {
    title: '统计与筛选',
    code: PRACTICE_02_ANALYZE_CODE.replace('towers.groupby(', 'towers.____(')
      .replace('("energy", "mean")', '("energy", "____")')
      .replace('("guard", "count")', '("guard", "____")')
      .replace('towers["energy"]', 'towers["____"]')
      .replace('windows.sort_values(', 'windows.____('),
  },
] as const;
export const PRACTICE_02_FILL_CODE = PRACTICE_02_FILL_SECTIONS.map(
  (section) => section.code,
).join('\n\n');

const READ_PLOT_DATA = 'towers = pd.read_csv("towers.csv")';
export const PLOT_PREPARATION_CODE = `${PLOT_IMPORTS}\n\n${READ_PLOT_DATA}`;

export const LINE_CHART_FILE = 'tower-history.png';
export const SCATTER_CHART_FILE = 'tower-weakness.png';

export const LINE_LESSON_CODE = `plt.figure(figsize=(9, 5))  # 设置画布大小
sns.lineplot(data=towers, x="hour",  # 折线，时刻横轴
             y="energy", hue="tower",  # 外罩纵轴，分塔
             marker="o")  # 标出观测点
plt.axhline(30, color="#F36D4A", ls="--")  # 阈值虚线
plt.ylim(0, 100)  # 固定纵轴范围
plt.xlabel("观测时刻（时）")  # 标注横轴
plt.ylabel("外罩强度")  # 标注纵轴
plt.tight_layout()  # 调整图表边距
plt.show()  # 显示图表`;

export const SCATTER_LESSON_CODE = `plt.figure(figsize=(9, 5))  # 设置画布大小
sns.scatterplot(data=towers, x="defense",  # 防御横轴
                y="energy", hue="tower",  # 外罩、分塔
                s=100)  # 设置点的大小
plt.axhline(30, color="#F36D4A", ls="--")  # 阈值虚线
plt.ylim(0, 100)  # 固定纵轴范围
plt.xlabel("守卫防御力")  # 标注横轴
plt.ylabel("外罩强度")  # 标注纵轴
plt.tight_layout()  # 调整图表边距
plt.show()  # 显示图表`;

export const LINE_CODE = `plt.figure(figsize=(9, 5))  # 准备折线图
# 横轴是时刻，纵轴是外罩强度，按塔分色
sns.lineplot(data=towers, x="hour",
    y="energy", hue="tower", marker="o")
plt.axhline(30, color="#F36D4A", ls="--")
plt.savefig("${LINE_CHART_FILE}", dpi=150)
plt.show()`;
export const SCATTER_CODE = `plt.figure(figsize=(9, 5))  # 散点，防御横轴
sns.scatterplot(data=towers, x="defense",
    y="energy", hue="tower", s=100)
plt.axhline(30, color="#F36D4A", ls="--")
plt.savefig("${SCATTER_CHART_FILE}", dpi=150)
plt.show()`;
/** Retained for slide imports from earlier revisions. */
export const BAR_CODE = SCATTER_CODE;
export const ADVICE_CODE = `# 用图表核对三支队伍的计划。
# 每塔找外罩低于30、防御较低的观测点。
# 说出时刻，并按守卫弱点选择装备。`;
const LINE_EXERCISE_CODE = `${PLOT_IMPORTS}\n\n${READ_PLOT_DATA}  # 读取 CSV\n${LINE_CODE}`;
export const PRACTICE_03_CODE = `${LINE_EXERCISE_CODE}\n\n${SCATTER_CODE}`;
export const PRACTICE_03_FILL_ANSWERS = [
  'read_csv',
  'lineplot',
  'hour',
  'energy',
  'hue',
  'scatterplot',
  'defense',
] as const;
export const PRACTICE_03_FILL_SECTIONS = [
  {
    title: '读取情报 → 折线找时刻',
    code: LINE_EXERCISE_CODE.replace('pd.read_csv(', 'pd.____(')
      .replace('sns.lineplot(', 'sns.____(')
      .replace('x="hour"', 'x="____"')
      .replace('y="energy"', 'y="____"')
      .replace('hue="tower"', '____="tower"'),
  },
  {
    title: '散点比防御 → 保存证据',
    code: SCATTER_CODE.replace('sns.scatterplot(', 'sns.____(').replace(
      'x="defense"',
      'x="____"',
    ),
  },
] as const;
export const PRACTICE_03_FILL_CODE = PRACTICE_03_FILL_SECTIONS.map(
  (section) => section.code,
).join('\n\n');

export const CURRENT_FETCH_CODE = `import requests
from bs4 import BeautifulSoup

res = requests.get(current_url, timeout=10)
res.raise_for_status()
res.encoding = "utf-8"
soup = BeautifulSoup(
    res.text, "html.parser")
csv_text = soup.find(
    id="intel-data").get_text()
with open("boss.csv", "w",
          encoding="utf-8") as f:
    f.write(csv_text)`;

export const CURRENT_ANALYZE_CODE = `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

boss = pd.read_csv("boss.csv")
weak = boss[boss["energy"] < 30]
print(weak.sort_values("defense"))

plt.figure(figsize=(9, 5))
sns.scatterplot(data=boss, x="defense",
    y="energy", hue="weakness",
    hue_order=["强光", "火焰", "热量"],
    s=150)
for row in boss.itertuples():
    plt.text(row.defense + 1,
             row.energy - 3, row.part)
plt.axhline(30, color="#F36D4A", ls="--")
plt.ylim(0, 100)
plt.xlim(0, 100)
plt.xlabel("部位防御力")
plt.ylabel("外罩强度")
plt.tight_layout()
plt.savefig("boss-weakness.png", dpi=150)
plt.show()`;
export const CURRENT_CODE = `${CURRENT_FETCH_CODE}\n\n${CURRENT_ANALYZE_CODE}`;
export const COMPLETE_CODE = `${PREPARATION_CODE}\n\n${PRACTICE_01_CODE}\n\n${PRACTICE_02_CODE}\n\n${PRACTICE_03_CODE}\n\n${CURRENT_CODE}`;

export const HOMEWORK_01_CODE = `import ____
res = requests.get(url, timeout=10)
with open("towers.____", "w",
          encoding="utf-8") as f:
    f.____(csv_text)`;
export const HOMEWORK_01_ANSWERS = ['requests', 'csv', 'write'];
export const HOMEWORK_02_CODE = `summary = towers.____("tower")
windows = towers[towers["____"] < ____]`;
export const HOMEWORK_02_ANSWERS = ['groupby', 'energy', '30'];
export const HOMEWORK_03_CODE = `sns.lineplot(data=towers, x="____",
             y="____", ____="tower")`;
export const HOMEWORK_03_ANSWERS = ['hour', 'energy', 'hue'];
