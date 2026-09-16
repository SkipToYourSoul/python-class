'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Pause, Play } from 'lucide-react';
import { XiaopaiFigure } from '@/components/course/xiaopai-figure';
import s from './xiaopai-speech.module.css';

export function XiaopaiSpeech({
  active,
  children,
  label = '小派的鼓励',
  compact = false,
  featured = false,
}: {
  active: boolean;
  children?: ReactNode;
  label?: string;
  compact?: boolean;
  featured?: boolean;
}) {
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const syncVisibility = () => setHidden(document.hidden);
    syncVisibility();
    document.addEventListener('visibilitychange', syncVisibility);
    return () =>
      document.removeEventListener('visibilitychange', syncVisibility);
  }, []);

  return (
    <aside
      className={`${s.speech} ${compact ? s.compact : ''} ${featured ? s.featured : ''}`}
      aria-label={label}
      data-paused={paused || hidden || !active}
    >
      <button
        className={s.mascot}
        type="button"
        aria-label={paused ? '播放小派动画' : '暂停小派动画'}
        title={paused ? '播放小派动画' : '暂停小派动画'}
        onClick={() => setPaused((value) => !value)}
      >
        <span aria-hidden="true">
          <XiaopaiFigure />
          <span className={s.control}>
            {paused ? <Play size={18} /> : <Pause size={18} />}
          </span>
        </span>
      </button>
      <p className={s.bubble}>
        {children ?? (
          <>
            你的未来，可以与它们<strong>完全不同</strong>。
          </>
        )}
      </p>
    </aside>
  );
}
