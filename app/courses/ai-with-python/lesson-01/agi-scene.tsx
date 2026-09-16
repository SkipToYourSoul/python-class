'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Stage, useSceneState, asset } from './lesson-ui';
import shared from './lesson-review.module.css';
import s from './agi-scene.module.css';

const clips = [
  {
    year: '2026',
    title: '2026 春晚 · 机器人武术',
    file: 'spring-gala-robots-2026.mp4',
    poster: 'spring-gala-robots-2026-poster.png',
  },
  {
    year: '2025',
    title: '2025 春晚 · 机器人秧歌',
    file: 'spring-gala-robots-2025.mp4',
    poster: 'spring-gala-robots-2025-poster.png',
  },
];

function RobotVideo({
  clip,
  active,
}: {
  clip: (typeof clips)[number];
  active: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let cancelled = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPlayback = () => {
      if (!active || document.hidden || reduced.matches) {
        element.pause();
        return;
      }
      void element.play().catch((error: unknown) => {
        if (
          !cancelled &&
          !(error instanceof DOMException && error.name === 'AbortError')
        )
          setFailed(true);
      });
    };
    syncPlayback();
    document.addEventListener('visibilitychange', syncPlayback);
    reduced.addEventListener('change', syncPlayback);
    return () => {
      cancelled = true;
      element.pause();
      document.removeEventListener('visibilitychange', syncPlayback);
      reduced.removeEventListener('change', syncPlayback);
    };
  }, [active]);

  return (
    <div className={s.player}>
      <div className={s.screen}>
        <video
          ref={video}
          poster={asset(clip.poster)}
          aria-label={clip.title}
          preload="auto"
          playsInline
          muted
          loop
          onError={() => setFailed(true)}
        >
          <source
            src={asset(clip.file.replace('.mp4', '.webm'))}
            type="video/webm"
          />
          <source src={asset(clip.file)} type="video/mp4" />
        </video>
      </div>
      {failed && (
        <a
          className={s.videoFallback}
          href={asset(clip.year === '2026' ? 'image60.GIF' : 'image58.GIF')}
          target="_blank"
          rel="noreferrer"
        >
          打开机器人片段
        </a>
      )}
    </div>
  );
}

export function AgiScene({ active }: { active: boolean }) {
  const [v, set] = useSceneState('agi', { clipIndex: 0 });
  const clip = clips[v.clipIndex] ?? clips[0];
  return (
    <Stage label="AI EXPLORER · 未来猜想" title="未来的AI会是什么模样？">
      <div className={s.content}>
        <section className={s.watch} aria-label="春晚机器人对照">
          <div className={s.clipHeader}>
            <h3>{clip.title}</h3>
            <button
              className={shared.secondary}
              onClick={() => set({ clipIndex: v.clipIndex === 0 ? 1 : 0 })}
            >
              {v.clipIndex === 0 ? '对照 2025' : '返回 2026'}
            </button>
          </div>
          <RobotVideo key={clip.year} clip={clip} active={active} />
        </section>
        <section className={s.discussion} aria-label="AGI 通用人工智能">
          <span className={s.eyebrow}>未来的一种可能</span>
          <h3>
            <span>AGI</span>通用人工智能
          </h3>
          <p>
            像人一样学习和思考，把学会的本领用到<strong>各种新任务</strong>中。
          </p>
        </section>
      </div>
      <div className={s.nextQuestion}>
        <div>
          <span>带着问题继续探索</span>
          <strong>机器是怎么学习的？</strong>
        </div>
        <a href="#chapter-1-samuel">
          下一页，找答案
          <ArrowRight size={22} aria-hidden="true" />
        </a>
      </div>
    </Stage>
  );
}
