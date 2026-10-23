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
