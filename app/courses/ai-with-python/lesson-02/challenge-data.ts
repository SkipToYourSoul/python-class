export type IntelRecord = {
  name: string;
  location: string;
  attribute: string;
  weakness: string;
};

export type IntelOption = {
  label: string;
  code?: string;
  feedback: string;
};

export type IntelQuestion = {
  prompt: string;
  options: IntelOption[];
  correct: number;
  success: string;
  /** 已拼好的 Python 节选；soup 和第一条 record 已准备。 */
  code: string;
  /** 在左侧 HTML 中高亮这些原文。 */
  highlight: string[];
};

export type IntelLevel = {
  id: string;
  title: string;
  brief: string;
  seconds: number;
  records: IntelRecord[];
  html: string;
  questions: IntelQuestion[];
  defense: string;
};

const flame: IntelRecord = {
  name: '炎角兽',
  location: '北方峡谷',
  attribute: '火焰',
  weakness: '怕强光',
};
const vine: IntelRecord = {
  name: '藤甲魔',
  location: '迷雾森林',
  attribute: '藤蔓',
  weakness: '怕火',
};
const ice: IntelRecord = {
  name: '冰翼魔',
  location: '冰封山口',
  attribute: '寒冰',
  weakness: '怕热',
};

const vineElements = `location = record.find(class_="location")
attribute = record.find(class_="attribute")
weakness = record.find(class_="weakness")`;

