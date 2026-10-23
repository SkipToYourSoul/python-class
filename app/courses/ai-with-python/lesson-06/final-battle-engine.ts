import { ATTACK_THRESHOLD, bossRecords, bossWindows } from './study-data';
import { canFaceBoss, type CampaignState } from './campaign-engine';

export type BattlePhase =
  | 'command'
  | 'feedback'
  | 'ready'
  | 'attacking'
  | 'victory';
export type BattleState = {
  phase: BattlePhase;
  part: string;
  equipment: string;
  energy: string;
  defense: string;
  attempts: number;
  message: string;
  paused: boolean;
};
export const initialBattle: BattleState = {
  phase: 'command',
  part: '',
  equipment: '',
  energy: '',
  defense: '',
  attempts: 0,
  message: '',
  paused: false,
};

export function assessDecision(
  state: BattleState,
  campaign: Pick<CampaignState, 'completed'>,
) {
  if (!canFaceBoss(campaign)) {
    return {
      success: false,
      message: '三座魔塔都击破后，三队才能会合挑战魔王。',
    };
  }
  const record = bossRecords.find((row) => row.part === state.part);
  if (!record || !state.equipment) {
    return {
      success: false,
      message: '先在散点图里找目标，再选择对应的装备。',
    };
  }
  if (
    !state.energy.trim() ||
    !state.defense.trim() ||
    Number(state.energy) !== record.energy ||
    Number(state.defense) !== record.defense
  ) {
    return {
      success: false,
      message: `${record.part}的证据需要再核对：外罩 ${record.energy}，防御 ${record.defense}。保留目标，修订读数再试。`,
    };
  }
  if (record.energy >= ATTACK_THRESHOLD) {
    return {
      success: false,
      message: `${record.part}的读数对应正确，但外罩 ${record.energy} 还没有低于 ${ATTACK_THRESHOLD}。先筛选能破罩的部位。`,
    };
  }
  if (record.part !== bossWindows[0].part) {
    return {
      success: false,
      message: `${record.part}可以破罩，防御是 ${record.defense}。再比较低于 ${ATTACK_THRESHOLD} 的所有部位，找防御最低的突破口！`,
    };
  }
  if (state.equipment !== record.weakness) {
    return {
      success: false,
      message: '突破口找对了！再看散点图的颜色图例，选择克制这个部位的装备。',
    };
  }
  return {
    success: true,
    message: `${record.part}：外罩 ${record.energy} < ${ATTACK_THRESHOLD}，可破罩的部位中防御最低（${record.defense}），弱点是${record.weakness}。三队准备完成！`,
  };
}

export function completeBattle(
  state: BattleState,
  campaign: Pick<CampaignState, 'completed'>,
): BattleState {
  if (state.phase !== 'attacking' || !assessDecision(state, campaign).success)
    return state;
  return { ...state, phase: 'victory', paused: false };
}
