import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

towers = pd.read_csv("towers.csv")

plt.figure(figsize=(9, 5))
sns.lineplot(data=towers, x="hour",
             y="energy", hue="tower",
             marker="o")
plt.axhline(30, color="#F36D4A", ls="--")
plt.ylim(0, 100)
plt.xlabel("观测时刻（时）")
plt.ylabel("外罩强度")
plt.tight_layout()
plt.savefig("tower-history.png", dpi=150)
plt.show()

plt.figure(figsize=(9, 5))
sns.scatterplot(data=towers, x="defense",
                y="energy", hue="tower",
                s=100)
plt.axhline(30, color="#F36D4A", ls="--")
plt.ylim(0, 100)
plt.xlabel("守卫防御力")
plt.ylabel("外罩强度")
plt.tight_layout()
plt.savefig("tower-weakness.png", dpi=150)
plt.show()
