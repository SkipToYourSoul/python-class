/* oxlint-disable next/no-img-element -- Local lesson recap comics. */
'use client';

import { ArrowRight } from 'lucide-react';
import { useContext } from 'react';
import { LessonState, usePageState } from '@/components/course/lesson-state';
import { Stage } from './lesson-stage';
import r from './story-recap.module.css';

export type RecapStory = {
  lesson: string;
  title: string;
  introduction: string;
  image: string;
  steps: readonly string[];
  alt: string;
};

export function StoryRecap({
  stories,
  nextScene,
  continueLabel,
}: {
  stories: readonly [RecapStory, ...RecapStory[]];
  nextScene: string;
  continueLabel: string;
}) {
  const { navigate } = useContext(LessonState);
  const [state, update] = usePageState({ recapLesson: 0 });
  const index = Number.isInteger(state.recapLesson)
    ? Math.max(0, Math.min(stories.length - 1, state.recapLesson))
    : 0;
  const story = stories[index];

  return (
    <Stage
      title="前情提要"
      label="STORY RECAP · 城堡守护记"
      className={r.stage}
      footer={
        <div className={r.controls}>
          <nav className={r.lessonTabs} aria-label="选择回顾课程">
            {stories.map((item, tabIndex) => (
              <button
                key={item.lesson}
                type="button"
                aria-pressed={index === tabIndex}
                onClick={() => update({ recapLesson: tabIndex })}
              >
                {item.lesson} · {item.title}
              </button>
            ))}
          </nav>
          <button
            type="button"
            className={r.continueButton}
            onClick={() => navigate(nextScene)}
          >
            {continueLabel}
            <ArrowRight size={22} aria-hidden="true" />
          </button>
        </div>
      }
    >
      <figure className={r.story} aria-label={`${story.lesson}漫画剧情回顾`}>
        <div className={r.artwork}>
          <img src={story.image} alt={story.alt} width={1672} height={941} />
        </div>
        <figcaption className={r.caption} aria-live="polite" aria-atomic="true">
          <span className={r.lessonLabel}>{story.lesson}</span>
          <h3>{story.title}</h3>
          <p>{story.introduction}</p>
          <ol className={r.storySteps}>
            {story.steps.map((step, index) => (
              <li key={step}>
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </figcaption>
      </figure>
    </Stage>
  );
}
