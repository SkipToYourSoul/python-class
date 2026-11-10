import { CURRENT_FETCH_CODE, CURRENT_ANALYZE_CODE } from './practice-content';

// The visible excerpt shares the exact statements used by the runnable reference.
const fetch = CURRENT_FETCH_CODE.split('\n');
const analysis = CURRENT_ANALYZE_CODE.split('\n');
export const BOSS_DEMO_CODE = [
  fetch[3],
  ...fetch.slice(6, 13),
  '',
  analysis[4],
  `${analysis[5]}  # 筛低外罩`,
  `${analysis[6]}  # 防御升序`,
  '# 散点图：横轴防御，纵轴外罩，颜色看弱点',
  ...analysis.slice(9, 13),
  analysis[16],
  analysis[23],
].join('\n');

export const BOSS_VIDEO = {
  src: '/courses/ai-with-python/lesson-06/assets/boss-finale-wan3.mp4',
  duration: 86.021333,
};
export const BOSS_MOMENTS = {
  request: 0,
  extract: 3,
  save: 8,
  read: 16,
  filter: 21,
  sort: 26,
  plot: 30,
  decide: 36,
  breakthrough: 46,
  gateOpen: 51,
  bossAppears: 56,
  bossAttack: 60,
  counterAttack: 66,
  weakPointStrike: 75,
  bossDefeated: 80,
  victory: 84,
} as const;
export const BOSS_DEMO_PHASES = [
  {
    from: BOSS_MOMENTS.request,
    text: '新的目标，需要重新获取魔王情报。',
    lines: [0],
  },
  {
    from: BOSS_MOMENTS.extract,
    text: '从网页里定位并提取整份护甲记录。',
    lines: [1, 2, 3, 4],
  },
  {
    from: BOSS_MOMENTS.save,
    text: '写入 boss.csv，后续分析读取同一份档案。',
    lines: [5, 6, 7],
  },
  {
    from: BOSS_MOMENTS.read,
    text: '读取 boss.csv，九处护甲进入同一张表。',
    lines: [9],
  },
  {
    from: BOSS_MOMENTS.filter,
    text: '筛选外罩低于 30 的部位，缩小候选范围。',
    lines: [10],
  },
  {
    from: BOSS_MOMENTS.sort,
    text: '在可破罩的部位中，按防御力从低到高排序。',
    lines: [11],
  },
  {
    from: BOSS_MOMENTS.plot,
    text: '散点图同时展示防御、外罩与弱点。',
    lines: [13, 14, 15, 16, 17, 18],
  },
  {
    from: BOSS_MOMENTS.decide,
    text: '胸甲防御最低，按弱点选择火焰装备。',
    lines: [],
  },
  {
    from: BOSS_MOMENTS.breakthrough,
    text: '火焰击中胸甲，能量护罩逐渐消散。',
    lines: [],
  },
  {
    from: BOSS_MOMENTS.gateOpen,
    text: '外层铠甲解除，城门打开，继续向前。',
    lines: [],
  },
  {
    from: BOSS_MOMENTS.bossAppears,
    text: '魔王现身，沿用胸甲与火焰的作战判断。',
    lines: [],
  },
  {
    from: BOSS_MOMENTS.bossAttack,
    text: '挡住正面强攻，寻找胸甲露出的空隙。',
    lines: [],
  },
  {
    from: BOSS_MOMENTS.counterAttack,
    text: '勇者反击，目标仍是防御最低的胸甲。',
    lines: [],
  },
  {
    from: BOSS_MOMENTS.weakPointStrike,
    text: '抓住空隙，用火焰击中胸口晶石。',
    lines: [],
  },
  {
    from: BOSS_MOMENTS.bossDefeated,
    text: '胸甲弱点被突破，魔王失去力量。',
    lines: [],
  },
  {
    from: BOSS_MOMENTS.victory,
    text: '魔王败退，数据支持了最后的作战决策。',
    lines: [],
  },
] as const;

export function bossDemoPhaseAt(time: number) {
  return BOSS_DEMO_PHASES.reduce(
    (current, phase) => (time >= phase.from ? phase : current),
    BOSS_DEMO_PHASES[0] as (typeof BOSS_DEMO_PHASES)[number],
  );
}
