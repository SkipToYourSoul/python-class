export type Identity = '勇士' | '恶魔';

type TreeNode = {
  id: string;
  x: number;
  y: number;
  label: string;
  detail?: string;
  kind: 'question' | 'warrior' | 'demon';
};

type TreeEdge = {
  from: string;
  to: string;
  label: '是' | '否';
};

export type Visitor = {
  name: string;
  image: string;
  attack: number;
  defense: number;
  health: number;
  identity: Identity;
  path: string[];
};

export type Level = {
  number: string;
  title: string;
  subtitle: string;
  time: number;
  nodes: TreeNode[];
  edges: TreeEdge[];
  visitors: Visitor[];
};

export const levels: Level[] = [
  {
    number: '01',
    title: '雾桥初守',
    subtitle: '两次提问 · 先看防御，再看血量',
    time: 25,
    nodes: [
      {
        id: 'root',
        x: 50,
        y: 12,
        label: '防御力 ≥ 65？',
        detail: '根节点',
        kind: 'question',
      },
      {
        id: 'warriorA',
        x: 22,
        y: 76,
        label: '打开城门',
        detail: '勇士',
        kind: 'warrior',
      },
      {
        id: 'n2',
        x: 69,
        y: 47,
        label: '血量 ≤ 240？',
        detail: '决策节点',
        kind: 'question',
      },
      {
        id: 'demonA',
        x: 55,
        y: 82,
        label: '保持关闭',
        detail: '恶魔',
        kind: 'demon',
      },
      {
        id: 'warriorB',
        x: 86,
        y: 82,
        label: '打开城门',
        detail: '勇士',
        kind: 'warrior',
      },
    ],
    edges: [
      { from: 'root', to: 'warriorA', label: '是' },
      { from: 'root', to: 'n2', label: '否' },
      { from: 'n2', to: 'demonA', label: '是' },
      { from: 'n2', to: 'warriorB', label: '否' },
    ],
    visitors: [
      {
        name: '苍穹枪卫',
        image: 'final-visitor-sky-lancer.png',
        attack: 35,
        defense: 85,
        health: 420,
        identity: '勇士',
        path: ['root', 'warriorA'],
      },
      {
        name: '暮影术士',
        image: 'final-visitor-twilight-mage.png',
        attack: 90,
        defense: 25,
        health: 180,
        identity: '恶魔',
        path: ['root', 'n2', 'demonA'],
      },
      {
        name: '赤焰游侠',
        image: 'final-visitor-flame-ranger.png',
        attack: 80,
        defense: 40,
        health: 260,
        identity: '勇士',
        path: ['root', 'n2', 'warriorB'],
      },
    ],
  },
  {
    number: '02',
    title: '夜幕岔路',
    subtitle: '三次提问 · 分支开始变多',
    time: 20,
    nodes: [
      {
        id: 'root',
        x: 50,
        y: 8,
        label: '血量 ≤ 200？',
        detail: '根节点',
        kind: 'question',
      },
      {
        id: 'demonA',
        x: 17,
        y: 70,
        label: '保持关闭',
        detail: '恶魔',
        kind: 'demon',
      },
      {
        id: 'n2',
        x: 63,
        y: 33,
        label: '防御力 ≥ 65？',
        detail: '决策节点',
        kind: 'question',
      },
      {
        id: 'warriorA',
        x: 42,
        y: 72,
        label: '打开城门',
        detail: '勇士',
        kind: 'warrior',
      },
      {
        id: 'n3',
        x: 73,
        y: 55,
        label: '攻击力 ≥ 60？',
        detail: '决策节点',
        kind: 'question',
      },
      {
        id: 'warriorB',
        x: 59,
        y: 88,
        label: '打开城门',
        detail: '勇士',
        kind: 'warrior',
      },
      {
        id: 'demonB',
        x: 86,
        y: 88,
        label: '保持关闭',
        detail: '恶魔',
        kind: 'demon',
      },
    ],
    edges: [
      { from: 'root', to: 'demonA', label: '是' },
      { from: 'root', to: 'n2', label: '否' },
      { from: 'n2', to: 'warriorA', label: '是' },
      { from: 'n2', to: 'n3', label: '否' },
      { from: 'n3', to: 'warriorB', label: '是' },
      { from: 'n3', to: 'demonB', label: '否' },
    ],
    visitors: [
      {
        name: '毒藤潜行者',
        image: 'final-visitor-vine-stalker.png',
        attack: 55,
        defense: 35,
        health: 150,
        identity: '恶魔',
        path: ['root', 'demonA'],
      },
      {
        name: '岩甲战锤',
        image: 'final-visitor-stone-hammer.png',
        attack: 50,
        defense: 70,
        health: 350,
        identity: '勇士',
        path: ['root', 'n2', 'warriorA'],
      },
      {
        name: '月痕弓手',
        image: 'final-visitor-moon-archer.png',
        attack: 65,
        defense: 50,
        health: 310,
        identity: '勇士',
        path: ['root', 'n2', 'n3', 'warriorB'],
      },
    ],
  },
  {
    number: '03',
    title: '王城终局',
    subtitle: '四层判断 · 三个数值都要看',
    time: 15,
    nodes: [
      {
        id: 'root',
        x: 44,
        y: 8,
        label: '血量 ≤ 220？',
        detail: '根节点',
        kind: 'question',
      },
      {
        id: 'demonA',
        x: 15,
        y: 28,
        label: '保持关闭',
        detail: '恶魔',
        kind: 'demon',
      },
      {
        id: 'n2',
        x: 56,
        y: 28,
        label: '防御力 ≥ 75？',
        detail: '决策节点',
        kind: 'question',
      },
      {
        id: 'warriorA',
        x: 20,
        y: 48,
        label: '打开城门',
        detail: '勇士',
        kind: 'warrior',
      },
      {
        id: 'n3',
        x: 68,
        y: 48,
        label: '攻击力 ≥ 58？',
        detail: '决策节点',
        kind: 'question',
      },
      {
        id: 'demonC',
        x: 38,
        y: 68,
        label: '保持关闭',
        detail: '恶魔',
        kind: 'demon',
      },
      {
        id: 'n4',
        x: 80,
        y: 68,
        label: '血量 ≤ 250？',
        detail: '决策节点',
        kind: 'question',
      },
      {
        id: 'demonB',
        x: 55,
        y: 90,
        label: '保持关闭',
        detail: '恶魔',
        kind: 'demon',
      },
      {
        id: 'warriorB',
        x: 84,
        y: 90,
        label: '打开城门',
        detail: '勇士',
        kind: 'warrior',
      },
    ],
    edges: [
      { from: 'root', to: 'demonA', label: '是' },
      { from: 'root', to: 'n2', label: '否' },
      { from: 'n2', to: 'warriorA', label: '是' },
      { from: 'n2', to: 'n3', label: '否' },
      { from: 'n3', to: 'demonC', label: '否' },
      { from: 'n3', to: 'n4', label: '是' },
      { from: 'n4', to: 'demonB', label: '是' },
      { from: 'n4', to: 'warriorB', label: '否' },
    ],
    visitors: [
      {
        name: '骨面刺客',
        image: 'final-visitor-bone-rogue.png',
        attack: 75,
        defense: 30,
        health: 210,
        identity: '恶魔',
        path: ['root', 'demonA'],
      },
      {
        name: '霜羽盾卫',
        image: 'final-visitor-frost-sentinel.png',
        attack: 30,
        defense: 90,
        health: 380,
        identity: '勇士',
        path: ['root', 'n2', 'warriorA'],
      },
      {
        name: '虚空旅者',
        image: 'final-visitor-void-wanderer.png',
        attack: 60,
        defense: 45,
        health: 230,
        identity: '恶魔',
        path: ['root', 'n2', 'n3', 'n4', 'demonB'],
      },
    ],
  },
];

