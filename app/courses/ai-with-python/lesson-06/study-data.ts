/** Shared evidence for the slides, web station, practice pack and battles. */
export type TowerRecord = {
  tower: string;
  hour: number;
  energy: number;
  guard: string;
  kind: string;
  attribute: string;
  weakness: string;
  defense: number;
};

export const ATTACK_THRESHOLD = 30;
export const TOWER_NAMES = ['北塔', '东塔', '西塔'];
export const HOURS = Array.from({ length: 12 }, (_, index) => index + 6);
const guardKinds = ['炎角兽族', '藤甲魔族', '冰翼魔族'];
const attributes = ['火焰', '藤甲', '寒冰'];
const weaknesses = ['强光', '火焰', '热量'];
const energies = [
  [72, 66, 58, 44, 18, 25, 52, 61, 48, 34, 42, 56],
  [88, 82, 76, 69, 58, 64, 52, 36, 22, 27, 49, 70],
  [68, 74, 80, 71, 65, 59, 62, 54, 48, 38, 24, 19],
];
const defenses = [
  [78, 72, 68, 54, 42, 30, 63, 75, 66, 50, 60, 70],
  [90, 86, 82, 75, 68, 73, 62, 49, 34, 46, 65, 80],
  [65, 72, 78, 70, 60, 55, 58, 50, 44, 40, 38, 25],
];

/** Each row describes the on-duty guard and tower at one observed hour. */
export const history: TowerRecord[] = TOWER_NAMES.flatMap((tower, index) =>
  HOURS.map((hour, position) => ({
    tower,
    hour,
    energy: energies[index][position],
    guard: `G${String(index * HOURS.length + position + 1).padStart(3, '0')}`,
    kind: guardKinds[index],
    attribute: attributes[index],
    weakness: weaknesses[index],
    defense: defenses[index][position],
  })),
);

export const summary = TOWER_NAMES.map((tower) => {
  const records = history.filter((row) => row.tower === tower);
  const values = records.map((row) => row.energy);
  return {
    tower,
    kind: records[0].kind,
    attribute: records[0].attribute,
    weakness: records[0].weakness,
    mean: values.reduce((sum, value) => sum + value, 0) / records.length,
    meanDefense:
      records.reduce((sum, row) => sum + row.defense, 0) / records.length,
    count: records.length,
    min: Math.min(...values),
    max: Math.max(...values),
    minDefense: Math.min(...records.map((row) => row.defense)),
  };
});

/** Match Pandas sort_values(["tower", "defense"]), without locale collation. */
export const windows = history
  .filter((row) => row.energy < ATTACK_THRESHOLD)
  .sort((a, b) =>
    a.tower === b.tower ? a.defense - b.defense : a.tower < b.tower ? -1 : 1,
  );
export const plans = TOWER_NAMES.map((tower) =>
  windows.find((row) => row.tower === tower)!,
);

export const TEAMS = [
  { name: '曙光队', tower: '北塔', equipment: '强光' },
  { name: '烈焰队', tower: '东塔', equipment: '火焰' },
  { name: '暖阳队', tower: '西塔', equipment: '热量' },
];
export const teamForTower = (tower: string) =>
  TEAMS.find((team) => team.tower === tower);

/** Fresh on-site observations confirm all three planned attacks. */
export const battleReadings: TowerRecord[] = plans.map((plan, index) => ({
  ...plan,
  energy: [21, 24, 22][index],
  defense: [32, 35, 28][index],
}));
export const current = battleReadings;

export type BossRecord = {
  part: string;
  energy: number;
  defense: number;
  weakness: string;
};
export const bossRecords: BossRecord[] = [
  { part: '头盔', energy: 72, defense: 85, weakness: '强光' },
  { part: '左肩', energy: 48, defense: 66, weakness: '热量' },
  { part: '右肩', energy: 36, defense: 74, weakness: '火焰' },
  { part: '胸甲', energy: 18, defense: 24, weakness: '火焰' },
  { part: '左臂', energy: 26, defense: 52, weakness: '强光' },
  { part: '右臂', energy: 44, defense: 60, weakness: '热量' },
  { part: '腰甲', energy: 22, defense: 40, weakness: '强光' },
  { part: '左腿', energy: 58, defense: 76, weakness: '火焰' },
  { part: '右腿', energy: 65, defense: 80, weakness: '热量' },
];
export const bossWindows = bossRecords
  .filter((row) => row.energy < ATTACK_THRESHOLD)
  .sort((a, b) => a.defense - b.defense);
