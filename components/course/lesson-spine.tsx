/* oxlint-disable next/no-img-element -- The animated walker uses a supplied course mascot asset. */
'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Menu } from 'lucide-react';

export type LessonSpineChapter = {
  id: string;
  label: string;
};

type LessonSpineProps = {
  activeChapterId: string;
  activeLabel: string;
  chapterProgress: number;
  chapters: LessonSpineChapter[];
  courseHref: string;
  courseTitle: string;
  currentSlide: number;
  mascotSrc: string;
  nextDisabled: boolean;
  nextLabel: string;
  onNext: () => void;
  onChapterSelect: (chapterId: string) => void;
  onOpenOutline: () => void;
  onPrevious: () => void;
  outlineOpen: boolean;
  previousDisabled: boolean;
  previousLabel: string;
  totalSlides: number;
};

export function LessonSpine({
  activeChapterId,
  activeLabel,
  chapterProgress,
  chapters,
  courseHref,
  courseTitle,
  currentSlide,
  mascotSrc,
  nextDisabled,
  nextLabel,
  onNext,
  onChapterSelect,
  onOpenOutline,
  onPrevious,
  outlineOpen,
  previousDisabled,
  previousLabel,
  totalSlides,
}: LessonSpineProps) {
  const activeIndex = chapters.findIndex(
    (chapter) => chapter.id === activeChapterId,
  );
  const lessonFinished = activeChapterId === 'finish';
  const clampedChapterProgress = Math.min(1, Math.max(0, chapterProgress));
  const trackStart = 10;
  const trackEnd = 90;
  const chapterSegment = (trackEnd - trackStart) / chapters.length;
  const dotPosition = (index: number) => trackStart + chapterSegment * index;
  const segmentStart = activeIndex >= 0 ? dotPosition(activeIndex) : trackEnd;
  const segmentEnd =
    activeIndex >= 0 ? segmentStart + chapterSegment : trackEnd;
  const walkerPosition = lessonFinished
    ? 100
    : segmentStart + (segmentEnd - segmentStart) * clampedChapterProgress;
  const showWalker = activeIndex >= 0 || lessonFinished;

  return (
    <aside className="lesson-player-spine" aria-label="课程进度">
      <Link
        href={courseHref}
        className="lesson-spine-brand"
        aria-label={`返回 ${courseTitle} 课程目录`}
        title="返回课程目录"
      >
        <span>AI with</span>
        <strong>Python</strong>
      </Link>
      <div className="lesson-spine-journey">
        <span className="lesson-spine-task">{activeLabel}</span>
        <div className="lesson-spine-track" aria-label="课堂任务进度">
          {showWalker ? (
            <>
              <span
                className="lesson-spine-progress-fill"
                style={{
                  height: `${Math.max(0, walkerPosition - trackStart)}%`,
                }}
                aria-hidden="true"
              />
              <span
                className="lesson-spine-walker"
                style={{ top: `${walkerPosition}%` }}
                aria-hidden="true"
              >
                <img src={mascotSrc} alt="" />
              </span>
            </>
          ) : null}
          {chapters.map((chapter, index) => {
            const state =
              lessonFinished || index < activeIndex
                ? 'complete'
                : index === activeIndex
                  ? 'active'
                  : 'upcoming';

            return (
              <button
                key={chapter.id}
                type="button"
                className={state}
                style={{ top: `${dotPosition(index)}%` }}
                aria-label={`跳转到${chapter.label}`}
                aria-current={state === 'active' ? 'step' : undefined}
                onClick={() => onChapterSelect(chapter.id)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
              </button>
            );
          })}
          <span className="lesson-spine-finish-point" aria-hidden="true">
            <Check />
          </span>
        </div>
      </div>
      <nav className="lesson-spine-controls" aria-label="课件导航">
        <button
          type="button"
          aria-label="打开教学目录与更多"
          aria-haspopup="dialog"
          aria-expanded={outlineOpen}
          onClick={onOpenOutline}
          title="目录与更多"
        >
          <Menu />
        </button>
        <button
          type="button"
          aria-label={previousLabel}
          disabled={previousDisabled}
          onClick={onPrevious}
          title="上一屏"
        >
          <ArrowLeft />
        </button>
        <button
          type="button"
          aria-label={nextLabel}
          disabled={nextDisabled}
          onClick={onNext}
          title="下一屏"
        >
          <ArrowRight />
        </button>
      </nav>
      <div className="lesson-spine-counter" aria-label="当前屏数">
        <strong>{String(currentSlide).padStart(2, '0')}</strong>
        <span>/ {totalSlides}</span>
      </div>
    </aside>
  );
}
