/* oxlint-disable next/no-img-element -- Reuse the course's panda artwork. */
'use client';

import { FileSpreadsheet, ArrowDown, Table2 } from 'lucide-react';
import { records } from './investigation-data';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { Guide, LessonStage, RecordTable, Tabs } from './lesson-ui';
import { codeBlocks } from './practice-content';
import s from './load-evidence.module.css';

export function LoadScene({
  step,
  onStep,
}: {
  step: number;
  onStep: (step: number) => void;
}) {
  const explanations = [
    'import pandas as pd：给工具包起一个简写名 pd。这一步只导入工具，还没有读取战报。',
    `read_csv() 读取 CSV，df 保存完整的 ${records.length} 行、5 列；赋值后还没有打印表格。`,
    `head() 默认查看前五行，五列全部保留；df 仍有 ${records.length} 行。`,
  ];

  return (
    <LessonStage title="把 CSV 读成一张表" label="SMELL · 闻 / 读取">
      <Tabs
        labels={['导入工具', '读入文件', '查看前五行']}
        value={step}
        onChange={onStep}
      />
      <div className={s.workspace}>
        <div className={s.code}>
          <NotebookPanel
            title="第四课练习.ipynb"
            compact
            cells={[{ code: codeBlocks.load, activeLines: [[0, 2, 3][step]] }]}
          />
          <div className={s.source}>
            <FileSpreadsheet aria-hidden="true" />
            <div>
              <strong>attack-records.csv</strong>
              <p>与当前笔记本放在同一文件夹</p>
            </div>
          </div>
        </div>
        <LoadEvidence step={step} />
      </div>
      <Guide>
        {explanations[step]}
        <br />
        从上到下运行代码，观察每一步的结果。
      </Guide>
    </LessonStage>
  );
}

export function LoadEvidence({ step }: { step: number }) {
  return (
    <div className={s.panels} aria-label="当前代码对应的示意与输出">
      <section className={s.panel} aria-hidden={step !== 0} inert={step !== 0}>
        <div className={s.tool}>
          <img
            src="/courses/ai-with-python/lesson-04/assets/turtle-panda-helpers.png"
            alt="熊猫博士带来处理表格的工具"
          />
          <div>
            <h3>请来 pandas</h3>
            <p>
              以后用简写 <strong>pd</strong> 来调用它。
            </p>
          </div>
        </div>
        <p className={s.alias}>
          <code>pandas</code>
          <span>→</span>
          <code>pd</code>
        </p>
      </section>

      <section className={s.panel} aria-hidden={step !== 1} inert={step !== 1}>
        <div className={s.reading}>
          <div className={s.file}>
            <FileSpreadsheet aria-hidden="true" />
            <span>attack-records.csv</span>
          </div>
          <div className={s.arrow}>
            <ArrowDown aria-hidden="true" />
            <code>read_csv()</code>
          </div>
          <div className={s.dataframe}>
            <Table2 aria-hidden="true" />
            <div>
              <strong>df · DataFrame</strong>
              <p>全部 {records.length} 行 × 5 列</p>
            </div>
          </div>
        </div>
      </section>

      <section className={s.panel} aria-hidden={step !== 2} inert={step !== 2}>
        <RecordTable
          items={records.slice(0, 5)}
          full
          caption="输出示例 · df.head() · 前 5 行，全部 5 列"
        />
      </section>
    </div>
  );
}
