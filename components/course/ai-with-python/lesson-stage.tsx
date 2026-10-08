import type { ReactNode } from 'react';
import s from './lesson-stage.module.css';

export function SceneHeading({
  kicker,
  title,
}: {
  kicker: string;
  title: string;
}) {
  return (
    <header className={`lesson-standard-heading ${s.heading}`}>
      <span>{kicker}</span>
      <h2>{title}</h2>
    </header>
  );
}
export function Stage({
  title,
  label,
  children,
  footer,
  className = '',
}: {
  title: string;
  label: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${s.scene} ${className}`} data-lesson-stage>
      <SceneHeading kicker={label} title={title} />
      <div className={s.body}>{children}</div>
      {footer && <div className={s.footer}>{footer}</div>}
    </div>
  );
}
