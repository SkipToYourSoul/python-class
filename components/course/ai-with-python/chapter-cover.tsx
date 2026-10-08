import type { ReactNode } from 'react';

export function ChapterCover({
  number,
  title,
  kicker,
  task,
}: {
  number: string;
  title: ReactNode;
  kicker: string;
  task: ReactNode;
}) {
  return (
    <div className="atlas-chapter-brief atlas-chapter-brief-simple">
      <header>
        <span>
          CHAPTER {number} · {kicker}
        </span>
        <h2>{title}</h2>
      </header>
      <div className="atlas-brief-number" aria-hidden="true">
        {number}
      </div>
      <footer>
        <span>本章任务</span>
        <p>{task}</p>
      </footer>
    </div>
  );
}
