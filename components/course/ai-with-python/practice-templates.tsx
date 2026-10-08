/* oxlint-disable next/no-img-element -- The lesson uses supplied course assets. */
import type { ReactNode } from 'react';
import { Check, Code2, ListChecks } from 'lucide-react';
import { Stage } from './lesson-stage';
import s from './practice-templates.module.css';

export function ClassPracticeStamp({
  number,
  checklist = false,
}: {
  number: string;
  checklist?: boolean;
}) {
  return (
    <div className={s.stamp} data-practice-stamp>
      {checklist ? (
        <ListChecks aria-hidden="true" />
      ) : (
        <Code2 aria-hidden="true" />
      )}
      <span>{checklist ? 'CHECKLIST' : 'PRACTICE'}</span>
      <b>{number}</b>
    </div>
  );
}
export function CheckpointTaskTemplate({
  number,
  title,
  question,
  instruction,
  tip,
  illustration,
  children,
}: {
  number: string;
  title: string;
  question: string;
  instruction: string;
  tip: string;
  illustration?: { src: string; alt: string };
  children: ReactNode;
}) {
  return (
    <Stage title={title} label={`CHECKPOINT · 课后练习 ${number}`}>
      <div
        className={`${s.taskLayout} ${illustration ? s.visualTaskLayout : ''}`}
      >
        <aside
          className={`${s.taskBrief} ${illustration ? s.visualTaskBrief : ''}`}
        >
          <div className={s.stamp} data-practice-stamp>
            <Check />
            <span>CHECKPOINT</span>
            <b>{number}</b>
          </div>
          {illustration ? (
            <div className={s.taskIllustration}>
              <img src={illustration.src} alt={illustration.alt} />
            </div>
          ) : (
            <>
              <h3>{question}</h3>
              <p>{instruction}</p>
              <strong className={s.actionTag}>动手完成你的作品</strong>
              <p className={s.tip}>{tip}</p>
            </>
          )}
        </aside>
        <div className={s.taskWork}>{children}</div>
      </div>
    </Stage>
  );
}
