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
