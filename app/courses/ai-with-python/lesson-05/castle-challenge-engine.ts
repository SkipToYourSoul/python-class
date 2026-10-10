import { demonHistograms, demonKinds, demons, patrol } from './study-data';

export type ChallengeTool = 'histogram' | 'bar' | 'line' | 'scatter';
export type ChallengeRound = 0 | 1 | 2 | 3 | 4;
export type ChallengePhase =
  | 'tool'
  | 'choice'
  | 'feedback'
  | 'escape'
  | 'victory';
export type ClueId = 'scan' | 'decoy' | 'patrol' | 'identity';
export type ChallengeClue = {
  id: ClueId;
  title: string;
  text: string;
  value: string;
};
export type ChallengeResult = {
  success: boolean;
  title: string;
  text: string;
};
export type ChallengeState = {
  started: boolean;
  round: ChallengeRound;
  phase: ChallengePhase;
  tool: ChallengeTool | null;
  choice: string | null;
  alarms: number;
  clues: ChallengeClue[];
  reinforced: boolean;
  result: ChallengeResult | null;
};
export type ChallengeAction =
  | { type: 'start' | 'reset' | 'retry' | 'next' | 'reinforce' | 'execute' }
  | { type: 'tool'; tool: ChallengeTool }
  | { type: 'choose'; choice: string };

export const challengeTools: {
  id: ChallengeTool;
  name: string;
  description: string;
}[] = [
  { id: 'histogram', name: '直方图', description: '看数值区间里的个体数' },
  { id: 'bar', name: '条形图', description: '比较不同种类的平均值' },
  { id: 'line', name: '折线图', description: '沿时间看速度如何变化' },
  { id: 'scatter', name: '散点图', description: '对照两个特征和类别颜色' },
];

export const speedBins = demonHistograms.speed.map((bin, index) => ({
  ...bin,
  id: `speed-${index}`,
  label: `约 ${bin.low.toFixed(1)}–${bin.high.toFixed(1)} m/s`,
}));

// Interior bins are [low, high); only the last bin includes its upper bound.
export function speedBinFor(value: number): (typeof speedBins)[number] | null {
  return (
    speedBins.find(
      (bin, index) =>
        value >= bin.low &&
        (value < bin.high ||
          (index === speedBins.length - 1 && value === bin.high)),
    ) ?? null
  );
}

export const kindSpeeds = demonKinds.map((kind) => {
  const members = demons.filter((demon) => demon.kind === kind);
  return {
    id: kind,
    kind,
    count: members.length,
    speed:
      members.reduce((total, demon) => total + demon.speed, 0) / members.length,
  };
});

export const patrolPoints = patrol.map((point) => ({
  ...point,
  id: `hour-${point.hour}`,
  label: `${point.hour}:00`,
}));
export const targetDemon = { ...demons.find((demon) => demon.id === 'D004')! };

const busiestBin = speedBins.reduce((a, b) => (a.count >= b.count ? a : b));
const fastestKind = kindSpeeds.reduce((a, b) => (a.speed >= b.speed ? a : b));
const slowestKind = kindSpeeds.reduce((a, b) => (a.speed <= b.speed ? a : b));
const slowestPatrol = patrolPoints.reduce((a, b) =>
  a.speed <= b.speed ? a : b,
);
const fastestPatrol = patrolPoints.reduce((a, b) =>
  a.speed >= b.speed ? a : b,
);
const busiestIndex = speedBins.indexOf(busiestBin);

export const challengeRounds: {
  id: string;
  title: string;
  prompt: string;
  tool: ChallengeTool;
  options: { id: string; label: string }[];
}[] = [
  {
    id: 'scan',
    title: '外墙扫描',
    prompt: '扫描哪个速度区间，能找到数量最多的守卫？',
    tool: 'histogram',
    options: speedBins
      .filter((_, index) => Math.abs(index - busiestIndex) <= 1)
      .map(({ id, label }) => ({ id, label })),
  },
  {
    id: 'decoy',
    title: '庭院调虎离山',
    prompt: '比较三族的平均速度，优先引开平均最快的追兵。',
    tool: 'bar',
    options: kindSpeeds.map(({ id, kind }) => ({ id, label: `引开${kind}` })),
  },
  {
    id: 'patrol',
    title: '穿越巡逻走廊',
    prompt: '回放 D001 的六次巡逻，选择速度最低的观测时刻行动。',
    tool: 'line',
    options: patrolPoints
      .filter(
        (point) =>
          point === patrolPoints[0] ||
          point === slowestPatrol ||
          point === fastestPatrol,
      )
      .map(({ id, label }) => ({ id, label })),
  },
  {
    id: 'identity',
    title: '识破伪装守卫',
    prompt: 'D004 又高又快。找出候选种类，再核查守卫档案。',
    tool: 'scatter',
    options: demonKinds.map((kind) => ({
      id: kind,
      label: `按${kind}候选核查档案`,
    })),
  },
];

