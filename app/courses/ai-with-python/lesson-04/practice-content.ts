/** Shared by classroom slides and the downloadable notebook builder. */
export const codeBlocks = {
  load: 'import pandas as pd\n\ndf = pd.read_csv("attack-records.csv")\nprint(df.head())',
  info: 'df.info()',
  row: 'print(df.iloc[0])',
  select:
    'focus = df[\n    ["记录编号", "出现的恶魔", "威胁值"]\n].copy()\nprint(focus.head())',
  split:
    'names = focus["出现的恶魔"].str.split("/")\nfocus["出现的恶魔"] = names\nprint(focus.head())',
  explode: 'expanded = focus.explode("出现的恶魔")\nprint(expanded.head(6))',
  group: 'groups = expanded.groupby("出现的恶魔")[\n    "威胁值"\n]',
  mean: 'means = groups.mean()\nprint(means.round(1))',
  rank: 'ranking = means.reset_index()\nranking = ranking.sort_values(\n    "威胁值", ascending=False\n)\nprint(ranking.round(1))',
  count: 'summary = groups.agg(["mean", "count"])\nprint(summary.round(1))',
  filter:
    'eligible = summary[summary["count"] >= 3]\nranking = eligible.sort_values(\n    "mean", ascending=False\n)\nprint(ranking.round(1))',
} as const;

export const practiceSteps = [
  {
    key: 'load',
    title: '读取战报',
    instruction: '导入 Pandas，读取 CSV，查看前五条记录。',
  },
  {
    key: 'info',
    title: '检查全表',
    instruction: '检查行数、字段和数据类型：应有 36 行，各列都有 36 个非空值。',
  },
  {
    key: 'row',
    title: '取出一条',
    instruction: '读取位置为 0 的第一行，核对 A01 的完整记录。',
  },
  {
    key: 'select',
    title: '选择调查字段',
    instruction: '保留记录编号、出现的恶魔、威胁值三列。',
  },
  {
    key: 'split',
    title: '分开同场名字',
    instruction: '用 / 把名字字符串拆成列表；这时仍然一行一场进攻。',
  },
  {
    key: 'explode',
    title: '让名字各占一行',
    instruction:
      '展开列表；一行变成一个恶魔与一场进攻的关联，威胁值仍属于整场。',
  },
  {
    key: 'group',
    title: '按名字归组',
    instruction:
      '按名字分组，并选中每组的威胁值，准备计算。此单元没有打印输出。',
  },
  {
    key: 'mean',
    title: '求关联进攻均值',
    instruction:
      '计算每个恶魔出现的进攻的平均威胁值。round(1) 只让输出保留一位小数。',
  },
  {
    key: 'rank',
    title: '从高到低排列',
    instruction:
      '先用 reset_index() 把作为索引的名字变回普通列，再按威胁值从高到低排序；这里的威胁值列已经是各组平均值。第一名足以直接结案吗？',
  },
  {
    key: 'count',
    title: '把次数放在旁边',
    instruction: '同时查看平均值和记录数，解释岩背魔为什么需要谨慎判断。',
  },
  {
    key: 'filter',
    title: '调整调查条件',
    instruction:
      '本轮优先调查至少出现 3 次的对象；观察名单变化。3 是课堂调查条件，不是证明首领的定律。',
  },
] as const;

/** Exercise 03 continues from the original string values in exercise 02's focus. */
export const practiceThreeCells = [
  {
    key: 'expand',
    title: '拆分并展开',
    code: 'work = focus.copy()\nnames = work["出现的恶魔"].str.split("/")\nwork["出现的恶魔"] = names\nexpanded = work.explode("出现的恶魔")',
    instruction:
      '接着练习二的 focus 操作副本，保留原始名字字符串。展开后得到 76 条关联；本格没有打印输出。',
  },
  {
    key: 'summarize',
    title: '分组并汇总',
    code: 'groups = expanded.groupby("出现的恶魔")[\n    "威胁值"\n]\nsummary = groups.agg(["mean", "count"])\nprint(summary.round(1))',
    instruction:
      '一次计算平均威胁值与记录次数，打印九个恶魔的汇总表。mean 是平均值，count 是次数。',
  },
  {
    key: 'investigate',
    title: '筛选并排序',
    code: 'eligible = summary[summary["count"] >= 3]\nranking = eligible.sort_values(\n    "mean", ascending=False\n)\nprint(ranking.round(1))',
    instruction:
      '保留至少出现 3 次的对象，再按平均值从高到低排序，打印八个对象的调查名单。解释岩背魔为什么被筛掉。',
  },
] as const;

export const PRACTICE_THREE_CODE = practiceThreeCells
  .map((cell) => cell.code)
  .join('\n\n');
export const COMPLETE_CODE = [
  codeBlocks.load,
  codeBlocks.info,
  codeBlocks.row,
  codeBlocks.select,
  PRACTICE_THREE_CODE,
].join('\n\n');
export const PRACTICE_DOWNLOAD_URL =
  '/courses/ai-with-python/lesson-04/practice/lesson-04-practice.zip';
export const CSV_DOWNLOAD_URL =
  '/courses/ai-with-python/lesson-04/practice/attack-records.csv';