const characterPool = levels.flatMap((level) =>
  level.visitors.map(({ name, image }) => ({ name, image })),
);

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffled<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function evaluateStats(
  levelIndex: number,
  attack: number,
  defense: number,
  health: number,
) {
  if (levelIndex === 0) {
    if (defense >= 65)
      return { identity: '勇士' as Identity, path: ['root', 'warriorA'] };
    if (health <= 240)
      return { identity: '恶魔' as Identity, path: ['root', 'n2', 'demonA'] };
    return { identity: '勇士' as Identity, path: ['root', 'n2', 'warriorB'] };
  }

  if (levelIndex === 1) {
    if (health <= 200)
      return { identity: '恶魔' as Identity, path: ['root', 'demonA'] };
    if (defense >= 65)
      return { identity: '勇士' as Identity, path: ['root', 'n2', 'warriorA'] };
    if (attack >= 60)
      return {
        identity: '勇士' as Identity,
        path: ['root', 'n2', 'n3', 'warriorB'],
      };
    return {
      identity: '恶魔' as Identity,
      path: ['root', 'n2', 'n3', 'demonB'],
    };
  }

  if (health <= 220)
    return { identity: '恶魔' as Identity, path: ['root', 'demonA'] };
  if (defense >= 75)
    return { identity: '勇士' as Identity, path: ['root', 'n2', 'warriorA'] };
  if (attack < 58)
    return {
      identity: '恶魔' as Identity,
      path: ['root', 'n2', 'n3', 'demonC'],
    };
  if (health <= 250)
    return {
      identity: '恶魔' as Identity,
      path: ['root', 'n2', 'n3', 'n4', 'demonB'],
    };
  return {
    identity: '勇士' as Identity,
    path: ['root', 'n2', 'n3', 'n4', 'warriorB'],
  };
}

export function createRoundVisitors(levelIndex: number): Visitor[] {
  const identities = shuffled<Identity>([
    '勇士',
    '恶魔',
    Math.random() > 0.5 ? '勇士' : '恶魔',
  ]);
  const portraits = shuffled(characterPool).slice(0, 3);

  return identities.map((wantedIdentity, index) => {
    for (let attempt = 0; attempt < 300; attempt += 1) {
      const attack = randomInt(25, 95);
      const defense = randomInt(20, 95);
      const health = randomInt(150, 480);
      const result = evaluateStats(levelIndex, attack, defense, health);
      if (result.identity === wantedIdentity) {
        return { ...portraits[index], attack, defense, health, ...result };
      }
    }

    const fallback =
      levels[levelIndex].visitors.find(
        ({ identity }) => identity === wantedIdentity,
      ) ?? levels[levelIndex].visitors[0];
    return { ...fallback, ...portraits[index] };
  });
}
