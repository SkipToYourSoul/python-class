'use client';

import { useId } from 'react';
import s from './xiaopai-figure.module.css';

/** Animate layers of the original supplied artwork, keeping its texture and lettering. */
export function XiaopaiFigure({
  motion = 'idle',
  className,
}: {
  motion?: 'idle' | 'running';
  className?: string;
}) {
  const id = useId();
  const ref = (part: string) => `url(#${id}-${part})`;
  const artwork = <use href={`#${id}-art`} />;
  return (
    <svg
      className={`${s.figure} ${className ?? ''}`}
      data-motion={motion}
      viewBox="40 -12 400 520"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- Inline SVG needs image semantics while its groups remain animatable.
      role="img"
      aria-label={
        motion === 'running'
          ? '奔跑中的小派'
          : '小派抱着 Python for AI 牌子，轻轻呼吸、歪头和眨眼'
      }
      focusable="false"
    >
      <defs>
        <image
          id={`${id}-art`}
          href={'/courses/ai-with-python/lesson-01/assets/xiaopai-guide.png'}
          width="480"
          height="478"
        />
        <clipPath id={`${id}-head`}>
          <path d="M0 0H480V250H0Z" />
        </clipPath>
        <clipPath id={`${id}-board`}>
          <path d="M0 250H480V420H0Z" />
        </clipPath>
        <clipPath id={`${id}-left-foot`}>
          <path d="M0 411H248V478H0Z" />
        </clipPath>
        <clipPath id={`${id}-right-foot`}>
          <path d="M248 411H480V478H248Z" />
        </clipPath>
        <clipPath id={`${id}-eyes`}>
          <ellipse cx="206" cy="106" rx="30" ry="28" />
          <ellipse cx="294" cy="108" rx="29" ry="28" />
        </clipPath>
        <linearGradient id={`${id}-lid`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#edb923" />
          <stop offset="0.5" stopColor="#ffe34a" />
          <stop offset="1" stopColor="#c38e12" />
        </linearGradient>
      </defs>
      <ellipse
        className={s.shadow}
        cx="252"
        cy="475"
        rx="100"
        ry="10"
        fill="#071a3d"
        opacity="0.12"
      />
      <g className={s.sway}>
        <g className={s.leftFoot}>
          <g clipPath={ref('left-foot')}>{artwork}</g>
        </g>
        <g className={s.rightFoot}>
          <g clipPath={ref('right-foot')}>{artwork}</g>
        </g>
        <g className={s.breathe}>
          {/* The neck overlaps behind the sign so rotating layers never open a seam. */}
          <path d="M139 228H356V276H139Z" fill="#f4cb20" />
          <g className={s.head}>
            <g clipPath={ref('head')}>{artwork}</g>
            <g clipPath={ref('eyes')}>
              <g className={s.blink}>
                <path d="M170 75H330V139H170Z" fill={ref('lid')} />
                <path
                  d="M176 107Q206 116 236 107M265 109Q294 118 323 109"
                  fill="none"
                  stroke="#9d6e15"
                  strokeWidth="2"
                />
              </g>
            </g>
          </g>
          <g className={s.board}>
            <g clipPath={ref('board')}>{artwork}</g>
          </g>
        </g>
      </g>
    </svg>
  );
}
