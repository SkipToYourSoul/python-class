/* oxlint-disable next/no-img-element -- Reuse the existing illustrated recaps from the first three lessons. */
'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useContext } from 'react';
import { LessonState, usePageState } from '@/components/course/lesson-state';
import s from './cover-scene.module.css';

const recapAssetBase = '/courses/ai-with-python/lesson-03/assets';
const stories = [
  {
    lesson: '第 01 课',
    title: '训练城堡守门模型',
    introduction: '勇士和小派训练守门模型，帮助城堡辨认新来客。',
    image: `${recapAssetBase}/lesson-01-recap.png`,
    summary: '整理已知档案 → 训练模型 → 预测新来客身份',
    alt: '第一课四格漫画，按从左到右、从上到下阅读：勇士和恶魔一起来到城门；勇士与小派整理带身份标签和属性的档案；训练守门模型，再输入新来客的数据；模型放行勇士，拦下恶魔。',
  },
  {
    lesson: '第 02 课',
    title: '建立勇士情报站',
    introduction: '敌情越来越多，勇士和小派从网页里提取恶魔情报。',
    image: `${recapAssetBase}/lesson-02-recap.png`,
    summary: '取回网页 → 提取地点和弱点 → 提前布置防御',
    alt: '第二课四格漫画，按从左到右、从上到下阅读：勇士发现远方的恶魔；勇士和小派取回情报网页；提取并配对恶魔的地点和弱点；为炎角兽、藤甲魔和冰翼魔提前准备防御。',
  },
  {
    lesson: '第 03 课',
    title: '保存和使用守城情报',
    introduction: '恶魔切断网络，勇士和小派靠保存的情报再次守住城堡。',
    image: `${recapAssetBase}/diary-defense-cover.png`,
    summary: '保存情报 → 断网读取档案 → 找到弱点，击退恶魔',
    alt: '第三课四格漫画，按从左到右、从上到下阅读：勇士和小派把炎角兽怕强光的情报存入文件；恶魔袭击并切断网络；勇士与晚班勇士读取本地档案；根据记录用强光击退炎角兽，再次守住城堡。',
  },
  {
    lesson: '第 04 课',
    title: '追查恶魔首领',
    introduction: '勇士再次守住城堡，幕后指挥者究竟是谁？',
    image: '/courses/ai-with-python/lesson-04/assets/lesson-04-opening.png',
    summary: '击退进攻 → 发现疑点 → 收集战报 → 用数据找线索',
    alt: '第四课四格剧情，按从左到右、从上到下阅读：勇士与小派依据档案再次击退恶魔；他们发现恶魔成组撤退，怀疑背后有人指挥；机械猫头鹰送来各地的进攻战报；勇士与小派把战报整理成表格，开始调查九个对象，尚未确定谁是首领。',
  },
] as const;

export function CoverScene() {
  const { navigate } = useContext(LessonState);
  const [state, update] = usePageState({ storyIndex: 3 });
  const index = Number.isInteger(state.storyIndex)
    ? Math.max(0, Math.min(stories.length - 1, state.storyIndex))
    : 3;
  const story = stories[index];

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
          onClick={() => navigate('l4-opening')}
        >
          开始调查 <ArrowRight size={24} aria-hidden="true" />
        </button>
      </div>
      <figure className={s.story} aria-label="第四课故事与前三课漫画回顾">
        <div className={s.recapHeading}>
          <span>{index === 3 ? '本课故事' : '前情回顾'}</span>
          <strong>
            {story.lesson} · {story.title}
          </strong>
        </div>
        <div className={s.artwork}>
          <img src={story.image} alt={story.alt} width={1672} height={941} />
        </div>
        <figcaption className={s.caption} aria-live="polite" aria-atomic="true">
          <strong>{story.introduction}</strong>
          <span>{story.summary}</span>
        </figcaption>
        <nav className={s.controls} aria-label="漫画剧情翻页">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => update({ storyIndex: index - 1 })}
          >
            <ArrowLeft size={22} aria-hidden="true" />
            上一课剧情
          </button>
          <span aria-label={`正在查看第 ${index + 1} 课剧情，共 4 课`}>
            {index + 1} / 4
          </span>
          <button
            type="button"
            disabled={index === stories.length - 1}
            onClick={() => update({ storyIndex: index + 1 })}
          >
            下一课剧情
            <ArrowRight size={22} aria-hidden="true" />
          </button>
        </nav>
      </figure>
    </div>
  );
}
