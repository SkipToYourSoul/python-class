import pandas as pd

df = pd.read_csv("attack-records.csv")
print(df.head())

df.info()

print(df.iloc[0])

focus = df[
    ["记录编号", "出现的恶魔", "威胁值"]
].copy()
print(focus.head())

work = focus.copy()
names = work["出现的恶魔"].str.split("/")
work["出现的恶魔"] = names
expanded = work.explode("出现的恶魔")

groups = expanded.groupby("出现的恶魔")[
    "威胁值"
]
summary = groups.agg(["mean", "count"])
print(summary.round(1))

eligible = summary[summary["count"] >= 3]
ranking = eligible.sort_values(
    "mean", ascending=False
)
print(ranking.round(1))
