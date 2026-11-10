export const assetBase = '/courses/ai-with-python/lesson-07';
export const firstChapterTitle = ['如何让机器', '帮你分类'] as const;
export const secondChapterTitle = ['让机器学会', '问问题'] as const;
export const thirdChapterTitle = ['在花点之间', '留一条走廊'] as const;

export const chapters = [
  { id: 'start', number: '07', title: '城堡来信' },
  { id: 'samples', number: '01', title: '机器分类' },
  { id: 'tree', number: '02', title: secondChapterTitle.join('') },
  { id: 'svm', number: '03', title: '在花点之间留一条走廊' },
  { id: 'finish', number: '结课', title: '打开花签' },
] as const;

export const scenes = [
  { id: 'l7-cover', chapter: 'start', title: '公主的礼物', source: [] },
  { id: 'l7-recap', chapter: 'start', title: '前情提要', source: [] },
  {
    id: 'l7-iris',
    chapter: 'start',
    title: '认识鸢尾花',
    source: [2, 3, 4],
  },
  {
    id: 'l7-culture',
    chapter: 'start',
    title: '公主送给勇士的是哪一种鸢尾花？',
    source: [5],
  },
  {
    id: 'l7-one-cover',
    chapter: 'samples',
    title: firstChapterTitle.join(''),
    source: [1, 6, 7],
  },
  {
    id: 'l7-ml-recap',
    chapter: 'samples',
    title: '机器怎样帮我们解决问题？',
    source: [9],
  },
  {
    id: 'l7-learning-methods',
    chapter: 'samples',
    title: '机器可以怎么学？',
    source: [10, 11],
  },
  {
    id: 'l7-ai',
    chapter: 'samples',
    title: '机器怎样学会认花？',
    source: [8],
  },
  {
    id: 'l7-tasks',
    chapter: 'samples',
    title: '猜种名，还是猜高度？',
    source: [12, 13],
  },
  {
    id: 'l7-flow',
    chapter: 'samples',
    title: '用花谱给礼花分类的四步',
    source: [14, 19],
  },
  {
    id: 'l7-case-intro',
    chapter: 'samples',
    title: '看爱情大师如何预测离婚',
    source: [15],
  },
  {
    id: 'l7-case',
    chapter: 'samples',
    title: '从对话记录到随访结果',
    source: [17, 18],
  },
  {
    id: 'l7-case-flow',
    chapter: 'samples',
    title: '用对话做分类的四步',
    source: [16, 18],
  },
  {
    id: 'l7-measure-story',
    chapter: 'samples',
    title: '园丁拿出一把尺子',
    source: [22],
  },
  {
    id: 'l7-data',
    chapter: 'samples',
    title: '一朵花怎样写进数据表？',
    source: [20, 22],
  },
  {
    id: 'l7-practice-01',
    chapter: 'samples',
    title: '第一次猜花 · 从散点图找线索',
    source: [20, 23],
  },
  {
    id: 'l7-two-cover',
    chapter: 'tree',
    title: secondChapterTitle.join(''),
    source: [25, 26],
  },
  {
    id: 'l7-cards-story',
    chapter: 'tree',
    title: '给礼花分类，需要哪三个条件？',
    source: [19, 27],
  },
  {
    id: 'l7-tree-concept',
    chapter: 'tree',
    title: '认识机器学习模型：决策树',
    source: [28],
  },
  {
    id: 'l7-split',
    chapter: 'tree',
    title: '决策树怎样挑出第一道问题？',
    source: [29],
  },
  {
    id: 'l7-tree-path',
    chapter: 'tree',
    title: '认识决策树的节点和边',
    source: [30],
  },
  {
    id: 'l7-exam',
    chapter: 'tree',
    title: '训练前，先留出一份考卷',
    source: [31],
  },
  {
    id: 'l7-tree-discussion',
    chapter: 'tree',
    title: '什么时候需要让模型帮忙？',
    source: [32],
  },
  {
    id: 'l7-practice-02',
    chapter: 'tree',
    title: '第二次猜花 · 顺着决策树走',
    source: [33, 34],
  },
  {
    id: 'l7-three-cover',
    chapter: 'svm',
    title: thirdChapterTitle.join(''),
    source: [36, 37],
  },
  {
    id: 'l7-tree-review',
    chapter: 'svm',
    title: '决策树好解释，为什么会改判？',
    source: [38],
  },
  {
    id: 'l7-floor-story',
    chapter: 'svm',
    title: '公主在地上拉起一条线',
    source: [],
  },
  {
    id: 'l7-margin',
    chapter: 'svm',
    title: '哪条分界留出了更宽的间隔？',
    source: [39, 40],
  },
  {
    id: 'l7-hyperplane',
    chapter: 'svm',
    title: '分界从直线变成了什么？',
    source: [41],
  },
  {
    id: 'l7-practice-03',
    chapter: 'svm',
    title: '第三次猜花 · 看分类边界',
    source: [42, 43],
  },
  {
    id: 'l7-compare',
    chapter: 'svm',
    title: '同一张考卷，两种解法',
    source: [],
  },
  {
    id: 'l7-pca',
    chapter: 'svm',
    title: '把四项测量投到一张图上',
    source: [44],
  },
  {
    id: 'l7-finish',
    chapter: 'finish',
    title: '监督学习小结',
    source: [45],
  },
  {
    id: 'l7-challenge',
    chapter: 'finish',
    title: '公主打开花签',
    source: [46, 47],
  },
] as const;

export type LessonSevenScene = (typeof scenes)[number];

export const chapterTasks = {
  'l7-one-cover': '用园丁标好种名的花谱训练模型，给礼花分类。',
  'l7-two-cover':
    '第一次猜花时，有些花点挨得太近，光看散点图不好判断。\n这次让机器一步步提问，帮我们再猜一次礼花的种名。',
  'l7-three-cover':
    '刚才沿着决策树猜过一次。\n这次用支持向量机看分类边界，第三次猜花。',
};
