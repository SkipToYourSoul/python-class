export type Phase =
  | 'ready'
  | 'answer'
  | 'correct'
  | 'timeout'
  | 'defense'
  | 'complete';
export type Answer = { attempts: number[]; solved: boolean };
export const WRONG_ANSWER_PENALTY_MS = 10000;
export type DefenseState = {
  wave: number;
  step: number;
  phase: Phase;
  remainingMs: number;
  selected: number;
  answers: Answer[];
  message: string;
};
export const initialDefense: DefenseState = {
  wave: 0,
  step: 0,
  phase: 'ready',
  remainingMs: 60000,
  selected: -1,
  answers: Array.from({ length: 9 }, () => ({ attempts: [], solved: false })),
  message: '',
};
export function judgeAnswer(
  state: DefenseState,
  correct: number,
): DefenseState {
  if (state.phase !== 'answer' || state.selected < 0 || state.remainingMs <= 0)
    return state;
  const index = state.wave * 3 + state.step;
  const good = state.selected === correct;
  const answers = state.answers.map((a, i) =>
    i === index
      ? { attempts: [...a.attempts, state.selected], solved: good }
      : a,
  );
  const remainingMs = good
    ? state.remainingMs
    : Math.max(0, state.remainingMs - WRONG_ANSWER_PENALTY_MS);
  return {
    ...state,
    answers,
    remainingMs,
    phase: good ? 'correct' : remainingMs === 0 ? 'timeout' : 'answer',
  };
}
export function remainingAt(deadline: number, now: number) {
  return Math.max(0, deadline - now);
}
export function firstTryCount(answers: Answer[]) {
  return answers.filter((a) => a.solved && a.attempts.length === 1).length;
}
