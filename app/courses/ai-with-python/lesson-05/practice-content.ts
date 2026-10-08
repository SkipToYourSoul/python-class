/** Single source for projected, copied and downloadable Python examples. */
export const SETUP_CODE = `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

demons = pd.read_csv("demons.csv")`;

export const FONT_CODE = `import matplotlib.pyplot as plt
plt.rcParams["font.sans-serif"] = [
    "Heiti SC", "Microsoft YaHei", "Noto Sans CJK SC",
    "Arial Unicode MS", "DejaVu Sans"
]
plt.rcParams["axes.unicode_minus"] = False`;

export const BAR_CODE = `sns.barplot(
    data=demons.head(5),
    x="id", y="height"
)
plt.ylabel("Height (cm)")
plt.show()`;

export const HIST_AXIS_LABELS = { x: 'Speed (m/s)', y: 'Count' };
export const SCATTER_AXIS_LABELS = { x: 'Height (cm)', y: 'Speed (m/s)' };
export const LINE_AXIS_LABELS = { x: 'Hour', y: 'Speed (m/s)' };
export const KIND_BAR_AXIS_LABELS = { x: 'Kind', y: 'Mean speed (m/s)' };

export const HIST_CODE = `sns.histplot(
    data=demons, x="speed"
)
plt.xlabel("${HIST_AXIS_LABELS.x}")
plt.ylabel("${HIST_AXIS_LABELS.y}")
plt.show()`;

export const SCATTER_CODE = `sns.scatterplot(
    data=demons,
    x="height", y="speed"
)
plt.xlabel("${SCATTER_AXIS_LABELS.x}")
plt.ylabel("${SCATTER_AXIS_LABELS.y}")
plt.show()`;

export const HUE_CODE = `sns.scatterplot(
    data=demons,
    x="height", y="speed",
    hue="kind"
)
plt.xlabel("${SCATTER_AXIS_LABELS.x}")
plt.ylabel("${SCATTER_AXIS_LABELS.y}")
plt.show()`;

export const LINE_PLOT_CODE = `sns.lineplot(
    data=patrol,
    x="hour", y="speed",
    marker="o"
)
plt.xlabel("${LINE_AXIS_LABELS.x}")
plt.ylabel("${LINE_AXIS_LABELS.y}")
plt.show()`;

export const LINE_CODE = `patrol = pd.read_csv("patrol.csv")\n${LINE_PLOT_CODE}`;

export const KIND_BAR_CODE = `sns.barplot(
    data=demons,
    x="kind", y="speed",
    errorbar=None
)
plt.xlabel("${KIND_BAR_AXIS_LABELS.x}")
plt.ylabel("${KIND_BAR_AXIS_LABELS.y}")
plt.show()`;

export const KIND_BAR_FULL_CODE = [FONT_CODE, SETUP_CODE, KIND_BAR_CODE].join(
  '\n\n',
);

/** Run this preparation once, then the three plotting cells in order. */
export const PRACTICE_02_PREPARATION = `${SETUP_CODE}\npatrol = pd.read_csv("patrol.csv")`;

export const PRACTICE_02_PLOTS = [
  {
    id: 'scatter',
    title: '散点图',
    question: '身高与速度有什么联系？',
    axisLabels: SCATTER_AXIS_LABELS,
    code: SCATTER_CODE,
  },
  {
    id: 'line',
    title: '折线图',
    question: 'D001 的速度怎样变化？',
    axisLabels: LINE_AXIS_LABELS,
    code: LINE_PLOT_CODE,
  },
  {
    id: 'bar',
    title: '条形图',
    question: '哪一族平均速度更高？',
    axisLabels: KIND_BAR_AXIS_LABELS,
    code: KIND_BAR_CODE,
  },
] as const;

export const PRACTICE_02_CODE = [
  PRACTICE_02_PREPARATION,
  '# 散点图：90 个恶魔的身高与速度有什么联系？\n' + SCATTER_CODE,
  '# 折线图：D001 的速度怎样随时刻变化？\n' + LINE_PLOT_CODE,
  '# 条形图：三族的平均速度有什么不同？\n' + KIND_BAR_CODE,
].join('\n\n');

export const PENGUIN_CODE = `penguins = pd.read_csv("penguins.csv")
sns.scatterplot(
    data=penguins,
    x="billLength", y="billDepth",
    hue="kind"
)
plt.xlabel("Bill length (mm)")
plt.ylabel("Bill depth (mm)")
plt.show()`;

export const PENGUIN_FULL_CODE = [
  'import pandas as pd\nimport seaborn as sns',
  FONT_CODE,
  PENGUIN_CODE,
].join('\n\n');

export const COMPLETE_CODE = [
  '# 第五课：勇闯图表世界 · 完整参考\n# 在练习包文件夹运行；每次关闭图窗后继续下一张图。',
  FONT_CODE,
  SETUP_CODE,
  '# 教师演示：比较前五个个体的身高\n' + BAR_CODE,
  '# 课堂练习 01：速度分布\n' + HIST_CODE,
  '# 教师演示：身高与速度\n' + SCATTER_CODE,
  '# 教师演示：同一个体 D001 的连续观测\n' + LINE_CODE,
  '# 教师演示：比较三族的平均速度\n' + KIND_BAR_CODE,
  '# 课堂练习 02：三个问题，选对三种图\n' + PRACTICE_02_CODE,
  '# 课堂练习 03：加入种类颜色\n' + HUE_CODE,
  '# 结课挑战：企鹅家族有什么不同？（一种可选方案）\n' + PENGUIN_CODE,
].join('\n\n');
