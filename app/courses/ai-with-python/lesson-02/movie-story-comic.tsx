/* oxlint-disable jsx-a11y/prefer-tag-over-role -- SVG crops individual panels from the story atlas. */
import { ArrowRight } from 'lucide-react';
import s from './parse-story-comic.module.css';

const stories = {
  request: ['换个地址取资料', '带上程序的名片', '请求与名片出发'],
  response: ['先看回信状态', '再核对电影内容', '受阻时用保存样本'],
  parse: ['找到电影条目', '同一张卡找两项', '片名与评分配成对'],
} as const;
const rows = ['request', 'response', 'parse'] as const;

export function MovieStoryComic({
  scene,
  step,
}: {
  scene: keyof typeof stories;
  step: number;
}) {
  const row = rows.indexOf(scene);
  return (
    <aside className={s.comic} aria-label={`电影资料连续漫画，第${row + 1}幕`}>
      <div className={s.frames}>
        {stories[scene].map((caption, col) => (
          <figure key={caption} data-active={step === col}>
            <svg
              className={s.picture}
              viewBox={`${col * 400 + 4} ${row * 400 + 4} 392 392`}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label={caption}
            >
              <defs>
                <clipPath id={`movie-comic-${scene}-${col}`}>
                  <rect
                    x={col * 400 + 4}
                    y={row * 400 + 4}
                    width="392"
                    height="392"
                  />
                </clipPath>
              </defs>
              <image
                clipPath={`url(#movie-comic-${scene}-${col})`}
                href="/courses/ai-with-python/lesson-02/assets/movie-story-sheet.png"
                width="1200"
                height="1200"
              />
            </svg>
            <figcaption>{caption}</figcaption>
            {col < 2 && <ArrowRight className={s.arrow} aria-hidden="true" />}
          </figure>
        ))}
      </div>
    </aside>
  );
}
