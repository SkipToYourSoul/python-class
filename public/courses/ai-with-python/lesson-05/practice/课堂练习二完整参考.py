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