const earnedClues: ChallengeClue[] = [
  {
    id: 'scan',
    title: '扫描档位',
    text: `${busiestBin.label} 区间有 ${busiestBin.count} 只，个体数最多。`,
    value: busiestBin.id,
  },
  {
    id: 'decoy',
    title: '引开追兵',
    text: `${fastestKind.kind}平均速度 ${fastestKind.speed.toFixed(2)} m/s，三族中最高；已引开这队追兵。`,
    value: fastestKind.id,
  },
  {
    id: 'patrol',
    title: '巡逻时刻',
    text: `D001 在 ${slowestPatrol.label} 的速度为 ${slowestPatrol.speed} m/s，是六次观测中的最低值。`,
    value: slowestPatrol.id,
  },
  {
    id: 'identity',
    title: '守卫档案',
    text: `核查档案确认：${targetDemon.id} 属于${targetDemon.kind}。身高 ${targetDemon.height} cm、速度 ${targetDemon.speed} m/s、体重 ${targetDemon.mass} kg；整体特点也有例外。`,
    value: targetDemon.kind,
  },
];

export type EscapeRule = {
  clue: ClueId;
  label: string;
  value: string;
  text: string;
};
export type EscapeRoute = {
  id: string;
  title: string;
  description: string;
  rules: EscapeRule[];
};

function routeRules(
  decoy: string,
  hour: (typeof patrolPoints)[number],
): EscapeRule[] {
  return [
    {
      clue: 'scan',
      label: '扫描档位',
      value: busiestBin.id,
      text: busiestBin.label,
    },
    { clue: 'decoy', label: '引开追兵', value: decoy, text: decoy },
    { clue: 'patrol', label: '巡逻时刻', value: hour.id, text: hour.label },
    {
      clue: 'identity',
      label: '守卫档案',
      value: targetDemon.kind,
      text: targetDemon.kind,
    },
  ];
}

export const escapeRoutes: EscapeRoute[] = [
  {
    id: 'west',
    title: '西侧货门',
    description: '门牌的四项通行密码，都要与侦察记录一致。',
    rules: routeRules(slowestKind.id, slowestPatrol),
  },
  {
    id: 'east',
    title: '东侧暗门',
    description: '门牌的四项通行密码，都要与侦察记录一致。',
    rules: routeRules(fastestKind.id, slowestPatrol),
  },
  {
    id: 'north',
    title: '北侧回廊',
    description: '门牌的四项通行密码，都要与侦察记录一致。',
    rules: routeRules(fastestKind.id, fastestPatrol),
  },
];

export function escapeRuleMatches(
  route: EscapeRoute,
  clues: ChallengeClue[],
): boolean {
  return route.rules.every((rule) =>
    clues.some((clue) => clue.id === rule.clue && clue.value === rule.value),
  );
}

export function createInitialChallengeState(): ChallengeState {
  return {
    started: false,
    round: 0,
    phase: 'tool',
    tool: null,
    choice: null,
    alarms: 0,
    clues: [],
    reinforced: false,
    result: null,
  };
}

const toolHints: Record<ChallengeTool, string> = {
  histogram: '找的是数值区间里的个体数：横轴看区间，柱高看数量。',
  bar: '比较的是种类的平均速度：每根柱子对应一个种类。',
  line: '找的是随时间变化的速度：沿观测时刻寻找最低点。',
  scatter: '要交叉观察两个特征：每个点对应一个体，颜色对应已知种类。',
};

function alarm(
  state: ChallengeState,
  title: string,
  text: string,
): ChallengeState {
  return {
    ...state,
    phase: 'feedback',
    alarms: state.alarms + 1,
    result: { success: false, title, text },
  };
}

