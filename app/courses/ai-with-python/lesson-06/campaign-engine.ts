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
  phase: 'command' | 'feedback' | 'onsite' | 'ready' | 'attacking' | 'cleared';
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

export function towerOrderError(state: CampaignState) {
  const observed = history.find(
    (row) => row.tower === state.tower && row.hour === Number(state.hour),
  );
  const plan = plans.find((row) => row.tower === state.tower);
  const team = teamForTower(state.tower);
  if (!observed || !plan || !team) {
    return '先对照作战图，复述本队的出击时刻和装备。';
  }
  if (observed.energy >= ATTACK_THRESHOLD) {
    return `历史记录中，${state.hour} 时外罩 ${observed.energy} ≥ ${ATTACK_THRESHOLD}。先找虚线下方的候选点。`;
  }
  if (observed.hour !== plan.hour) {
    return `两次外罩都低于 ${ATTACK_THRESHOLD}。${state.hour} 时防御 ${observed.defense}，${plan.hour} 时只有 ${plan.defense}。再比较候选表。`;
  }
  if (state.equipment !== team.equipment) {
    return `时刻核对通过。${state.tower}守卫的弱点是${plan.weakness}，请核对装备。`;
  }
  return null;
}

export function assessTowerDecision(state: CampaignState) {
  const orderError = towerOrderError(state);
  if (orderError) return { success: false, message: orderError };

  const current = battleReadings.find((row) => row.tower === state.tower);
  if (!current) {
    return { success: false, message: '等待阵前观测回报。' };
  }
  if (current.energy >= ATTACK_THRESHOLD) {
    return {
      success: false,
      message: `阵前外罩 ${current.energy} ≥ ${ATTACK_THRESHOLD}，现在不能破罩。等待新情报再行动。`,
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
      message: `请用现场读数判断当前外罩是否低于 ${ATTACK_THRESHOLD}，再确认能否出击。`,
    };
  }
  return {
    success: true,
    message: `命令已核对。阵前外罩 ${current.energy} < ${ATTACK_THRESHOLD}，现在可以破罩，准许出击！`,
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
