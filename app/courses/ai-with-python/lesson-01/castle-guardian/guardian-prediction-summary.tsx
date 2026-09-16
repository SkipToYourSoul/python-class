import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import lesson from '../lesson-review.module.css';
import s from './guardian-prediction-summary.module.css';

export function GuardianPredictionSummary({
  total,
  studentCorrect,
  modelCorrect,
}: {
  total: number;
  studentCorrect: number;
  modelCorrect: number;
}) {
  return (
    <section className={s.summary} aria-label="本轮预测统计">
      <div className={s.finished}>
        <CheckCircle2 aria-hidden="true" />
        <strong>{total} 次预测已完成</strong>
      </div>
      <div className={s.score}>
        <span>学生预判正确</span>
        <strong>
          {studentCorrect} / {total}
        </strong>
      </div>
      <div className={s.score}>
        <span>模型预测正确</span>
        <strong>
          {modelCorrect} / {total}
        </strong>
      </div>
      <Link
        className={lesson.primary}
        href="/courses/ai-with-python/lesson-01#chapter-3-discussion"
      >
        返回课件
        <ArrowRight aria-hidden="true" />
      </Link>
    </section>
  );
}
