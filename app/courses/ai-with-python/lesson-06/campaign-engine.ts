import {
  ATTACK_THRESHOLD,
  TOWER_NAMES,
  battleReadings,
  history,
  plans,
  teamForTower,
} from './study-data';

export type TowerReceipt = {
  hour: string;
  equipment: string;
  energy: string;
  defense: string;
};
export type CampaignState = {
  phase: 'command' | 'feedback' | 'ready' | 'attacking' | 'cleared';
  completed: string[];
  receipts: Record<string, TowerReceipt>;
  tower: string;
  hour: string;
  equipment: string;
  energy: string;
  defense: string;
  attempts: number;
  message: string;
  paused: boolean;
};
export const initialCampaign: CampaignState = {
  phase: 'command',
  completed: [],
  receipts: {},
  tower: TOWER_NAMES[0],
  hour: '',
  equipment: '',
  energy: '',
  defense: '',
  attempts: 0,
  message: '',
  paused: false,
};

export function canFaceBoss(state: Pick<CampaignState, 'completed'>) {
  return TOWER_NAMES.every((tower) => state.completed.includes(tower));
}

export function assessTowerDecision(state: CampaignState) {
  const observed = history.find(
    (row) => row.tower === state.tower && row.hour === Number(state.hour),
  );
  const plan = plans.find((row) => row.tower === state.tower);
  const current = battleReadings.find((row) => row.tower === state.tower);
  const team = teamForTower(state.tower);
  if (!observed || !plan || !current || !team) {
    return {
      success: false,
      message: '先选择目标和计划时刻，再查看对应的图中证据。',
    };
  }
  if (observed.energy >= ATTACK_THRESHOLD) {
    return {
      success: false,
      message: `${state.hour} 时外罩 ${observed.energy} ≥ ${ATTACK_THRESHOLD}，不能破罩。先找虚线下方的候选点。`,
    };
  }
  if (observed.hour !== plan.hour) {
    return {
      success: false,
      message: `两次外罩都低于 ${ATTACK_THRESHOLD}；${state.hour} 时防御 ${observed.defense}，${plan.hour} 时只有 ${plan.defense}。再比较候选表。`,
    };
  }
  if (state.equipment !== team.equipment) {
    return {
      success: false,
      message: `时机选对了！${state.tower}守卫弱点是${current.weakness}，请据此选择装备。`,
    };
  }
  if (
    !state.energy.trim() ||
    !state.defense.trim() ||
    Number(state.energy) !== current.energy ||
    Number(state.defense) !== current.defense
  ) {
    return {
      success: false,
      message: `历史图表用于选计划，出击要核对新读数：${current.hour} 时外罩 ${current.energy}、防御 ${current.defense}。`,
    };
  }
  if (current.energy >= ATTACK_THRESHOLD) {
    return {
      success: false,
      message: `计划虽合适，阵前外罩 ${current.energy} ≥ ${ATTACK_THRESHOLD}，现在不能破罩。等待新情报再行动。`,
    };
  }
  return {
    success: true,
    message: `历史候选中 ${plan.hour} 时防御最低；装备${team.equipment}对应弱点。阵前外罩 ${current.energy} < ${ATTACK_THRESHOLD}、防御 ${current.defense}，可以出击！`,
  };
}

export function completeTower(state: CampaignState): CampaignState {
  if (state.phase !== 'attacking' || !assessTowerDecision(state).success)
    return state;
  const completed = TOWER_NAMES.filter(
    (tower) => state.completed.includes(tower) || tower === state.tower,
  );
  return {
    ...state,
    phase: 'cleared',
    completed,
    receipts: {
      ...state.receipts,
      [state.tower]: {
        hour: state.hour,
        equipment: state.equipment,
        energy: state.energy,
        defense: state.defense,
      },
    },
    paused: false,
    message: canFaceBoss({ completed })
      ? '三座魔塔全部击破！三队在魔王大门前会合。'
      : `${state.tower}击破！${state.hour} 时外罩 ${state.energy} < ${ATTACK_THRESHOLD}，${state.equipment}命中守卫弱点。证据已保留。`,
  };
}