export function challengeReducer(
  state: ChallengeState,
  action: ChallengeAction,
): ChallengeState {
  if (action.type === 'reset') return createInitialChallengeState();
  if (action.type === 'start')
    return state.started
      ? state
      : { ...createInitialChallengeState(), started: true };
  if (!state.started || state.phase === 'victory') return state;

  const round = challengeRounds[state.round];
  switch (action.type) {
    case 'tool': {
      if (
        state.phase !== 'tool' ||
        !round ||
        !challengeTools.some((tool) => tool.id === action.tool)
      )
        return state;
      const selected = { ...state, tool: action.tool, result: null };
      return action.tool === round.tool
        ? { ...selected, phase: 'choice' }
        : alarm(selected, '工具需要调整', toolHints[round.tool]);
    }
    case 'choose': {
      const options = state.phase === 'escape' ? escapeRoutes : round?.options;
      if (
        (state.phase !== 'choice' && state.phase !== 'escape') ||
        !options?.some((option) => option.id === action.choice)
      )
        return state;
      return { ...state, choice: action.choice, result: null };
    }
    case 'reinforce':
      if (
        state.round !== 3 ||
        state.phase !== 'choice' ||
        state.tool !== 'scatter'
      )
        return state;
      return { ...state, reinforced: true, result: null };
    case 'execute': {
      if (!state.choice) return state;
      if (state.phase === 'escape') {
        const route = escapeRoutes.find(
          (candidate) => candidate.id === state.choice,
        );
        if (!route) return state;
        if (!escapeRuleMatches(route, state.clues)) {
          const mismatch = route.rules.find(
            (rule) =>
              !state.clues.some(
                (clue) => clue.id === rule.clue && clue.value === rule.value,
              ),
          )!;
          return alarm(
            state,
            '出口机关没有打开',
            `这道门的“${mismatch.label}”要求 ${mismatch.text}，与已收集记录不一致。保留情报，重新核对门牌。`,
          );
        }
        return {
          ...state,
          phase: 'victory',
          result: {
            success: true,
            title: '侦察成功，全班通关！',
            text: '四条证据与东侧暗门的通行密码全部吻合。勇士带着图鉴安全撤离，为最终决战做好准备！',
          },
        };
      }
      if (state.phase !== 'choice' || !round || state.tool !== round.tool)
        return state;
      if (!round.options.some((option) => option.id === state.choice))
        return state;
      if (state.round === 3 && !state.reinforced) {
        return {
          ...state,
          result: {
            success: false,
            title: '线索还不够',
            text: '再看体重，核对另一组特征，再按候选种族核查 D004 档案。',
          },
        };
      }
      const clue = earnedClues[state.round];
      if (state.round < 3 && state.choice !== clue.value) {
        const feedback = [
          '扫描范围还可以调整。找柱子最高的区间；柱高表示个体数，横轴位置表示速度。',
          '优先引开平均速度最高的一族。比较三根柱子的高度，平均值不代表每一个体。',
          '再沿时间核对六个观测点。找速度最低的一次，不把移动速度当作警觉程度。',
        ];
        return alarm(state, '行动需要修正', feedback[state.round]);
      }
      return {
        ...state,
        phase: 'feedback',
        clues: state.clues.some((item) => item.id === clue.id)
          ? state.clues
          : [...state.clues, { ...clue }],
        result: {
          success: true,
          title: [
            '扫描完成，迷雾退去',
            '诱饵奏效，通道打开',
            '通过巡逻走廊',
            '候选已核实，档案到手',
          ][state.round],
          text:
            state.round === 3
              ? `先前候选是${state.choice}；核查档案确认 ${targetDemon.id} 属于${targetDemon.kind}。点群重叠，不能单靠图表确定身份；整体特点也有例外。`
              : clue.text,
        },
      };
    }
    case 'retry':
      if (state.phase !== 'feedback' || state.result?.success !== false)
        return state;
      if (state.round === 4) return { ...state, phase: 'escape', result: null };
      return state.tool === round.tool
        ? { ...state, phase: 'choice', result: null }
        : { ...state, phase: 'tool', tool: null, choice: null, result: null };
    case 'next':
      if (
        state.phase !== 'feedback' ||
        !state.result?.success ||
        state.round === 4
      )
        return state;
      return {
        ...state,
        round: (state.round + 1) as ChallengeRound,
        phase: state.round === 3 ? 'escape' : 'tool',
        tool: null,
        choice: null,
        result: null,
      };
    default:
      return state;
  }
}
