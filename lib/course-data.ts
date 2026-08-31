export const assetBase = '/courses/ai-with-python/lesson-01/assets';

export const lessonChapters = [
  {
    id: 'chapter-1',
    number: '01',
    title: '机器是怎么学习的',
    summary: '从人工智能发展史出发，用识字与天气的例子理解数据、特征、建模和预测。',
    slides: 'P3–P18',
  },
  {
    id: 'chapter-2',
    number: '02',
    title: '搞个金刚钻',
    summary: '认识 Anaconda 与 JupyterLab，创建 Notebook，运行第一段 Python 代码。',
    slides: 'P19–P30',
  },
  {
    id: 'chapter-3',
    number: '03',
    title: '识别勇士与恶魔',
    summary: '读取角色数据，训练决策树，并让模型判断谁可以进入城堡。',
    slides: 'P31–P43',
  },
];

export const courseStages = [
  {
    number: '01',
    title: 'Python 与数据入门',
    lessons: '第 1–3 课',
    summary: '从 AI 直觉和 Python 工具出发，学会获取、读取与保存数据。',
  },
  {
    number: '02',
    title: '数据分析与可视化',
    lessons: '第 4–6 课',
    summary: '从数据中寻找线索，用图表表达结论，并完成第一个综合作品。',
  },
  {
    number: '03',
    title: '机器学习核心方法',
    lessons: '第 7–9 课',
    summary: '通过分类、回归和聚类，掌握机器学习最具代表性的三类任务。',
  },
  {
    number: '04',
    title: '深度学习与综合挑战',
    lessons: '第 10–12 课',
    summary: '走进神经网络，再用完整项目串联数据、模型与结论。',
  },
];

export const courseLessons = [
  {
    number: '01',
    stage: '01',
    title: '走进 AI 世界',
    summary: '搭建 Anaconda 与 Jupyter 编程环境，用最简单的程序理解机器学习。',
    tags: ['AI 入门', 'Jupyter', '机器学习'],
    available: true,
    href: '/courses/ai-with-python/lesson-01',
  },
  {
    number: '02',
    stage: '01',
    title: '热点事件早知道——网页爬虫大揭秘',
    summary: '使用 Python 获取实时热点数据，筛选标题、热度等关键信息。',
    tags: ['Python', '网页数据', '数据筛选'],
    available: false,
  },
  {
    number: '03',
    stage: '01',
    title: '探险家的日记本——记录你的冒险旅程',
    summary: '用 Python 读写文件，让程序拥有眼睛和记忆。',
    tags: ['文件读取', '文件写入', '数据存储'],
    available: false,
  },
  {
    number: '04',
    stage: '02',
    title: '数据小侦探——寻找最闪光的演员',
    summary: '学习数据的基础处理技巧，从数据中挖掘线索并得出结论。',
    tags: ['数据处理', '线索挖掘', '分析结论'],
    available: false,
  },
  {
    number: '05',
    stage: '02',
    title: '勇闯图表世界——企鹅家族分分类',
    summary: '认识不同图表的呈现形态，用可视化表达单变量与多变量数据。',
    tags: ['图表', '可视化', '多变量数据'],
    available: false,
  },
  {
    number: '06',
    stage: '02',
    title: '综合练习一：一朵心情会变换的云',
    summary: '综合练习数据获取、处理和可视化，完成第一个课程作品。',
    tags: ['综合练习', '数据可视化', '课程作品'],
    available: false,
  },
  {
    number: '07',
    stage: '03',
    title: '送你一朵小红花——让机器帮你分类',
    summary: '了解监督学习，使用分类算法实践完整的机器学习流程。',
    tags: ['监督学习', '分类', '完整流程'],
    available: false,
  },
  {
    number: '08',
    stage: '03',
    title: '神奇的占卜师——让机器帮你预测',
    summary: '学习线性回归的基本概念，用数据训练模型并完成预测。',
    tags: ['线性回归', '预测', '回归任务'],
    available: false,
  },
  {
    number: '09',
    stage: '03',
    title: '同类总往一块儿靠——让机器帮你分群',
    summary: '理解 K-means 聚类，对数据进行分群并发现每个簇的特点。',
    tags: ['K-means', '聚类', '簇特征'],
    available: false,
  },
  {
    number: '10',
    stage: '04',
    title: '机器能思考吗——探索深度学习和神经网络',
    summary: '从生动的比喻出发理解深度学习，完成最基础的神经网络编程实战。',
    tags: ['深度学习', '神经网络', '编程实战'],
    available: false,
  },
  {
    number: '11',
    stage: '04',
    title: '综合练习二：回到泰坦尼克号沉没的那一天',
    summary: '用 Python 解决一个完整的机器学习问题，交付第二个课程作品。',
    tags: ['综合练习', '泰坦尼克', '机器学习'],
    available: false,
  },
  {
    number: '12',
    stage: '04',
    title: '结课挑战',
    summary: '独立串联数据、分析与模型，完成最终挑战并领取课程证书。',
    tags: ['最终挑战', '综合项目', '课程证书'],
    available: false,
  },
];

