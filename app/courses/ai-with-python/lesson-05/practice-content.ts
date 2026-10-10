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
export const PENGUIN_AXIS_LABELS = {
  x: 'Bill length (mm)',
  y: 'Bill depth (mm)',
};

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

export const PENGUIN_PLOT_FIELDS = {
  billLength: { column: 'culmen_length_mm', label: 'Bill length (mm)' },
  billDepth: { column: 'culmen_depth_mm', label: 'Bill depth (mm)' },
  flipper: { column: 'flipper_length_mm', label: 'Flipper length (mm)' },
  mass: { column: 'body_mass_g', label: 'Body mass (g)' },
} as const;

export type PenguinPlotField = keyof typeof PENGUIN_PLOT_FIELDS;

function getPenguinCode(
  x: PenguinPlotField,
  y: PenguinPlotField,
  colored: boolean,
) {
  return `penguins = pd.read_csv("Penguins_cleaned.csv")
sns.scatterplot(
    data=penguins,
    x="${PENGUIN_PLOT_FIELDS[x].column}",
    y="${PENGUIN_PLOT_FIELDS[y].column}"${colored ? ',\n    hue="species"' : ''}
)
plt.xlabel("${PENGUIN_PLOT_FIELDS[x].label}")
plt.ylabel("${PENGUIN_PLOT_FIELDS[y].label}")
plt.show()`;
}

export const PENGUIN_CODE = getPenguinCode('billLength', 'billDepth', true);

export const PENGUIN_PRACTICE_CODE = `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

${PENGUIN_CODE}`;

export function getPenguinFullCode(
  x: PenguinPlotField,
  y: PenguinPlotField,
  colored: boolean,
) {
  return [
    'import pandas as pd\nimport seaborn as sns',
    FONT_CODE,
    getPenguinCode(x, y, colored),
  ].join('\n\n');
}

export const PENGUIN_FULL_CODE = getPenguinFullCode(
  'billLength',
  'billDepth',
  true,
);

export const PAIRPLOT_CODE = `penguins = pd.read_csv("Penguins_cleaned.csv")
sns.pairplot(
    data=penguins,
    vars=["culmen_length_mm", "culmen_depth_mm",
          "flipper_length_mm", "body_mass_g"],
    hue="species"
)
plt.show()`;

export const PAIRPLOT_FULL_CODE = [
  'import pandas as pd\nimport seaborn as sns',
  FONT_CODE,
  PAIRPLOT_CODE,
].join('\n\n');

export const PAIRPLOT_UNCOLORED_FULL_CODE = [
  'import pandas as pd\nimport seaborn as sns',
  FONT_CODE,
  PAIRPLOT_CODE.replace(',\n    hue="species"', ''),
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
  '# 教师演示：恶魔种类颜色与特征线索\n' + HUE_CODE,
  '# 教师演示：企鹅四项数值特征的关系总览\n' + PAIRPLOT_CODE,
  '# 课堂练习 03：企鹅喙长与喙深，按种类着色\n' + PENGUIN_PRACTICE_CODE,
].join('\n\n');
