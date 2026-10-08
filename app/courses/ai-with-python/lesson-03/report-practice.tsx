/* oxlint-disable next/no-img-element -- Reuse the established classroom comic characters. */
'use client';

import { useContext } from 'react';
import { LessonState, usePageState } from '@/components/course/lesson-state';
import { ClassPracticeStamp } from '@/components/course/ai-with-python/practice-templates';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { LessonStage, PracticeTools } from './lesson-ui';
import { assetBase } from './lesson-data';
import { REPORT_OUTPUT, REPORT_COMPLETE_CODE } from './practice-content';
import s from './report-practice.module.css';

export function ReportPracticeEntry() {
  const { navigate } = useContext(LessonState);
  return (
    <LessonStage
      title="制作勇士交接记录"
      label="CLASS PRACTICE · 课堂练习 02"
      footer={
        <div className={s.entryFooter}>
          <button
            className={s.primary}
            onClick={() => navigate('l3-practice-02-source')}
          >
            开始练习 →
          </button>
        </div>
      }
    >
      <div className={s.entry}>
        <aside className={s.mission}>
          <ClassPracticeStamp number="02" checklist />
          <strong>让下一班勇士拿到情报</strong>
          <ol>
            <li>把三条情报写入交接文件。</li>
            <li>逐行读取，确认没有遗漏。</li>
          </ol>
          <p>
            完成标准：
            <br />
            <b>3 条情报，各占 1 行。</b>
          </p>
        </aside>
        <figure className={s.entryPicture}>
          <div className={s.handoffFrame}>
            <img
              src={`${assetBase}/assets/handoff-act-03.png`}
              alt="勇士和小派准备将三种恶魔的情报保存成文件，交给等待换班的伙伴。"
            />
          </div>
          <figcaption>把已经查到的情报，留给下一班勇士。</figcaption>
        </figure>
      </div>
    </LessonStage>
  );
}
const steps = [
  {
    label: '① 写入交接记录',
    lines: [0, 1, 2, 3, 4, 6, 7, 8, 9],
    title: '文件里应有三行',
    panel: 0,
    caption: '勇士：“把三条情报存好，留给接班伙伴！”',
    tip: '"\\n" 写进文件，让每条情报各占一行。',
  },
  {
    label: '② 逐行读取核对',
    lines: [11, 12, 13],
    title: '逐行读取的输出',
    panel: 1,
    caption: '接班勇士：“一条一条读，核对有没有遗漏。”',
    tip: '文件里已有 "\\n"；end="" 只控制屏幕打印，不再多添换行。',
  },
];
export function ReportPractice() {
  const [state, update] = usePageState({ handoffStep: 0 });
  const step = steps[state.handoffStep];
  return (
    <LessonStage
      title="写好交接记录，逐行读取核对"
      label="CLASS PRACTICE · 课堂练习 02"
    >
      <div className={s.workspace}>
        <div className={s.code}>
          <NotebookPanel
            compact
            title="第三课练习.ipynb · 完整代码"
            cells={[{ code: REPORT_COMPLETE_CODE, activeLines: step.lines }]}
          />
          <p>亲手输入并运行：生成 handover.txt，输出三条情报，每条一行。</p>
        </div>
        <aside className={s.detail}>
          <fieldset className={s.stepTabs} aria-label="练习流程与代码对应">
            {steps.map((item, index) => (
              <button
                key={item.label}
                aria-pressed={state.handoffStep === index}
                onClick={() => update({ handoffStep: index })}
              >
                {item.label}
              </button>
            ))}
          </fieldset>
          <figure className={s.comic}>
            <div className={s.comicFrame}>
              <img
                src={`${assetBase}/assets/practice-shift-handoff.png`}
                style={{ transform: `translateX(-${step.panel * 50}%)` }}
                alt={step.caption}
              />
            </div>
            <figcaption>{step.caption}</figcaption>
          </figure>
          <section className={s.result} aria-live="polite">
            <h3>{step.title} · 核对标准</h3>
            <code>./handover.txt</code>
            <pre>{REPORT_OUTPUT}</pre>
            <p className={s.tip}>{step.tip}</p>
          </section>
          <PracticeTools
            code={REPORT_COMPLETE_CODE}
            output={`${REPORT_OUTPUT}\n`}
            note="在 Notebook 中亲手输入全部代码，从上到下运行。先将 reports 中的三条情报写入 ./handover.txt，再用 for line in f 逐行读取。w 会覆盖同名交接文件。核对输出为三条情报，每条一行，没有多余空行。"
          />
        </aside>
      </div>
    </LessonStage>
  );
}
