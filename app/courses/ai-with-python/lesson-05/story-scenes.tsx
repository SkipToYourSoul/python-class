/* oxlint-disable next/no-img-element -- Local generated comic panels. */
'use client';

import { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import { usePageState } from '@/components/course/lesson-state';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Page } from './lesson-ui';
import { assetBase } from './lesson-data';
import { storyComics, type StoryKind } from './story-data';
import { demons, demonKinds, patrol } from './study-data';
import s from './story-scenes.module.css';

const speakerPortraits = {
  勇士: {
    src: '/courses/ai-with-python/lesson-01/assets/final-guardian-hero.png',
    width: 1122,
    height: 1402,
    viewBox: '370 20 340 340',
  },
  小派: {
    src: '/courses/ai-with-python/lesson-01/assets/xiaopai-guide.png',
    width: 480,
    height: 478,
    viewBox: '105 0 280 280',
  },
  熊猫博士: {
    src: '/courses/ai-with-python/lesson-04/assets/turtle-panda-helpers.png',
    width: 1774,
    height: 887,
    viewBox: '1060 0 500 500',
  },
} as const;

export function StoryComic({ kind }: { kind: StoryKind }) {
  const [state, update] = usePageState({ answer: '' });
  const [expanded, setExpanded] = useState(false);
  const comic = storyComics[kind];
  const src = `${assetBase}/assets/${comic.image}`;

  return (
    <Page
      title={comic.title}
      label={comic.label}
      footer={
        kind === 'guess' ? (
          <div className={s.guess}>
            <div className={s.choices} aria-label="保留你的猜想">
              {['我猜是', '不一定', '需要更多记录'].map((answer) => (
                <button
                  key={answer}
                  aria-pressed={state.answer === answer}
                  onClick={() => update({ answer })}
                >
                  {answer}
                </button>
              ))}
            </div>
            <p className={s.answer}>
              {state.answer
                ? `已保留“${state.answer}”，下一页用记录查证。`
                : '先保留猜想，再用记录来检验。'}
            </p>
          </div>
        ) : undefined
      }
    >
      <div className={s.layout}>
        <div className={s.artArea}>
          <img className={s.comic} src={src} alt={comic.alt} />
          <button
            className={s.expand}
            onClick={() => setExpanded(true)}
            aria-label="放大三格漫画"
          >
            <ZoomIn size={20} aria-hidden="true" />
            放大漫画
          </button>
        </div>
        <ol className={s.dialogue} aria-label="从左到右的三格剧情">
          {comic.steps.map((step, i) => (
            <li key={step.name} aria-label={`第 ${i + 1} 格 · ${step.name}`}>
              <div className={s.speaker}>
                <svg
                  className={s.avatar}
                  viewBox={speakerPortraits[step.speaker].viewBox}
                  // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- SVG crops an existing character illustration into an accessible portrait.
                  role="img"
                  aria-label={`${step.speaker}头像`}
                >
                  <image
                    href={speakerPortraits[step.speaker].src}
                    width={speakerPortraits[step.speaker].width}
                    height={speakerPortraits[step.speaker].height}
                  />
                </svg>
                <strong>{step.speaker}</strong>
              </div>
              <div className={s.bubble}>
                <blockquote>{step.quote}</blockquote>
                <p className={s.question}>
                  <strong>想一想：</strong>
                  {step.question}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className={s.modal}>
          <DialogHeader>
            <DialogTitle>{comic.title}</DialogTitle>
            <DialogDescription>
              按从左到右的顺序查看三格剧情。
            </DialogDescription>
          </DialogHeader>
          <img src={src} alt={comic.alt} />
          <div className={s.captions}>
            {comic.steps.map((step, i) => (
              <p key={step.name}>
                <strong>
                  {i + 1} · {step.name}
                </strong>
                {step.speaker}：{step.quote}
              </p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Page>
  );
}

export function GuessStory() {
  return <StoryComic kind="guess" />;
}

export function PatrolStory() {
  return <StoryComic kind="patrol" />;
}

export function KindStory() {
  return <StoryComic kind="kind" />;
}

const exception = demons.find((row) => row.id === 'D004')!;
const fastestTime = patrol.reduce((a, b) => (a.speed > b.speed ? a : b));
const slowestTime = patrol.reduce((a, b) => (a.speed < b.speed ? a : b));
const fastestKind = demonKinds
  .map((kind) => {
    const records = demons.filter((row) => row.kind === kind);
    return {
      kind,
      speed: records.reduce((sum, row) => sum + row.speed, 0) / records.length,
    };
  })
  .reduce((a, b) => (a.speed > b.speed ? a : b));

/** Close the same story with evidence from the projected data. */
export function StoryResult({ kind }: { kind: StoryKind }) {
  const result = {
    guess: `D004 高 ${exception.height} cm，速度 ${exception.speed} m/s。勇士记住：大个头也能跑得快，行动前先查记录。`,
    patrol: `${fastestTime.hour} 时最快 ${fastestTime.speed}，${slowestTime.hour} 时最慢 ${slowestTime.speed} m/s。勇士把 ${slowestTime.hour} 时列为复查时段，还要确认现场变化。`,
    kind: `${fastestKind.kind}均速 ${fastestKind.speed.toFixed(1)} m/s 最高。勇士先关注这队追兵；遇到具体个体，仍要核对它的记录。`,
  }[kind];
  return (
    <p className={s.result}>
      <strong>勇士的新线索：</strong>
      {result}
    </p>
  );
}
