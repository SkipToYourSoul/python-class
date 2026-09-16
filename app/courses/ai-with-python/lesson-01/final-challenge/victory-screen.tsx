'use client';
import Link from 'next/link';
import { useEffect, useRef, type CSSProperties } from 'react';
import { ArrowRight, Check, Trophy, X } from 'lucide-react';
import s from './victory-screen.module.css';

export function VictoryScreen() {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    element.showModal();
    const visibility = () => {
      element.dataset.hidden = String(document.hidden);
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      element.close();
    };
  }, []);

  return (
    <dialog ref={dialog} className={s.screen} aria-labelledby="victory-title">
      <div className={s.effects} aria-hidden="true">
        <div className={s.rays} />
        {Array.from({ length: 48 }, (_, i) => (
          <i
            className={s.confetti}
            key={i}
            style={
              {
                '--x': `${(i * 37) % 100}%`,
                '--delay': `${(i % 8) * 0.18}s`,
                '--spin': `${i * 47}deg`,
              } as CSSProperties
            }
          />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <div
            className={s.firework}
            key={`burst-${i}`}
            style={
              {
                '--x': `${[14, 84, 8, 92, 28, 72][i]}%`,
                '--y': `${[24, 22, 65, 64, 12, 80][i]}%`,
                '--delay': `${i * 0.35}s`,
              } as CSSProperties
            }
          >
            {Array.from({ length: 12 }, (_, ray) => (
              <i
                key={ray}
                style={{ '--angle': `${ray * 30}deg` } as CSSProperties}
              />
            ))}
          </div>
        ))}
      </div>
      <button
        className={s.close}
        onClick={() => dialog.current?.close()}
        aria-label="关闭通关特效"
      >
        <X />
        关闭
      </button>
      <div className={s.content}>
        <p className={s.label}>MISSION COMPLETE · 城堡守门挑战</p>
        <div className={s.emblem} aria-hidden="true">
          <span />
          <Trophy />
        </div>
        <h2 id="victory-title">三关全通！</h2>
        <p className={s.subtitle}>你完成了决策树挑战</p>
        <div className={s.levels} aria-label="已完成的关卡">
          {['雾桥初守', '夜幕岔路', '王城终局'].map((name, i) => (
            <div key={name}>
              <span>0{i + 1}</span>
              <strong>{name}</strong>
              <Check aria-label="已完成" />
            </div>
          ))}
        </div>
        <p className={s.message}>看清条件，沿着分支，找到答案。</p>
        <div className={s.actions}>
          <Link
            href="/courses/ai-with-python/lesson-01#finish-summary"
            className={s.primary}
          >
            返回课堂总结
            <ArrowRight />
          </Link>
          <button autoFocus onClick={() => dialog.current?.close()}>
            查看通关页面
          </button>
        </div>
      </div>
    </dialog>
  );
}
