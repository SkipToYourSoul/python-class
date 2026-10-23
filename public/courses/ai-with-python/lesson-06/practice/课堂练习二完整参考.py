import pandas as pd

towers = pd.read_csv("towers.csv")
print(towers.head())
towers.info()
print(towers.dtypes)

summary = (
    towers.groupby(["tower", "weakness"])
    .agg(energy_mean=("energy", "mean"),
         defense_mean=("defense", "mean"),
         count=("guard", "count")).round(1)
)
print(summary)

windows = towers[towers["energy"] < 30]
windows = windows.sort_values(
    ["tower", "defense"])
print(windows[
    ["tower", "hour", "energy",
     "defense", "weakness"]
])
