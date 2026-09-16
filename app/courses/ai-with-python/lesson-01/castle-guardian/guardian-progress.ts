export type PredictionRecord = {
  guess: string;
  model: string;
  truth: string;
};

export function getGuardianProgress(
  stage: number,
  records: PredictionRecord[],
  total: number,
) {
  const round = Array.from({ length: total }, (_, index) => records[index]);
  return {
    // Old saves on the removed report page now open the final prediction page.
    stage: Math.max(0, Math.min(stage, 5)),
    complete: total > 0 && round.every((record) => !!record),
    total,
    studentCorrect: round.filter(
      (record) => record && record.guess === record.truth,
    ).length,
    modelCorrect: round.filter(
      (record) => record && record.model === record.truth,
    ).length,
  };
}
