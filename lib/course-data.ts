export const assetBase = '/courses/ai-with-python/lesson-01/assets';

export const lessonChapters = [
  {
    id: 'chapter-1',
    number: '01',
    title: '机器真的会思考吗？',
    summary: '从图灵的问题出发，沿着 AI 历史寻找线索，再理解数据、规律与预测。',
    slides: 'P3–P18',
  },
  {
    id: 'chapter-2',
    number: '02',
    title: '启动 AI 工具台',
    summary:
      '认识 Anaconda 与 JupyterLab，创建 Notebook，让第一段 Python 代码运行起来。',
    slides: 'P19–P30',
  },
  {
    id: 'chapter-3',
    number: '03',
    title: '训练城堡守门模型',
    summary: '把角色变成数据，训练决策树，再让模型判断谁可以进入城堡。',
    slides: 'P31–P43',
  },
];

export const courseStages = [
  {
    id: 'data',
    number: '01',
    label: '阶段一',
    title: '数据',
    english: 'DATA',
    lessons: '第 02–06 课',
    start: 2,
    end: 6,
    goal: '把数据变成有用的信息',
  },
  {
    id: 'model',
    number: '02',
    label: '阶段二',
    title: '模型',
    english: 'MODEL',
    lessons: '第 07–11 课',
    start: 7,
    end: 11,
    goal: '让模型从数据中学习规律',
  },
];

export const courseLessons = [
  {
    number: '01',
    stage: 'intro',
    title: '走进 AI 世界',
    summary: '认识机器学习，使用 JupyterLab，训练并检验第一个决策树模型。',
    tags: ['AI 入门', 'Jupyter', '机器学习'],
    available: true,
    href: '/courses/ai-with-python/lesson-01',
  },
  {
    number: '02',
    stage: 'data',
    title: '热点事件早知道——网页爬虫大揭秘',
    summary: '建立勇士情报站，提取网页消息，完成情报塔挑战。',
    tags: ['Python', '网页数据', '网页解析'],
    available: true,
    href: '/courses/ai-with-python/lesson-02',
  },
  {
    number: '03',
    stage: 'data',
    title: '探险家的日记本——记录你的冒险旅程',
    summary: '用 Python 读取和保存文件，留下自己的冒险记录。',
    tags: ['文件读取', '文件写入', '数据存储'],
    available: false,
  },
  {
    number: '04',
    stage: 'data',
    title: '数据小侦探——寻找最闪光的演员',
    summary: '整理演员数据，寻找线索并得出结论。',
    tags: ['数据处理', '线索挖掘', '分析结论'],
    available: false,
  },
  {
    number: '05',
    stage: 'data',
    title: '勇闯图表世界——企鹅家族分分类',
    summary: '用不同图表观察企鹅的特征与差异。',
    tags: ['图表', '可视化', '多变量数据'],
    available: false,
  },
  {
    number: '06',
    stage: 'data',
    isStageProject: true,
    title: '综合练习一：一朵心情会变换的云',
    summary: '获取、整理并呈现数据，完成第一个作品。',
    tags: ['综合练习', '数据可视化', '课程作品'],
    available: false,
  },
  {
    number: '07',
    stage: 'model',
    title: '送你一朵小红花——让机器帮你分类',
    summary: '用带标签的数据训练模型，再检验分类结果。',
    tags: ['监督学习', '分类', '完整流程'],
    available: false,
  },
  {
    number: '08',
    stage: 'model',
    title: '神奇的占卜师——让机器帮你预测',
    summary: '学习线性回归，用已有数据预测新的数值。',
    tags: ['线性回归', '预测', '回归任务'],
    available: false,
  },
  {
    number: '09',
    stage: 'model',
    title: '同类总往一块儿靠——让机器帮你分群',
    summary: '用 K-means 聚类，找出相似的数据和每组特点。',
    tags: ['K-means', '聚类', '簇特征'],
    available: false,
  },
  {
    number: '10',
    stage: 'model',
    title: '机器能思考吗——探索深度学习和神经网络',
    summary: '认识神经网络，用代码完成一次简单的训练。',
    tags: ['深度学习', '神经网络', '编程实战'],
    available: false,
  },
  {
    number: '11',
    stage: 'model',
    isStageProject: true,
    title: '综合练习二：回到泰坦尼克号沉没的那一天',
    summary: '分析乘客数据，完成第二个机器学习作品。',
    tags: ['综合练习', '泰坦尼克', '机器学习'],
    available: false,
  },
  {
    number: '12',
    stage: 'challenge',
    title: '结课挑战',
    summary: '独立串联数据、分析与模型，完成挑战并领取课程证书。',
    tags: ['最终挑战', '综合项目', '课程证书'],
    available: false,
  },
];

