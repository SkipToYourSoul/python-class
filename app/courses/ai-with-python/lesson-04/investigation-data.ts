import attackRecords from '@/public/courses/ai-with-python/lesson-04/practice/attack-records.json';

export type AttackRecord = {
  id: string;
  place: string;
  demons: string[];
  threat: number;
  minutes: number;
};

export const records: AttackRecord[] = attackRecords;
export const smallRecords = records.slice(0, 6);
export const THREAT_RULE =
  '威胁值：哨塔魔力仪记录的每次进攻最高读数，统一为 0—100；数值越大，整场进攻的魔力越强。';
export const DATA_NOTE =
  '一行是一场进攻；同场读数属于整场进攻，不能当作某个恶魔的个人伤害。';

export const suspects = [
  { name: '炎角兽', description: '火红双角，常在峡谷现身', color: '#D45435' },
  { name: '藤甲魔', description: '藤蔓铠甲，身上挂着树叶', color: '#427947' },
  { name: '冰翼魔', description: '冰晶双翼，飞过时留下寒气', color: '#457FAD' },
  { name: '岩背魔', description: '石块背甲，脚步很重', color: '#86715D' },
  { name: '雾铃魔', description: '灰紫斗篷，手里拿着铃铛', color: '#7C86AE' },
  { name: '砂爪魔', description: '沙色利爪，动作敏捷', color: '#B98A3C' },
  { name: '镜翼魔', description: '光亮翅片，会反射月光', color: '#8B6CA7' },
  { name: '苔帽魔', description: '戴着苔帽，身上长着绿苔', color: '#728745' },
  { name: '墨鳍魔', description: '蓝色身体，长着鱼鳍', color: '#426F79' },
] as const;

export type SuspectRanking = { name: string; count: number; mean: number };

export function rankSuspects(minCount = 1): SuspectRanking[] {
  return suspects
    .map(({ name }) => {
      const related = records.filter((record) => record.demons.includes(name));
      return {
        name,
        count: related.length,
        mean:
          related.reduce((total, record) => total + record.threat, 0) /
          related.length,
      };
    })
    .filter((entry) => entry.count >= minCount)
    .sort((a, b) => b.mean - a.mean);
}
