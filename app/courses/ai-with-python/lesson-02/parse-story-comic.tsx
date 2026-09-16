/* oxlint-disable jsx-a11y/prefer-tag-over-role -- SVG viewBox crops one labelled panel from the comic sheet. */
import { ArrowRight } from 'lucide-react';
import s from './parse-story-comic.module.css';

const stories = {
  soup: ['带回 HTML', '请来整理员', '整理成解析树'],
  find: ['记录都在树里', 'find：拿第一张', 'find_all：拿全部'],
  fields: ['根据属性', '寻找元素', '获取文本'],
  loop: ['三张记录排好队', '每轮处理一张', '下一步：补齐简报'],
} as const;
const keys = ['soup', 'find', 'fields', 'loop'] as const;
const panelRows = [
  [2, 357],
  [365, 331],
  [704, 331],
  [1042, 403],
] as const;
export function ParseStoryComic({
  scene,
  step,
  value,
}: {
  scene: keyof typeof stories;
  step: number;
  value?: string;
}) {
  const row = keys.indexOf(scene);
  const captions = [...stories[scene]] as string[];
  if (scene === 'fields') {
    captions[0] = ['class="location"', 'class="attribute"', 'class="weakness"'][
      step
    ];
    captions[2] = `取出：${value ?? ''}`;
  }

  const active =
    scene === 'soup'
      ? step === 0
        ? 1
        : 2
      : scene === 'find'
        ? step + 1
        : scene === 'fields'
          ? 2
          : step;
  return (
    <aside className={s.comic} aria-label={`解析情报连续漫画，第${row + 1}幕`}>
      <div className={s.frames}>
        {captions.map((caption, col) => (
          <figure key={col} data-active={col === active}>
            <svg
              className={s.picture}
              viewBox={`${col * 362 + 4} ${panelRows[row][0]} 354 ${panelRows[row][1]}`}
              preserveAspectRatio={
                scene === 'loop' ? 'xMidYMid meet' : 'xMidYMid slice'
              }
              role="img"
              aria-label={`${stories[scene][col]}的勇士与档案整理员漫画`}
            >
              <defs>
                <clipPath id={`parse-comic-${scene}-${col}`}>
                  <rect
                    x={col * 362 + 4}
                    y={panelRows[row][0]}
                    width="354"
                    height={panelRows[row][1]}
                  />
                </clipPath>
              </defs>
              <image
                clipPath={`url(#parse-comic-${scene}-${col})`}
                href="/courses/ai-with-python/lesson-02/assets/parse-story-sheet-v2.png"
                width="1086"
                height="1448"
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
