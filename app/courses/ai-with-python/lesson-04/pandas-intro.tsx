/* oxlint-disable next/no-img-element -- Local transparent character artwork. */
'use client';

import { Guide, LessonStage } from './lesson-ui';
import s from './pandas-intro.module.css';

export function PandasIntro() {
  return (
    <LessonStage title="海龟先生，请来熊猫博士" label="SMELL · 闻 / 认识新帮手">
      <div className={s.helpers}>
        <section className={s.helper}>
          <header>
            <h3>海龟先生</h3>
            <p>
              <code>turtle</code> · 用代码画图
            </p>
          </header>
          <div className={s.portraitArea}>
            <img
              className={s.turtle}
              src="/courses/ai-with-python/lesson-04/assets/turtle-panda-helpers.png"
              alt="可爱的海龟先生拿着画笔和画有星星、正方形的画板，介绍新朋友"
            />
          </div>
          <p className={s.dialogue}>
            “我擅长画图！分析这些战报，
            <br />
            请我的朋友熊猫博士来帮忙。”
          </p>
        </section>
        <section className={`${s.helper} ${s.pandaCard}`}>
          <header>
            <h3>熊猫博士</h3>
            <p>
              <code>pandas</code> · 整理与分析数据
            </p>
          </header>
          <div className={s.portraitArea}>
            <img
              className={s.panda}
              src="/courses/ai-with-python/lesson-04/assets/turtle-panda-helpers.png"
              alt="可爱的熊猫博士戴着眼镜、穿白大褂，手拿展示表格和统计图的记录板"
            />
          </div>
          <p className={s.dialogue}>
            “读取战报、整理表格、计算平均值，
            <br />
            这些都可以交给我！”
          </p>
        </section>
      </div>
      <Guide>库就像工具箱：之前用 turtle 画图，这次用 pandas 分析战报。</Guide>
    </LessonStage>
  );
}
