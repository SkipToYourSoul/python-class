/* oxlint-disable next/no-img-element -- Local lesson opening comic. */
'use client';

import { useContext } from 'react';
import { ArrowRight } from 'lucide-react';
import { LessonState } from '@/components/course/lesson-state';
import { assetBase } from './lesson-data';
import s from './cover-scene.module.css';

export function CoverScene() {
  const { navigate } = useContext(LessonState);

  return (
    <div className={s.cover} data-lesson-cover>
      <div className={s.introduction}>
        <span className={s.eyebrow}>
          AI WITH PYTHON
          <br />
          第六课 · LESSON 06
        </span>
        <h1>
          决战
          <br />
          <em>魔王</em>
        </h1>
        <strong className={s.subtitle}>综合练习一</strong>
        <div className={s.rule} />
        <p>用数据找到破盾时机</p>
        <button
          type="button"
          className={s.start}
          onClick={() => navigate('l6-recap')}
        >
          迎接最终决战 <ArrowRight size={24} aria-hidden="true" />
        </button>
      </div>
      <figure className={s.story} aria-label="第六课开场漫画">
        <div className={s.storyHeading}>
          <span>本课故事</span>
          <strong>护盾为何不断恢复？</strong>
        </div>
        <div className={s.artwork}>
          <img
            src={`${assetBase}/assets/opening.jpg`}
            alt="勇士与小派带着恶魔图鉴抵达魔堡，攻击被魔王的紫色护盾挡住；机械猫头鹰发现，三座供能塔正在给护盾补充能量。"
            width={1672}
            height={941}
          />
        </div>
        <figcaption className={s.caption}>
          <strong>勇士已抵达魔王面前，却被不断恢复的护盾挡住。</strong>
          <span>三塔全部击破，才能直面魔王。</span>
        </figcaption>
      </figure>
    </div>
  );
}
