/* oxlint-disable next/no-img-element -- Reuse the course's panda artwork. */
'use client';

import { FileSpreadsheet, ArrowDown, Table2 } from 'lucide-react';
import { records } from './investigation-data';
import { Guide, RecordTable } from './lesson-ui';
import s from './load-evidence.module.css';

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
        <Guide>这一步只导入工具，还没有读取战报，也没有表格输出。</Guide>
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
        <Guide>整份战报存入 df；赋值后还没有打印表格。</Guide>
      </section>

      <section className={s.panel} aria-hidden={step !== 2} inert={step !== 2}>
        <RecordTable
          items={records.slice(0, 5)}
          full
          caption="df.head() · 前 5 行，全部 5 列"
        />
        <Guide>五列都在！这里只查看前五行，df 仍有 {records.length} 行。</Guide>
      </section>
    </div>
  );
}