export const warriors = [
  {
    name: '钢铁守卫者',
    attack: 35,
    defense: 85,
    health: 420,
    category: '勇士',
    type: '防御型',
    image: 'image114.png',
  },
  {
    name: '暗影掠夺者',
    attack: 90,
    defense: 25,
    health: 180,
    category: '恶魔',
    type: '高攻偷袭型',
    image: 'image115.png',
  },
  {
    name: '森林游侠',
    attack: 65,
    defense: 50,
    health: 310,
    category: '勇士',
    type: '均衡型',
    image: 'image116.png',
  },
  {
    name: '腐肉巨兽',
    attack: 45,
    defense: 60,
    health: 480,
    category: '恶魔',
    type: '肉盾型',
    image: 'image123.png',
  },
  {
    name: '火焰剑士',
    attack: 80,
    defense: 40,
    health: 260,
    category: '勇士',
    type: '进攻型',
    image: 'image117.png',
  },
  {
    name: '剧毒蠕虫',
    attack: 55,
    defense: 35,
    health: 150,
    category: '恶魔',
    type: '低生存毒攻型',
    image: 'image118.png',
  },
  {
    name: '冰晶盾卫',
    attack: 30,
    defense: 90,
    health: 380,
    category: '勇士',
    type: '极致防御型',
    image: 'image119.png',
  },
  {
    name: '骨爪刺客',
    attack: 75,
    defense: 30,
    health: 210,
    category: '恶魔',
    type: '快速突袭型',
    image: 'image120.png',
  },
  {
    name: '大地战锤',
    attack: 50,
    defense: 70,
    health: 350,
    category: '勇士',
    type: '稳健型',
    image: 'image121.png',
  },
  {
    name: '虚空噬魂者',
    attack: 60,
    defense: 45,
    health: 230,
    category: '恶魔',
    type: '低生存进攻型',
    image: 'image122.png',
  },
];

export const helloCode = `print("Hello")
print("One")
print("Two")
print("Three")`;

export const listCode = `# 01 新建一个名为 my_list 的列表

# 02 往列表里追加 1、2、3 这三个元素

# 03 在屏幕上打印列表的第二个元素

# 04 用 for 循环打印列表的全部元素`;

export const listAnswerRows = [
  {
    number: '01',
    question: '新建一个名为 my_list 的列表',
    answer: 'my_list = []',
  },
  {
    number: '02',
    question: '往列表里追加 1、2、3',
    answer: 'my_list.append(1); my_list.append(2); my_list.append(3)',
  },
  {
    number: '03',
    question: '打印列表的第二个元素',
    answer: 'print(my_list[1])',
  },
  {
    number: '04',
    question: '用 for 循环打印全部元素',
    answer: 'for item in my_list:\n    print(item)',
  },
] as const;

export const dictionaryCode = `# 01 这是一个创建好的字典
# 字典的 key 是物品，value 是价格
sell_items = {
    "花生": 4,
    "瓜子": 5,
    "矿泉水": 6,
}

# 02 获取并打印“花生”的价格
# 03 遍历字典，打印所有的键值对
# 04 更新字典，把花生的价格改为 7
# 05 判断“瓜子”是否在字典里，是则输出“是”，否则输出“否”`;

export const dictionaryAnswerRows = [
  {
    number: '01',
    question: '创建物品与价格字典',
    answer: 'sell_items = {"花生": 4, "瓜子": 5, "矿泉水": 6}',
  },
  {
    number: '02',
    question: '获取并打印“花生”的价格',
    answer: 'print(sell_items["花生"])',
  },
  {
    number: '03',
    question: '遍历字典，打印所有键值对',
    answer: 'for name, price in sell_items.items():\n    print(name, price)',
  },
  {
    number: '04',
    question: '把花生的价格改为 7',
    answer: 'sell_items["花生"] = 7',
  },
  {
    number: '05',
    question: '判断“瓜子”是否在字典里',
    answer: 'print("是" if "瓜子" in sell_items else "否")',
  },
] as const;

export const trainingCode = `# 模块的引入，有了anaconda的强大助力，这些机器学习的模块，我们直接引入就能使用了
# 第一次引入的时间大约需要～30s，请耐心等待

# 引入决策树分类器的tree模块、准确率评估的metrics模块
from sklearn import tree, metrics

# 训练数据特征：攻击力、防御力、血量
X = [
    [35, 85, 420],   # 钢铁守卫者
    [90, 25, 180],   # 暗影掠夺者
    [65, 50, 310],   # 森林游侠
    [45, 60, 480],   # 腐肉巨兽
    [80, 40, 260],   # 火焰剑士
    [55, 35, 150],   # 剧毒蠕虫
    [30, 90, 380],   # 冰晶盾卫
    [75, 30, 210],   # 骨爪刺客
    [50, 70, 350],   # 大地战锤
    [60, 45, 230]    # 虚空噬魂者
]

# 标签数据：1表示勇士，0表示恶魔
y = [
    1,  # 钢铁守卫者
    0,  # 暗影掠夺者
    1,  # 森林游侠
    0,  # 腐肉巨兽
    1,  # 火焰剑士
    0,  # 剧毒蠕虫
    1,  # 冰晶盾卫
    0,  # 骨爪刺客
    1,  # 大地战锤
    0   # 虚空噬魂者
]

# 创建决策树分类器
clf = tree.DecisionTreeClassifier()

# 训练模型
clf.fit(X, y)`;

export const predictionCode = `# 准备预测数据
predict_data = [
    [40, 80, 390],
    [70, 38, 190]
]

# 进行预测
predict_res = clf.predict(predict_data)
print(predict_res)

# 统计准确率: 将预测结果与实际结果对比
accuracy = metrics.accuracy_score([1, 0], predict_res)
print(f"预测的准确率为: {accuracy * 100}%")`;
