'use client';

import { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Comic } from './lesson-ui';
import s from './trap-reaction.module.css';

export function TrapReaction({
  choice,
  burst,
  playing,
  onFinish,
}: {
  choice: string;
  burst: number;
  playing: boolean;
  onFinish: () => void;
}) {
  const wrong = choice === '现在就结案';
  useEffect(() => {
    if (!playing) return;
    const stopWhenHidden = () => {
      if (document.hidden) onFinish();
    };
    document.addEventListener('visibilitychange', stopWhenHidden);
    const timeout = window.setTimeout(onFinish, 1900);
    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener('visibilitychange', stopWhenHidden);
    };
  }, [playing, onFinish]);
  return (
    <div
      className={s.scene}
      aria-label={
        choice
          ? wrong
            ? '敌营恶魔窃喜'
            : '发现核查方向'
          : '勇士与小派比较调查记录'
      }
    >
      {!choice ? (
        <Comic kind="analysis" className={s.comic} />
      ) : wrong ? (
        <div key={burst} className={s.enemy} data-playing={playing}>
          <div className={s.character} aria-hidden="true">
            <svg className={s.demon} viewBox="0 0 160 140" fill="none">
              <path
                d="M37 51C17 42 19 18 20 10C30 27 43 19 51 40M109 40C117 19 130 27 140 10C141 18 143 42 123 51"
                fill="#F36D4A"
                stroke="#FFD580"
                strokeWidth="3"
              />
              <path
                d="M80 25C115 25 139 52 138 83C138 118 114 133 80 133C46 133 22 118 22 83C21 52 45 25 80 25Z"
                fill="#302047"
                stroke="#A685DB"
                strokeWidth="3"
              />
              <path
                d="M35 66L65 76L43 80M125 66L95 76L117 80"
                stroke="#FFC91C"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M48 96Q80 119 112 91Q100 128 73 118Q55 113 48 96Z"
                fill="#FFF0AD"
              />
              <path d="M91 103L96 116L102 99" fill="#302047" />
              <path
                d="M21 121Q31 99 45 108L65 132M139 121Q129 99 115 108L95 132"
                fill="#453061"
                stroke="#A685DB"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <span className={s.chuckle}>嘿嘿…</span>
          </div>
          <div className={s.words}>
            <span className={s.label}>敌营传来一阵窃笑</span>
            <strong>“只看第一名，就结案？”</strong>
          </div>
        </div>
      ) : (
        <div className={s.clue}>
          <ShieldCheck aria-hidden="true" />
          <div className={s.words}>
            <span className={s.label}>发现核查方向</span>
            <strong>先查记录数，再作判断！</strong>
          </div>
        </div>
      )}
    </div>
  );
}
