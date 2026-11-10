from common import local_sample_server

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
plt.rcParams["axes.unicode_minus"] = False

import requests  # 请求网页
from bs4 import BeautifulSoup  # 解析

url = "https://www.creaai.online/battle-towers.html"
res = requests.get(url, timeout=10)  # 获取
res.raise_for_status()
res.encoding = "utf-8"

soup = BeautifulSoup(
    res.text, "html.parser")
csv_text = soup.find(  # 按属性找元素
    id="intel-data").get_text()  # 取文本

with open("towers.csv", "w",  # 打开文件
          encoding="utf-8") as f:
    f.write(csv_text)  # 写入情报
print("情报已保存：towers.csv")

import pandas as pd

towers = pd.read_csv("towers.csv")  # 读 CSV
towers.info()  # 看行列与类型

summary = (  # 按塔和弱点分组，求均值和人数
    towers.groupby(["tower", "weakness"])
    .agg(energy_mean=("energy", "mean"),
         defense_mean=("defense", "mean"),
         count=("guard", "count")).round(1)
)
print(summary)

windows = towers[towers["energy"] < 30]  # 外罩
windows = windows.sort_values(
    ["tower", "defense"])  # 塔内按防御升序
print(windows[
    ["tower", "hour", "energy",
     "defense", "weakness"]
])

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

towers = pd.read_csv("towers.csv")  # 读取 CSV
plt.figure(figsize=(9, 5))  # 准备折线图
# 横轴是时刻，纵轴是外罩强度，按塔分色
sns.lineplot(data=towers, x="hour",
    y="energy", hue="tower", marker="o")
plt.axhline(30, color="#F36D4A", ls="--")
plt.savefig("tower-history.png", dpi=150)
plt.show()

plt.figure(figsize=(9, 5))  # 散点，防御横轴
sns.scatterplot(data=towers, x="defense",
    y="energy", hue="tower", s=100)
plt.axhline(30, color="#F36D4A", ls="--")
plt.savefig("tower-weakness.png", dpi=150)
plt.show()

import requests
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
    f.write(csv_text)

import pandas as pd
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
plt.show()