export const levels: IntelLevel[] = [
  {
    id: 'canyon',
    title: '峡谷警报',
    brief: '炎角兽正在接近！读出它的弱点，准备防御。',
    seconds: 60,
    records: [flame],
    html: `<article class="record">
  <h2 class="name">炎角兽</h2>
  <p><span class="location">北方峡谷</span></p>
  <p><span class="attribute">火焰</span></p>
  <p><span class="weakness">怕强光</span></p>
</article>`,
    questions: [
      {
        prompt: '要找弱点，应该根据哪个 class？',
        options: [
          {
            label: 'location',
            feedback: 'location 标记的是出没地点。再看看弱点所在的 span。',
          },
          { label: 'weakness', feedback: 'weakness 正是弱点元素的 class。' },
          {
            label: 'attribute',
            feedback: 'attribute 标记的是属性，弱点有另一个 class。',
          },
        ],
        correct: 1,
        success: '锁定 weakness！接下来找到带这个属性的元素。',
        code: '# 根据 class="weakness" 寻找弱点',
        highlight: ['class="weakness"'],
      },
      {
        prompt: '怎样在当前 record 中找到弱点元素？',
        options: [
          {
            label: '按 class 寻找',
            code: 'record.find(class_="weakness")',
            feedback: '这会找到当前恶魔的弱点元素。',
          },
          {
            label: '按标签名寻找',
            code: 'record.find("weakness")',
            feedback:
              '这里会查找 <weakness> 标签；HTML 中实际使用的是 span 标签。',
          },
          {
            label: '找到任意 span',
            code: 'record.find("span")',
            feedback:
              '这会拿到第一个 span，也就是地点；需要用 class 定位弱点。',
          },
        ],
        correct: 0,
        success: '弱点元素已找到！最后把标签里的文字取出来。',
        code: 'element = record.find(class_="weakness")',
        highlight: ['<span class="weakness">怕强光</span>'],
      },
      {
        prompt: '怎样只取出元素里的文字？',
        options: [
          {
            label: '读取 class 属性',
            code: 'element.get("class")',
            feedback: '这得到的是 class 属性值，目标是标签里的文字。',
          },
          {
            label: '打印整个元素',
            code: 'print(element)',
            feedback: '直接打印会保留 span 标签。请选能获取文本的方法。',
          },
          {
            label: '获取文本',
            code: 'element.get_text(strip=True)',
            feedback: '这会得到文字“怕强光”。',
          },
        ],
        correct: 2,
        success: '提取成功：怕强光。城堡准备探照灯！',
        code: 'element = record.find(class_="weakness")\nprint(element.get_text(strip=True))',
        highlight: ['怕强光'],
      },
    ],
    defense: '探照灯照向北方峡谷，炎角兽被拦在防线外。',
  },
  {
    id: 'forest',
    title: '森林来袭',
    brief: '藤甲魔出现！这次要读出地点、属性和弱点。',
    seconds: 50,
    records: [vine],
    html: `<article class="record">
  <h2 class="name">藤甲魔</h2>
  <p><span class="location">迷雾森林</span></p>
  <p><span class="attribute">藤蔓</span></p>
  <p><span class="weakness">怕火</span></p>
</article>`,
    questions: [
      {
        prompt: '地点、属性、弱点分别对应哪组 class？',
        options: [
          {
            label: 'name → attribute → weakness',
            feedback: 'name 对应恶魔名字；第一个字段要找出没地点。',
          },
          {
            label: 'location → weakness → attribute',
            feedback: '后两个顺序颠倒了。先找属性，再找弱点。',
          },
          {
            label: 'location → attribute → weakness',
            feedback: '三个 class 分别对应这次需要的三个字段。',
          },
        ],
        correct: 2,
        success: '字段已分清！三个 class 各自对应一种情报。',
        code: '# 地点：location\n# 属性：attribute\n# 弱点：weakness',
        highlight: [
          'class="location"',
          'class="attribute"',
          'class="weakness"',
        ],
      },
      {
        prompt: '要找齐三个元素，应该怎样做？',
        options: [
          {
            label: '对三个字段都用 find("span")',
            feedback: '三次都会找到第一个 span，拿到的都会是地点。',
          },
          {
            label: '在 record 中，按各自 class 分别 find',
            feedback: '这样能准确找到地点、属性和弱点三个元素。',
          },
          {
            label: '只找 class 为 name 的元素',
            feedback: '这只能拿到名字，三个目标字段还没有找到。',
          },
        ],
        correct: 1,
        success: '三个元素已经找到。最后分别取出它们的文本。',
        code: vineElements,
        highlight: [
          '<span class="location">迷雾森林</span>',
          '<span class="attribute">藤蔓</span>',
          '<span class="weakness">怕火</span>',
        ],
      },
      {
        prompt: '怎样输出三个字段的文字？',
        options: [
          {
            label: '三个字段分别获取文本，例如：',
            code: 'location.get_text(strip=True)',
            feedback: '这会按顺序输出三个字段的文本。',
          },
          {
            label: '直接打印三个元素',
            code: 'print(location, attribute, weakness)',
            feedback: '这会连同标签一起打印；还需要取出文本。',
          },
          {
            label: '三个元素分别读取 class，例如：',
            code: 'location.get("class")',
            feedback: '这输出的是属性名称；我们要的是地点、属性和弱点的内容。',
          },
        ],
        correct: 0,
        success: '迷雾森林 · 藤蔓 · 怕火。勇士携带火把前往森林！',
        code: `${vineElements}\nprint(location.get_text(strip=True),\n      attribute.get_text(strip=True),\n      weakness.get_text(strip=True))`,
        highlight: ['迷雾森林', '藤蔓', '怕火'],
      },
    ],
    defense: '火把防线点亮迷雾森林，藤甲魔停下了脚步。',
  },
  {
    id: 'two-fronts',
    title: '双线告急',
    brief: '两座前哨同时来报！逐条解析，别把情报配错。',
    seconds: 45,
    records: [flame, ice],
    html: `<article class="record">
  <h2 class="name">炎角兽</h2>
  <p><span class="weakness">怕强光</span></p>
  <p><span class="attribute">火焰</span></p>
  <p><span class="location">北方峡谷</span></p>
</article>
<article class="record">
  <h2 class="name">冰翼魔</h2>
  <p><span class="attribute">寒冰</span></p>
  <p><span class="location">冰封山口</span></p>
  <p><span class="weakness">怕热</span></p>
</article>`,
    questions: [
      {
        prompt: '哪一个 class 把每个恶魔的情报包在一起？',
        options: [
          {
            label: 'record',
            feedback: '每个 article.record 都是一条独立的恶魔记录。',
          },
          {
            label: 'name',
            feedback: 'name 只标记名字，无法包含地点、属性和弱点。',
          },
          {
            label: 'weakness',
            feedback: 'weakness 只标记一个弱点元素，并不是整条记录。',
          },
        ],
        correct: 0,
        success: '以 record 为单位，名字和其他字段就能保持对应。',
        code: '# 每个 class="record" 对应一个恶魔',
        highlight: ['class="record"'],
      },
      {
        prompt: '怎样一次找到两条恶魔记录？',
        options: [
          {
            label: '只找一条记录',
            code: 'soup.find(class_="record")',
            feedback: 'find 只返回第一条，会漏掉冰翼魔。',
          },
          {
            label: '找出所有 span',
            code: 'soup.find_all("span")',
            feedback: '这会把各字段混在同一列表里，失去整条记录的分组。',
          },
          {
            label: '找出所有记录',
            code: 'soup.find_all(class_="record")',
            feedback: 'find_all 返回两条完整记录，可以逐条处理。',
          },
        ],
        correct: 2,
        success: '两条记录已收齐！接下来让循环逐条读取。',
        code: 'records = soup.find_all(class_="record")',
        highlight: ['class="record"'],
      },
      {
        prompt: '循环读取时，怎样确保每条情报不串配？',
        options: [
          {
            label: '始终在 soup 内找字段、取文本',
            feedback:
              '从整个 soup 查找会反复拿到第一条记录。要在当前 record 内查找。',
          },
          {
            label: '逐条在 record 内找字段、取文本',
            feedback: '每次循环只处理一个恶魔，字段顺序改变也不会配错。',
          },
          {
            label: '按固定位置读取第一个 span',
            feedback: '这里的元素顺序已经改变。要根据 class，而不是固定位置。',
          },
        ],
        correct: 1,
        success: '两条情报配对正确！峡谷启用探照灯，山口部署热浪屏障。',
        code: `records = soup.find_all(class_="record")
for record in records:
    name = record.find(class_="name")
    location = record.find(class_="location")
    attribute = record.find(class_="attribute")
    weakness = record.find(class_="weakness")
    print(name.get_text(strip=True),
          location.get_text(strip=True),
          attribute.get_text(strip=True),
          weakness.get_text(strip=True))`,
        highlight: [
          'class="name"',
          'class="location"',
          'class="attribute"',
          'class="weakness"',
        ],
      },
    ],
    defense: '探照灯守住北方峡谷，热浪屏障挡住冰翼魔。两条防线布防完成！',
  },
];
