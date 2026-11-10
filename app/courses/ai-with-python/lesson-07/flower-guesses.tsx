'use client';

import { useLessonPageState } from '@/components/course/lesson-state';
import { useGiftReadings } from './gift-measurements';
import s from './gift-measurements.module.css';

const guessPages = {
  first: { page: 'l7-practice-01', field: 'guess' },
  second: { page: 'l7-practice-02', field: 'treePracticePrediction' },
  third: { page: 'l7-practice-03', field: 'svmGuess' },
} as const;

type GuessField = (typeof guessPages)[keyof typeof guessPages]['field'];
type GuessState = Partial<Record<GuessField, string>> & {
  recordedReadings?: string;
};

export function useFlowerGuess(round: keyof typeof guessPages) {
  const { page, field } = guessPages[round];
  const [state, update] = useLessonPageState<GuessState>(page, {});
  const { readings, revisions } = useGiftReadings();
  const guess = state[field] ?? '';
  const revision = round === 'first' ? revisions.petals : revisions.all;
  const indices = round === 'first' ? [2, 3] : [0, 1, 2, 3];
  // Including the values also detects when the measurement page is reset.
  const signature = JSON.stringify([
    revision,
    ...indices.map((index) =>
      readings[index] === '' ? null : Number(readings[index]),
    ),
  ]);
  const needsReview =
    guess !== '' &&
    (state.recordedReadings === undefined
      ? revision !== 0
      : state.recordedReadings !== signature);

  return {
    guess,
    needsReview,
    recordGuess: (value: string) =>
      update({ [field]: value, recordedReadings: signature }),
  };
}

export function GuessReviewBadge() {
  return <span className={s.reviewBadge}>待复核</span>;
}

export function GuessReviewPrompt({
  onConfirm,
  disabled = false,
}: {
  onConfirm: () => void;
  disabled?: boolean;
}) {
  return (
    <div className={s.reviewPrompt}>
      <p>
        <GuessReviewBadge /> 请用新读数再判断一次。
      </p>
      <button type="button" onClick={onConfirm} disabled={disabled}>
        确认并重新记录
      </button>
    </div>
  );
}
