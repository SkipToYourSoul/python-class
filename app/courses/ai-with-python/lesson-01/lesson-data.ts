export type ChapterId =
  | 'start'
  | 'chapter-1'
  | 'chapter-2'
  | 'chapter-3'
  | 'finish';
export type SceneMeta = { id: string; chapterId: ChapterId; title: string };

export const scenes: SceneMeta[] = [
  { id: 'start-cover', chapterId: 'start', title: '走进 AI 世界' },
  { id: 'start-roadmap', chapterId: 'start', title: '本课学习路线' },
  { id: 'chapter-1-cover', chapterId: 'chapter-1', title: '机器真的会思考吗' },
  {
    id: 'chapter-1-turing',
    chapterId: 'chapter-1',
    title: '图灵：从密码到智能',
  },
  {
    id: 'chapter-1-milestones',
    chapterId: 'chapter-1',
    title: 'AI 发展里程碑',
  },
  {
    id: 'chapter-1-future',
    chapterId: 'chapter-1',
    title: '影视与现实能力对照',
  },
  {
    id: 'chapter-1-agi',
    chapterId: 'chapter-1',
    title: '未来的AI会是什么模样？',
  },
  { id: 'chapter-1-samuel', chapterId: 'chapter-1', title: '什么是机器学习' },
  {
    id: 'chapter-1-learning-analogy',
    chapterId: 'chapter-1',
    title: '回忆认字，理解机器学习',
  },
  {
    id: 'chapter-1-train-predict',
    chapterId: 'chapter-1',
    title: '训练与预测',
  },
  {
    id: 'chapter-1-discussion',
    chapterId: 'chapter-1',
    title: '你想教机器什么',
  },
  {
    id: 'chapter-1-practice',
    chapterId: 'chapter-1',
    title: '写出或画出未来世界',
  },
  { id: 'chapter-2-cover', chapterId: 'chapter-2', title: '启动 AI 工具台' },
  { id: 'chapter-2-anaconda', chapterId: 'chapter-2', title: '认识 Anaconda' },
  {
    id: 'chapter-2-editor-transition',
    chapterId: 'chapter-2',
    title: '从 Mu 到 JupyterLab',
  },
  {
    id: 'chapter-2-jupyter-interface',
    chapterId: 'chapter-2',
    title: '认识 JupyterLab 界面',
  },
  {
    id: 'chapter-2-notebook-create',
    chapterId: 'chapter-2',
    title: '新建 Notebook',
  },
  {
    id: 'chapter-2-notebook-code',
    chapterId: 'chapter-2',
    title: '写下第一行代码',
  },
  {
    id: 'chapter-2-notebook-run',
    chapterId: 'chapter-2',
    title: '运行当前单元格',
  },
  {
    id: 'chapter-2-notebook-save',
    chapterId: 'chapter-2',
    title: 'Markdown 与保存',
  },
  {
    id: 'chapter-2-practice',
    chapterId: 'chapter-2',
    title: '课堂练习 02 · Python 小实验',
  },
  { id: 'chapter-3-cover', chapterId: 'chapter-3', title: '训练城堡守门模型' },
  {
    id: 'chapter-3-castle-problem',
    chapterId: 'chapter-3',
    title: '城堡守门难题',
  },
  {
    id: 'chapter-3-discussion',
    chapterId: 'chapter-3',
    title: '你会怎样识别身份',
  },
  {
    id: 'chapter-3-role-samples',
    chapterId: 'chapter-3',
    title: '什么是决策树',
  },
  {
    id: 'chapter-3-dataset',
    chapterId: 'chapter-3',
    title: '代码实践路线',
  },
  {
    id: 'chapter-3-tree-concept',
    chapterId: 'chapter-3',
    title: '准备训练数据',
  },
  {
    id: 'chapter-3-training-data',
    chapterId: 'chapter-3',
    title: '创建并训练模型',
  },
  {
    id: 'chapter-3-training-fit',
    chapterId: 'chapter-3',
    title: '看懂模型的规则',
  },
  {
    id: 'chapter-3-tree-result',
    chapterId: 'chapter-3',
    title: '预测陌生角色',
  },
  { id: 'chapter-3-prediction', chapterId: 'chapter-3', title: '检查预测结果' },
  { id: 'finish-summary', chapterId: 'finish', title: '本课总结' },
];

export const chapterGroups: { id: ChapterId; number: string; title: string }[] =
  [
    { id: 'start', number: '00', title: '课程开始' },
    { id: 'chapter-1', number: '01', title: '机器真的会思考吗' },
    { id: 'chapter-2', number: '02', title: '启动 AI 工具台' },
    { id: 'chapter-3', number: '03', title: '训练城堡守门模型' },
    { id: 'finish', number: '04', title: '本课总结' },
  ];

export const legacyHashes: Record<string, string> = {
  start: 'start-cover',
  'chapter-1': 'chapter-1-cover',
  'chapter-1-history-gallery': 'chapter-1-future',
  'chapter-1-model-function': 'chapter-1-train-predict',
  'chapter-1-weather': 'chapter-1-train-predict',
  'chapter-1-video-gallery': 'chapter-1-practice',
  'chapter-2': 'chapter-2-cover',
  'chapter-2-hello-python': 'chapter-2-practice',
  'chapter-2-python-review': 'chapter-2-practice',
  'chapter-3': 'chapter-3-cover',
  'chapter-3-game': 'chapter-3-role-samples',
  finish: 'finish-summary',
};
