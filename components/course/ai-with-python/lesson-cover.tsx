/* oxlint-disable next/no-img-element -- Local lesson opening comic. */
'use client';

import { useContext } from 'react';
import { ArrowRight } from 'lucide-react';
import { LessonState } from '@/components/course/lesson-state';
import s from './lesson-cover.module.css';

export function LessonCover({
  lessonLabel,
  title,
  subtitle,
  description,
  nextScene,
  startLabel,
  story,
}: {
  lessonLabel: string;
  title: readonly [string, string];
  subtitle: string;
  description: string;
  nextScene: string;
  startLabel: string;
  story: {
    label: string;
    question: string;
    image: string;
    alt: string;
    width: number;
    height: number;
    setup: string;
    hook: string;
  };
}) {
  const { navigate } = useContext(LessonState);

  return (
    <div className={s.cover} data-lesson-cover>
      <div className={s.introduction}>
        <span className={s.eyebrow}>
          AI WITH PYTHON
          <br />
          {lessonLabel}
        </span>
        <h1>
          {title[0]}
          <br />
          <em>{title[1]}</em>
        </h1>
        <strong className={s.subtitle}>{subtitle}</strong>
        <div className={s.rule} />
        <p>{description}</p>
        <button
          type="button"
          className={s.start}
          onClick={() => navigate(nextScene)}
        >
          {startLabel} <ArrowRight size={24} aria-hidden="true" />
        </button>
      </div>
      <figure className={s.story} aria-label={story.label}>
        <div className={s.storyHeading}>
          <span>本课故事</span>
          <strong>{story.question}</strong>
        </div>
        <div className={s.artwork}>
          <img
            src={story.image}
            alt={story.alt}
            width={story.width}
            height={story.height}
          />
        </div>
        <figcaption className={s.caption}>
          <strong>{story.setup}</strong>
          <span>{story.hook}</span>
        </figcaption>
      </figure>
    </div>
  );
}
