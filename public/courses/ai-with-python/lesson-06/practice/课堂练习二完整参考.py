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
