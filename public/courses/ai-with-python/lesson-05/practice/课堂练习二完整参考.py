from pathlib import Path
from matplotlib import font_manager
import matplotlib.pyplot as plt

# 使用练习包自带的中文字体，无需安装到系统。
_base = Path(__file__).resolve().parent if "__file__" in globals() else Path.cwd()
_font = _base / "fonts" / "NotoSansCJKsc-Regular.otf"
if not _font.is_file():
    raise FileNotFoundError("请完整解压练习包，保留 fonts 文件夹，并在练习包文件夹中打开笔记本。")
font_manager.fontManager.addfont(str(_font))
plt.rcParams["font.family"] = [font_manager.FontProperties(fname=str(_font)).get_name()]
plt.rcParams["axes.unicode_minus"] = False

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

demons = pd.read_csv("demons.csv")
patrol = pd.read_csv("patrol.csv")

# 散点图：90 个恶魔的身高与速度有什么联系？
sns.scatterplot(
    data=demons,
    x="height", y="speed"
)
plt.xlabel("Height (cm)")
plt.ylabel("Speed (m/s)")
plt.show()

# 折线图：D001 的速度怎样随时刻变化？
sns.lineplot(
    data=patrol,
    x="hour", y="speed",
    marker="o"
)
plt.xlabel("Hour")
plt.ylabel("Speed (m/s)")
plt.show()

# 条形图：三族的平均速度有什么不同？
sns.barplot(
    data=demons,
    x="kind", y="speed",
    errorbar=None
)
plt.xlabel("Kind")
plt.ylabel("Mean speed (m/s)")
plt.show()
