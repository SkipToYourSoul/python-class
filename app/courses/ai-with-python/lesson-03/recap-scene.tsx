/* oxlint-disable next/no-img-element -- Reuse the established lesson recap comics. */
'use client';

import { ArrowRight } from 'lucide-react';
import { useContext } from 'react';
import { Stage } from '@/components/course/ai-with-python/lesson-stage';
import { LessonState, usePageState } from '@/components/course/lesson-state';
import { assetBase } from './lesson-data';
import r from './recap-scene.module.css';

const stories = [
  {
    lesson: '第一课',
    title: '训练守门模型',
    introduction: '勇士和小派训练守门模型，帮助城堡辨认新来客。',
    image: 'lesson-01-recap.png',
    steps: ['来客难分辨', '整理已知档案', '训练模型', '预测身份，守好城门'],
    alt: '第一课四格剧情，按从左到右、从上到下阅读：勇士与恶魔一起来到城门；勇士和小派整理带有身份标签及攻击、防御、血量的档案；训练守门模型后，输入新来客的数据预测身份；在这次守门中，模型放行勇士，拦下恶魔。',
  },
  {
    lesson: '第二课',
    title: '收集网页情报',
    introduction: '敌情越来越多，勇士和小派从网页中找出恶魔的地点和弱点。',
    image: 'lesson-02-recap.png',
    steps: ['敌情越来越多', '取回网页', '找到地点和弱点', '提前布置防御'],
    alt: '第二课四格剧情，按从左到右、从上到下阅读：勇士发现远方恶魔，敌情越来越多；勇士和小派用程序取回情报网页；从每条记录中提取恶魔、地点和弱点并正确配对；根据情报为炎角兽、藤甲魔、冰翼魔准备防御。',
  },
] as const;

export function RecapScene() {
  const { navigate } = useContext(LessonState);
  const [state, update] = usePageState({ recapLesson: 0 });
  const story = stories[state.recapLesson];

  return (
    <Stage
      title="前情提要"
      label="STORY RECAP · 城堡守护记"
      className={r.stage}
      footer={
        <div className={r.controls}>
          <nav className={r.lessonTabs} aria-label="选择回顾课程">
            {stories.map((item, index) => (
              <button
                key={item.lesson}
                type="button"
                aria-pressed={state.recapLesson === index}
                onClick={() => update({ recapLesson: index })}
              >
                {item.lesson} · {item.title}
              </button>
            ))}
          </nav>
          <button
            type="button"
            className={r.continueButton}
            onClick={() => navigate('l3-movie-story')}
          >
            继续第三课
            <ArrowRight size={22} aria-hidden="true" />
          </button>
        </div>
      }
    >
      <figure className={r.story} aria-label={`${story.lesson}漫画剧情回顾`}>
        <div className={r.artwork}>
          <img
            src={`${assetBase}/assets/${story.image}`}
            alt={story.alt}
            width={1672}
            height={941}
          />
        </div>
        <figcaption className={r.caption} aria-live="polite" aria-atomic="true">
          <span className={r.lessonLabel}>{story.lesson}</span>
          <h3>{story.title}</h3>
          <p>{story.introduction}</p>
          <ol className={r.storySteps}>
            {story.steps.map((step, index) => (
              <li key={step}>
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </figcaption>
      </figure>
    </Stage>
  );
}
