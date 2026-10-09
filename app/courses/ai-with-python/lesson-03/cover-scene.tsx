/* oxlint-disable next/no-img-element -- Local lesson opening comic. */
'use client';

import { useContext } from 'react';
import { LessonState } from '@/components/course/lesson-state';
import { assetBase } from './lesson-data';
import s from './lesson.module.css';
import r from './cover-scene.module.css';

export function CoverScene() {
  const { navigate } = useContext(LessonState);

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
        <button onClick={() => navigate('l3-recap')}>打开日记本 →</button>
      </div>
      <figure className={r.story} aria-label="第三课漫画剧情">
        <img
          src={`${assetBase}/assets/diary-defense-cover.png`}
          alt="第三课四格剧情，按从左到右、从上到下阅读：勇士和小派提前把炎角兽怕强光的情报存入文件；恶魔袭击并切断网络；勇士断网后读取本地档案；根据记录用强光击退炎角兽，成功守住城堡。"
          width={1672}
          height={941}
        />
        <figcaption className={r.caption}>
          <strong>恶魔切断了网络，勇士和小派还能守住城堡吗？</strong>
          <span>断网后，情报还能从哪里找到？日记本里会藏着什么防御线索？</span>
        </figcaption>
      </figure>
    </div>
  );
}
