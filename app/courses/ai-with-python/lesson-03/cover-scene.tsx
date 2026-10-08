/* oxlint-disable next/no-img-element -- Local story recap artwork with matching classroom characters. */
'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useContext } from 'react';
import { LessonState, usePageState } from '@/components/course/lesson-state';
import { assetBase } from './lesson-data';
import s from './lesson.module.css';
import r from './cover-scene.module.css';

const stories = [
  {
    introduction: '勇士和小派训练守门模型，帮助城堡辨认新来客。',
    image: 'lesson-01-recap.png',
    summary: '来客难分辨 → 整理已知档案 → 训练模型 → 预测身份，守好城门',
    alt: '第一课四格剧情，按从左到右、从上到下阅读：勇士与恶魔一起来到城门；勇士和小派整理带有身份标签及攻击、防御、血量的档案；训练守门模型后，输入新来客的数据预测身份；在这次守门中，模型放行勇士，拦下恶魔。',
  },
  {
    introduction: '敌情越来越多，勇士和小派从网页中找出恶魔的地点和弱点。',
    image: 'lesson-02-recap.png',
    summary: '敌情越来越多 → 取回网页 → 找到地点和弱点 → 提前布置防御',
    alt: '第二课四格剧情，按从左到右、从上到下阅读：勇士发现远方恶魔，敌情越来越多；勇士和小派用程序取回情报网页；从每条记录中提取恶魔、地点和弱点并正确配对；根据情报为炎角兽、藤甲魔、冰翼魔准备防御。',
  },
  {
    introduction: '恶魔切断了网络，勇士和小派还能守住城堡吗？',
    image: 'diary-defense-cover.png',
    summary: '断网后，情报还能从哪里找到？日记本里会藏着什么防御线索？',
    alt: '第三课四格剧情，按从左到右、从上到下阅读：勇士和小派提前把炎角兽怕强光的情报存入文件；恶魔袭击并切断网络；勇士断网后读取本地档案；根据记录用强光击退炎角兽，成功守住城堡。',
  },
] as const;

export function CoverScene() {
  const { navigate } = useContext(LessonState);
  const [state, update] = usePageState({ recapLesson: 2 });
  const story = stories[state.recapLesson];

  return (
    <div className={s.cover}>
      <div>
        <span className={s.eyebrow}>
          AI WITH PYTHON
          <br />
          LESSON 03
        </span>
        <h1>
          探险家的
          <br />
          <em>日记本</em>
        </h1>
        <div className={s.coverRule} />
        <p>
          把情报存进文件，
          <br />
          断网也能守护城堡。
        </p>
        <button onClick={() => navigate('l3-movie-story')}>打开日记本 →</button>
      </div>
      <figure className={r.story} aria-label="前三课漫画剧情">
        <img
          src={`${assetBase}/assets/${story.image}`}
          alt={story.alt}
          width={1672}
          height={941}
        />
        <figcaption className={r.caption} aria-live="polite" aria-atomic="true">
          <strong>{story.introduction}</strong>
          <span>{story.summary}</span>
        </figcaption>
        <nav className={r.controls} aria-label="漫画剧情翻页">
          <button
            type="button"
            disabled={state.recapLesson === 0}
            onClick={() => update({ recapLesson: state.recapLesson - 1 })}
          >
            <ArrowLeft size={22} aria-hidden="true" />
            上一课剧情
          </button>
          <button
            type="button"
            disabled={state.recapLesson === 2}
            onClick={() => update({ recapLesson: state.recapLesson + 1 })}
          >
            下一课剧情
            <ArrowRight size={22} aria-hidden="true" />
          </button>
        </nav>
      </figure>
    </div>
  );
}
