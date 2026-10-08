'use client';

import { useContext } from 'react';
import { LessonState } from '@/components/course/lesson-state';
import { ClassPracticeStamp } from '@/components/course/ai-with-python/practice-templates';
import { Guide, LessonStage, Portrait, PracticeTools } from './lesson-ui';
import { records } from './investigation-data';
import s from './practice-two-entry.module.css';

const approachingDemons = ['炎角兽', '藤甲魔', '冰翼魔'];

export function PracticeTwoEntry() {
  const { navigate } = useContext(LessonState);

  return (
    <LessonStage
      title="建立你的调查工作表"
      label="CLASS PRACTICE · 课堂练习 02"
      footer={
        <div className={s.footer}>
          <PracticeTools />
          <button
            className={s.start}
            onClick={() => navigate('l4-practice-02-code')}
          >
            开始跟写 →
          </button>
        </div>
      }
    >
      <div className={s.phases} aria-label="课堂练习步骤">
        <span aria-current="step">01 接受任务</span>
        <span>02 跟写运行</span>
        <span>03 核对结果</span>
      </div>
      <div className={s.mission}>
        <section className={s.enemyBoard} aria-label="城外的恶魔正在集结">
          <div className={s.alert}>前线警报 · 恶魔再次集结</div>
          <h3>抢在进攻前，整理战报！</h3>
          <div className={s.demons}>
            {approachingDemons.map((name) => (
              <figure key={name}>
                <div className={s.demonArt}>
                  <Portrait name={name} />
                </div>
                <figcaption>{name}</figcaption>
              </figure>
            ))}
          </div>
          <div className={s.defenseLine} aria-hidden="true" />
          <p className={s.dispatch}>勇士守住前线，你来准备调查数据。</p>
        </section>

        <section className={s.assignment} aria-label="调查工作表任务要求">
          <div className={s.assignmentHeading}>
            <div>
              <h3>让战报变成线索</h3>
              <p>在 JupyterLab 中亲手输入并运行。</p>
            </div>
            <ClassPracticeStamp number="02" checklist />
          </div>
          <ol className={s.tasks}>
            <li>
              <b>01</b>
              <div>
                <strong>读入完整战报</strong>
                <p>保留全部 5 列，先查看前 5 行。</p>
              </div>
            </li>
            <li>
              <b>02</b>
              <div>
                <strong>检查记录是否完整</strong>
                <p>用 info() 检查 {records.length} 行、5 列。</p>
              </div>
            </li>
            <li>
              <b>03</b>
              <div>
                <strong>选出调查需要的 3 列</strong>
                <p>记录编号 · 出现的恶魔 · 威胁值</p>
              </div>
            </li>
          </ol>
          <p className={s.delivery}>
            <strong>完成标准</strong> 工作表保留 {records.length} 行，只选上述 3
            列。
          </p>
        </section>
      </div>
      <Guide>先读全、再检查、最后选列。原始战报仍保存在 df 中。</Guide>
    </LessonStage>
  );
}
