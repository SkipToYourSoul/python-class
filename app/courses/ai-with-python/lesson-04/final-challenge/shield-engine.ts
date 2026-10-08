/** New watchtower observations for the challenge, independent of the classroom CSV. */
export const DEMONS = [
  { id: 'ember', name: '烬牙魔', sprite: 0 },
  { id: 'prism', name: '镜羽魔', sprite: 1 },
  { id: 'moss', name: '苔角魔', sprite: 2 },
  { id: 'tide', name: '潮鳍魔', sprite: 3 },
] as const;

export type DemonId = (typeof DEMONS)[number]['id'];

export type BattleCase = {
  id: string;
  title: string;
  records: { id: string; demons: DemonId[]; threat: number }[];
  host: DemonId;
  candidates: DemonId[];
  outlier: DemonId;
  commands: {
    orders: { actor: DemonId; text: string; destinations: [string, string] }[];
    responses: { actor: DemonId; text: string; destination: string }[];
  };
};

export const CASE_COUNT = 16;

const offsets: Record<number, number[]> = {
  4: [-6, -2, 2, 6],
  5: [-8, -4, 0, 4, 8],
  6: [-8, -5, -2, 2, 5, 8],
  7: [-9, -6, -3, 0, 3, 6, 9],
  8: [-8, -6, -4, -2, 2, 4, 6, 8],
};

/** Each row is one observed demon reading, not a count of attack events. */
export function makeCase(index: number): BattleCase {
  const normalized = Number.isFinite(index) ? Math.trunc(index) : 0;
  const seed = ((normalized % CASE_COUNT) + CASE_COUNT) % CASE_COUNT;
  const rotation = seed % DEMONS.length;
  const variant = Math.floor(seed / DEMONS.length);
  const demonAt = (offset: number): DemonId =>
    DEMONS[(rotation + offset) % DEMONS.length].id;
  const outlier = demonAt(0);
  const roles = [
    [1, 2, 3],
    [2, 3, 1],
    [3, 1, 2],
    [1, 2, 3],
  ][variant];
  const high = demonAt(roles[0]);
  const close = demonAt(roles[1]);
  const background = demonAt(roles[2]);
  const host = variant % 2 === 0 ? high : close;
  const samples = new Map<DemonId, number[]>([
    [outlier, [95 + variant]],
    [high, offsets[4 + (variant % 2)].map((offset) => 76 + variant + offset)],
    [close, offsets[8 - (variant % 2)].map((offset) => 74 + variant + offset)],
    [background, offsets[4 + variant].map((offset) => 49 + variant + offset)],
  ]);
  const records: BattleCase['records'] = [];
  // Interleave the readings so the source is an observation log, not a ranking.
  for (let sample = 0; sample < 8; sample += 1) {
    for (const demon of DEMONS) {
      const threat = samples.get(demon.id)?.[sample];
      if (threat !== undefined) {
        records.push({
          id: `W${String(records.length + 1).padStart(2, '0')}`,
          demons: [demon.id],
          threat,
        });
      }
    }
  }
  const places: [string, string][] = [
    ['北门', '钟楼'],
    ['石桥', '南塔'],
    ['东门', '城墙'],
    ['西塔', '山道'],
  ];
  const destinations = places[variant];
  const decoy = host === high ? close : high;
  const orderFor = (actor: DemonId, targets: [string, string]) => ({
    actor,
    destinations: targets,
    text: `东队，前往${targets[0]}！西队，守住${targets[1]}！`,
  });
  const realOrder = orderFor(host, destinations);
  const falseOrder = orderFor(decoy, places[(variant + 1) % places.length]);
  return {
    id: `watchtower-${String(seed + 1).padStart(2, '0')}`,
    title: '哨塔最新观测',
    records,
    host,
    candidates: DEMONS.filter(
      (demon) => demon.id === high || demon.id === close,
    ).map((demon) => demon.id),
    outlier,
    commands: {
      // Speaking first or last must not reveal which order was followed.
      orders: variant < 2 ? [realOrder, falseOrder] : [falseOrder, realOrder],
      responses: [
        {
          actor: outlier,
          destination: destinations[0],
          text: `东队已到${destinations[0]}！`,
        },
        {
          actor: background,
          destination: destinations[1],
          text: `西队已经守住${destinations[1]}！`,
        },
      ],
    },
  };
}

/** Fixed portrait order: numeric position must not reveal the answer. */
export function deriveRows(battle: BattleCase): {
  id: DemonId;
  name: string;
  mean: number;
  count: number;
}[] {
  return DEMONS.map((demon) => {
    const readings = battle.records.filter((record) =>
      record.demons.includes(demon.id),
    );
    return {
      id: demon.id,
      name: demon.name,
      mean: readings.length
        ? readings.reduce((total, record) => total + record.threat, 0) /
          readings.length
        : 0,
      count: readings.length,
    };
  });
}

export function selectionResult(
  battle: BattleCase,
  ids: readonly DemonId[],
): { ok: boolean; message: string } {
  const unique = new Set(ids);
  if (unique.size !== 2 || unique.size !== ids.length) {
    return {
      ok: false,
      message: '保留两名重点对象。平均值很接近时，先别急着只认定一名。',
    };
  }
  if (unique.has(battle.outlier)) {
    return {
      ok: false,
      message:
        '最高读数只有一次，依据还不够稳定。先调查记录较多、均值较高的两名；这不代表它已被证明清白。',
    };
  }
  if (!battle.candidates.every((id) => unique.has(id))) {
    return {
      ok: false,
      message: '再比较一次：先保留次数足够、平均威胁值最高的两名。',
    };
  }
  return {
    ok: true,
    message:
      '锁定两名重点对象！均值接近，都值得调查；谁在指挥，还要看新的证据。',
  };
}

export function finalResult(
  battle: BattleCase,
  id: DemonId,
  evidenceSeen: boolean,
): { ok: boolean; message: string } {
  if (!evidenceSeen) {
    return {
      ok: false,
      message: '还缺指挥证据。先看完口令与两队响应，再发动最后一击。',
    };
  }
  if (id !== battle.host) {
    return {
      ok: false,
      message: '恶魔在窃喜！有人虚张声势，再看看两队实际去了哪里。',
    };
  }
  return {
    ok: true,
    message: '两队实际行动，都符合它的口令！指挥证据吻合，准备破盾！',
  };
}
