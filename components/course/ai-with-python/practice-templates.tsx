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
  taskVisual,
  kind = 'checkpoint',
  actionLabel = '动手完成你的作品',
  children,
}: {
  number: string;
  title: string;
  question: string;
  instruction: string;
  tip: string;
  illustration?: { src: string; alt: string };
  taskVisual?: ReactNode;
  kind?: 'checkpoint' | 'class';
  actionLabel?: string;
  children: ReactNode;
}) {
  const hasTaskVisual = taskVisual !== undefined && taskVisual !== null;
  return (
    <Stage
      title={title}
      label={
        kind === 'class'
          ? `CLASS PRACTICE · 课堂练习 ${number}`
          : `CHECKPOINT · 课后练习 ${number}`
      }
    >
      <div
        className={`${s.taskLayout} ${illustration && !hasTaskVisual ? s.visualTaskLayout : ''}`}
      >
        <aside
          className={`${s.taskBrief} ${hasTaskVisual ? s.customTaskBrief : illustration ? s.visualTaskBrief : ''}`}
          data-task-visual={hasTaskVisual ? '' : undefined}
        >
          {kind === 'class' ? (
            <ClassPracticeStamp number={number} checklist />
          ) : (
            <div className={s.stamp} data-practice-stamp>
              <Check aria-hidden="true" />
              <span>CHECKPOINT</span>
              <b>{number}</b>
            </div>
          )}
          {hasTaskVisual ? (
            <div className={s.taskVisual}>{taskVisual}</div>
          ) : illustration ? (
            <div className={s.taskIllustration}>
              <img src={illustration.src} alt={illustration.alt} />
            </div>
          ) : (
            <>
              <h3>{question}</h3>
              <p>{instruction}</p>
              <strong className={s.actionTag}>{actionLabel}</strong>
              <p className={s.tip}>{tip}</p>
            </>
          )}
        </aside>
        <div className={s.taskWork}>{children}</div>
      </div>
    </Stage>
  );
}
