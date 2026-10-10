# 第五课：勇闯图表世界 · 完整参考
# 在练习包文件夹运行；每次关闭图窗后继续下一张图。

import matplotlib.pyplot as plt
plt.rcParams["font.sans-serif"] = [
    "Heiti SC", "Microsoft YaHei", "Noto Sans CJK SC",
    "Arial Unicode MS", "DejaVu Sans"
]
plt.rcParams["axes.unicode_minus"] = False

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

demons = pd.read_csv("demons.csv")

# 教师演示：比较前五个个体的身高
sns.barplot(
    data=demons.head(5),
    x="id", y="height"
)
plt.ylabel("Height (cm)")
plt.show()

# 课堂练习 01：速度分布
sns.histplot(
    data=demons, x="speed"
)
plt.xlabel("Speed (m/s)")
plt.ylabel("Count")
plt.show()

# 教师演示：身高与速度
sns.scatterplot(
    data=demons,
    x="height", y="speed"
)
plt.xlabel("Height (cm)")
plt.ylabel("Speed (m/s)")
plt.show()

# 教师演示：同一个体 D001 的连续观测
patrol = pd.read_csv("patrol.csv")
sns.lineplot(
    data=patrol,
    x="hour", y="speed",
    marker="o"
)
plt.xlabel("Hour")
plt.ylabel("Speed (m/s)")
plt.show()

# 教师演示：比较三族的平均速度
sns.barplot(
    data=demons,
    x="kind", y="speed",
    errorbar=None
)
plt.xlabel("Kind")
plt.ylabel("Mean speed (m/s)")
plt.show()

# 课堂练习 02：三个问题，选对三种图
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

# 教师演示：恶魔种类颜色与特征线索
sns.scatterplot(
    data=demons,
    x="height", y="speed",
    hue="kind"
)
plt.xlabel("Height (cm)")
plt.ylabel("Speed (m/s)")
plt.show()

# 教师演示：企鹅四项数值特征的关系总览
penguins = pd.read_csv("Penguins_cleaned.csv")
sns.pairplot(
    data=penguins,
    vars=["culmen_length_mm", "culmen_depth_mm",
          "flipper_length_mm", "body_mass_g"],
    hue="species"
)
plt.show()

# 课堂练习 03：企鹅喙长与喙深，按种类着色
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

penguins = pd.read_csv("Penguins_cleaned.csv")
sns.scatterplot(
    data=penguins,
    x="culmen_length_mm",
    y="culmen_depth_mm",
    hue="species"
)
plt.xlabel("Bill length (mm)")
plt.ylabel("Bill depth (mm)")
plt.show()
