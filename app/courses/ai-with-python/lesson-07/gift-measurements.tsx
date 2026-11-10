'use client';

import { useLessonPageState } from '@/components/course/lesson-state';
import { features } from '@/public/courses/ai-with-python/lesson-07/practice/evidence.json';
import s from './gift-measurements.module.css';

export function useGiftReadings() {
  const [readings, updateReadings] = useLessonPageState<Record<number, string>>(
    'l7-measure-story',
    {
      0: '',
      1: '',
      2: '',
      3: '',
    },
  );
  const [revisions, updateRevisions] = useLessonPageState(
    'l7-gift-reading-revisions',
    {
      all: 0,
      petals: 0,
    },
  );

  function setReading(index: number, value: string) {
    const previous = readings[index];
    if (previous === value) return;
    updateReadings({ [index]: value });
    if (previous !== '' && value !== '' && Number(previous) === Number(value))
      return;
    updateRevisions(
      index < 2
        ? { all: revisions.all + 1 }
        : { all: revisions.all + 1, petals: revisions.petals + 1 },
    );
  }

  return { readings, setReading, revisions };
}

export function GiftMeasurements({ editable = false }: { editable?: boolean }) {
  const { readings, setReading } = useGiftReadings();

  return (
    <section
      className={editable ? s.editable : s.summary}
      aria-label="礼花实测卡"
    >
      <div className={s.caption}>
        {editable ? (
          <h3>02 自己量 · 礼花实测卡（厘米）</h3>
        ) : (
          <b>礼花实测卡（厘米）</b>
        )}
        <span>
          {editable
            ? '照着示范量公主送的花，填下四项读数，三次猜花都用这张卡。'
            : '沿用第 14 页的记录，按顺序填入练习。'}
        </span>
      </div>
      <ol className={s.readings}>
        {features.map((feature, index) => (
          <li key={feature}>
            {editable ? (
              <label>
                {feature}
                <input
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={readings[index]}
                  onChange={(event) => setReading(index, event.target.value)}
                />
              </label>
            ) : (
              <>
                <span>
                  {index + 1}. {feature}
                </span>
                <strong>{readings[index] || '待填写'}</strong>
              </>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
