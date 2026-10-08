'use client';

import { useEffect, useState } from 'react';
import { usePageState } from '@/components/course/lesson-state';
import { ClassPracticeStamp } from '@/components/course/ai-with-python/practice-templates';
import { LessonStage, Portrait } from './lesson-ui';
import { records, suspects } from './investigation-data';
import s from './first-practice.module.css';

const DURATION = 5 * 60;

export function FirstPractice() {
  const [state, update] = usePageState({ remaining: DURATION });
  const [running, setRunning] = useState(false);
  const remaining = Math.max(0, Math.min(DURATION, state.remaining));
  const finished = remaining === 0;

  useEffect(() => {
    if (!running || finished) return;
    const timer = window.setTimeout(
      () => update({ remaining: remaining - 1 }),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [running, finished, remaining, update]);

  useEffect(() => {
    const pause = () => {
      if (document.hidden) setRunning(false);
    };
    document.addEventListener('visibilitychange', pause);
    return () => document.removeEventListener('visibilitychange', pause);
  }, []);

  return (
    <LessonStage
      title="找出平均威胁值最高的恶魔"
      label="CLASS PRACTICE · 课堂练习 01"
    >
      <div className={s.mission}>
        <section className={s.enemyBoard} aria-label="九个调查对象">
          <div className={s.alert}>警报 · 恶魔正在重新集结</div>
          <div className={s.roster}>
            {suspects.map(({ name }) => (
              <figure key={name}>
                <Portrait name={name} />
                <figcaption>{name}</figcaption>
              </figure>
            ))}
          </div>
          <p className={s.dispatch}>下一波进攻前，先定下调查办法！</p>
        </section>

        <section className={s.plan} aria-label="纸上作战计划">
          <div className={s.planHeading}>
            <div>
              <h3>纸上作战计划</h3>
              <p>
                翻阅手中的全部 {records.length} 条战报，
                <br />
                在纸上写出你的分析思路。
              </p>
            </div>
            <ClassPracticeStamp number="01" checklist />
          </div>
          <p className={s.definition}>
            平均威胁值：它参与的进攻的威胁值平均数。
          </p>
          <ul className={s.prompts} aria-label="思考提示">
            <li>你会用到战报中的哪些数据？</li>
            <li>同场出现多个恶魔，怎么办？</li>
            <li>怎样算出并比较每个恶魔的平均值？</li>
          </ul>
          <div className={s.delivery}>
            <strong>交付：同伴能照着做的分析计划</strong>
            <p>写清先后顺序；本轮先写办法，不必算出结果。</p>
          </div>
        </section>
      </div>

      <div className={s.timerBar} data-urgent={remaining <= 60 && !finished}>
        <div className={s.timerLabel}>
          <strong>{finished ? '准备汇报' : '战术部署窗口'}</strong>
          <output>
            {finished
              ? '时间到，请分享你的分析思路'
              : running
                ? '正在制定调查计划'
                : remaining === DURATION
                  ? '建议用时 5 分钟 · 教师启动'
                  : '已暂停 · 等待继续'}
          </output>
        </div>
        <time className={s.clock} role="timer" aria-label="练习剩余时间">
          {String(Math.floor(remaining / 60)).padStart(2, '0')}:
          {String(remaining % 60).padStart(2, '0')}
        </time>
        <div className={s.controls}>
          <button disabled={finished} onClick={() => setRunning(!running)}>
            {finished
              ? '计时结束'
              : running
                ? '暂停计时'
                : remaining === DURATION
                  ? '开始计时'
                  : '继续计时'}
          </button>
          <button
            onClick={() => {
              setRunning(false);
              update({ remaining: DURATION });
            }}
          >
            重置计时
          </button>
        </div>
      </div>
    </LessonStage>
  );
}