export const warriors = [
  { name: '钢铁守卫者', attack: 35, defense: 85, health: 420, category: '勇士', type: '防御型', image: 'image114.png' },
  { name: '暗影掠夺者', attack: 90, defense: 25, health: 180, category: '恶魔', type: '高攻偷袭型', image: 'image115.png' },
  { name: '森林游侠', attack: 65, defense: 50, health: 310, category: '勇士', type: '均衡型', image: 'image116.png' },
  { name: '腐肉巨兽', attack: 45, defense: 60, health: 480, category: '恶魔', type: '肉盾型', image: 'image123.png' },
  { name: '火焰剑士', attack: 80, defense: 40, health: 260, category: '勇士', type: '进攻型', image: 'image117.png' },
  { name: '剧毒蠕虫', attack: 55, defense: 35, health: 150, category: '恶魔', type: '低生存毒攻型', image: 'image118.png' },
  { name: '冰晶盾卫', attack: 30, defense: 90, health: 380, category: '勇士', type: '极致防御型', image: 'image119.png' },
  { name: '骨爪刺客', attack: 75, defense: 30, health: 210, category: '恶魔', type: '快速突袭型', image: 'image120.png' },
  { name: '大地战锤', attack: 50, defense: 70, health: 350, category: '勇士', type: '稳健型', image: 'image121.png' },
  { name: '虚空噬魂者', attack: 60, defense: 45, health: 230, category: '恶魔', type: '低生存进攻型', image: 'image122.png' },
];

export const helloCode = `print("Hello")
print("One")
print("Two")
print("Three")`;

export const listCode = `# 新建一个名为 my_list 的列表
my_list = [1, 2, 3]

# 读取第二个元素
print(my_list[1])

# 依次打印全部元素
for item in my_list:
    print(item)`;

export const dictionaryCode = `sell_items = {
    "花生": 4,
    "瓜子": 5,
    "矿泉水": 6,
}

print(sell_items["花生"])

for name, price in sell_items.items():
    print(name, price)

sell_items["花生"] = 7
print("瓜子" in sell_items)`;

export const trainingCode = `from sklearn import tree

# 1 = 勇士，0 = 恶魔
data = [
    {"name": "钢铁守卫者", "attack": 35, "defense": 85, "health": 420, "label": 1},
    {"name": "暗影掠夺者", "attack": 90, "defense": 25, "health": 180, "label": 0},
    {"name": "森林游侠", "attack": 65, "defense": 50, "health": 310, "label": 1},
    {"name": "腐肉巨兽", "attack": 45, "defense": 60, "health": 480, "label": 0},
    {"name": "火焰剑士", "attack": 80, "defense": 40, "health": 260, "label": 1},
    {"name": "剧毒蠕虫", "attack": 55, "defense": 35, "health": 150, "label": 0},
    {"name": "冰晶盾卫", "attack": 30, "defense": 90, "health": 380, "label": 1},
    {"name": "骨爪刺客", "attack": 75, "defense": 30, "health": 210, "label": 0},
    {"name": "大地战锤", "attack": 50, "defense": 70, "health": 350, "label": 1},
    {"name": "虚空噬魂者", "attack": 60, "defense": 45, "health": 230, "label": 0},
]

# X 的三列依次是：攻击力、防御力、血量
X = [[w["attack"], w["defense"], w["health"]] for w in data]
y = [w["label"] for w in data]

clf = tree.DecisionTreeClassifier(random_state=0)
clf.fit(X, y)`;

export const predictionCode = `from sklearn import metrics

predict_data = [
    [40, 80, 390],
    [70, 38, 190],
]

predict_res = clf.predict(predict_data)
print(predict_res)  # [1 0]

accuracy = metrics.accuracy_score([1, 0], predict_res)
print(f"Accuracy: {accuracy}")  # 1.0`;
