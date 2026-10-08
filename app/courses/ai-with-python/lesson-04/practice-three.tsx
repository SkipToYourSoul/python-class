'use client';

import { useContext, useEffect, useState } from 'react';
import { Castle, ShieldAlert } from 'lucide-react';
import { LessonState, usePageState } from '@/components/course/lesson-state';
import { ClassPracticeStamp } from '@/components/course/ai-with-python/practice-templates';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { Guide, LessonStage, Portrait, PracticeTools } from './lesson-ui';
import { records, rankSuspects } from './investigation-data';
import { practiceThreeCells, PRACTICE_THREE_CODE } from './practice-content';
import s from './practice-three.module.css';

const enemyNames = ['炎角兽', '藤甲魔', '冰翼魔'];
const DURATION = 5 * 60;

export function PracticeThreeEntry() {
  const { navigate } = useContext(LessonState);
  return (
    <LessonStage
      title="下一轮进攻前，锁定调查方向"
      label="CLASS PRACTICE · 课堂练习 03"
      footer={
        <div className={s.footer}>
          <PracticeTools code={PRACTICE_THREE_CODE} />
          <button
            className={s.start}
            onClick={() => navigate('l4-practice-03-code')}
          >
            开始分析 →
          </button>
        </div>
      }
    >
      <div className={s.mission}>
        <section className={s.enemyBoard} aria-label="恶魔正在城外集结">
          <div className={s.alert}>
            <ShieldAlert aria-hidden="true" /> 前线急报 · 敌军再次集结
          </div>
          <div className={s.battlefield}>
            <div className={s.castle}>
              <Castle aria-hidden="true" />
              <strong>城堡防线</strong>
            </div>
            {enemyNames.map((name, index) => (
              <figure className={s.enemy} data-position={index} key={name}>
                <div className={s.demonArt}>
                  <Portrait name={name} />
                </div>
                <figcaption>{name}</figcaption>
              </figure>
            ))}
          </div>
          <div className={s.warningLine} aria-hidden="true" />
          <p>它们正在逼近，幕后指挥者仍藏在其中。</p>
        </section>
        <section className={s.assignment} aria-label="课堂练习三任务">
          <header>
            <div>
              <h3>让数据指引调查</h3>
              <p>接着练习二的工作表 focus。</p>
            </div>
            <ClassPracticeStamp number="03" checklist />
          </header>
          <ol className={s.tasks}>
            <li>
              <b>01</b>
              <div>
                <strong>整理名字</strong>
                <p>拆分、展开，让每个恶魔各占一行。</p>
              </div>
            </li>
            <li>
              <b>02</b>
              <div>
                <strong>一起算均值和次数</strong>
                <p>同名归组，同时核对两项统计。</p>
              </div>
            </li>
            <li>
              <b>03</b>
              <div>
                <strong>筛选调查名单</strong>
                <p>至少出现 3 次，再按均值从高到低排。</p>
              </div>
            </li>
          </ol>
          <p className={s.delivery}>
            <strong>交付</strong> 统计表＋调查名单，说明筛选依据。
          </p>
        </section>
      </div>
      <Guide>
        勇士守住前线，我们用均值和次数找方向。调查名单还不能证明谁是首领。
      </Guide>
    </LessonStage>
  );
}

function PracticeClock() {
  const [state, update] = usePageState({ practiceRemaining: DURATION });
  const [running, setRunning] = useState(false);
  const remaining = Math.max(0, Math.min(DURATION, state.practiceRemaining));
  useEffect(() => {
    if (!running || remaining === 0) return;
    const timer = window.setTimeout(
      () => update({ practiceRemaining: remaining - 1 }),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [running, remaining, update]);
  useEffect(() => {
    const pause = () => {
      if (document.hidden) setRunning(false);
    };
    document.addEventListener('visibilitychange', pause);
    return () => document.removeEventListener('visibilitychange', pause);
  }, []);
  return (
    <div className={s.clock} data-urgent={remaining <= 60}>
      <time role="timer" aria-label="练习三剩余时间">
        {remaining === 0
          ? '准备汇报'
          : `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`}
      </time>
      <button disabled={remaining === 0} onClick={() => setRunning(!running)}>
        {remaining === 0
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
          update({ practiceRemaining: DURATION });
        }}
      >
        重置计时
      </button>
    </div>
  );
}

export function PracticeThreeCode() {
  const associations = records.reduce((sum, row) => sum + row.demons.length, 0);
  return (
    <LessonStage
      title="一页完成你的数据调查"
      label="CLASS PRACTICE · 课堂练习 03"
      footer={
        <div className={s.footer}>
          <PracticeTools code={PRACTICE_THREE_CODE} />
          <PracticeClock />
        </div>
      }
    >
      <div className={s.codeGrid}>
        {practiceThreeCells.map((cell, index) => (
          <div
            className={s.codeCard}
            key={cell.key}
            data-practice-cell={index + 1}
          >
            <NotebookPanel
              title={`${index + 1}  ${cell.title} · 第四课练习.ipynb`}
              compact
              cells={[{ code: cell.code }]}
            />
          </div>
        ))}
        <section className={s.checks} aria-label="运行后核对结果">
          <h3>
            <span>4</span> 运行后核对
          </h3>
          <div className={s.metrics}>
            <div>
              <b>{associations}</b>
              <span>展开后的关联</span>
            </div>
            <div>
              <b>{rankSuspects().length}</b>
              <span>恶魔统计组</span>
            </div>
            <div>
              <b>{rankSuspects(3).length}</b>
              <span>保留的对象</span>
            </div>
          </div>
          <p>第 2 格看统计表，第 3 格看筛选后的名单。</p>
          <strong className={s.question}>
            岩背魔为什么被筛掉？
            <br />
            留下的第一名，能直接认定为首领吗？
          </strong>
        </section>
      </div>
      <div className={s.codeGuide}>
        <Guide>
          接着 focus，Shift + Enter 逐格运行。work 是副本，可以重跑。
        </Guide>
      </div>
    </LessonStage>
  );
}
