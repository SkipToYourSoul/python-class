/* oxlint-disable next/no-img-element -- Local lesson opening comic. */
'use client';

import { ArrowRight } from 'lucide-react';
import { useContext } from 'react';
import { LessonState } from '@/components/course/lesson-state';
import s from './cover-scene.module.css';

const story = {
  title: '追查恶魔首领',
  introduction: '勇士再次守住城堡，幕后指挥者究竟是谁？',
  image: '/courses/ai-with-python/lesson-04/assets/lesson-04-opening.png',
  summary: '击退进攻 → 发现疑点 → 收集战报 → 用数据找线索',
  alt: '第四课四格剧情，按从左到右、从上到下阅读：勇士与小派依据档案再次击退恶魔；他们发现恶魔成组撤退，怀疑背后有人指挥；机械猫头鹰送来各地的进攻战报；勇士与小派把战报整理成表格，开始调查九个对象，尚未确定谁是首领。',
};

export function CoverScene() {
  const { navigate } = useContext(LessonState);

  return (
    <div className={s.cover} data-lesson-cover>
      <div className={s.introduction}>
        <span className={s.eyebrow}>
          AI WITH PYTHON
          <br />
          LESSON 04
        </span>
        <h1>
          数据
          <br />
          <em>小侦探</em>
        </h1>
        <strong className={s.subtitle}>追查恶魔首领</strong>
        <div className={s.rule} />
        <p>
          从战报中找线索，
          <br />
          查清谁在指挥恶魔。
        </p>
        <button
          type="button"
          className={s.start}
          onClick={() => navigate('l4-recap')}
        >
          开始调查 <ArrowRight size={24} aria-hidden="true" />
        </button>
      </div>
      <figure className={s.story} aria-label="第四课漫画剧情">
        <div className={s.recapHeading}>
          <span>本课故事</span>
          <strong>{story.title}</strong>
        </div>
        <div className={s.artwork}>
          <img src={story.image} alt={story.alt} width={1672} height={941} />
        </div>
        <figcaption className={s.caption} aria-live="polite" aria-atomic="true">
          <strong>{story.introduction}</strong>
          <span>{story.summary}</span>
        </figcaption>
      </figure>
    </div>
  );
}
