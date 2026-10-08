/* oxlint-disable next/no-img-element -- Existing classroom character art. */
'use client';
import { ArrowRight } from 'lucide-react';
import { usePageState } from '@/components/course/lesson-state';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { FileSheet, Guide, LessonStage } from './lesson-ui';
import { LINE_BY_LINE, REPORT_OUTPUT } from './practice-content';
import { CsvConcept, CsvCode } from './csv-scenes';
import { WorkshopScene } from './workshop-scene';
import s from './lesson.module.css';

export function OrganizeScene({ id }: { id: string }) {
  if (id === 'l3-lines') return <Lines />;
  if (id === 'l3-csv') return <CsvConcept />;
  if (id === 'l3-csv-code') return <CsvCode />;
  return <WorkshopScene />;
}
function Lines() {
  const [state, update] = usePageState({ step: 0 });
  const records = REPORT_OUTPUT.split('\n');
  return (
    <LessonStage title="读回档案，逐条核对" label="REVIEW · 用保存的情报守城">
      <NotebookPanel
        compact
        title="第三课练习.ipynb"
        cells={[{ code: LINE_BY_LINE, activeLines: [1, 2] }]}
      />
      <div className={s.two}>
        <FileSheet name="handover.txt">
          <ol className={s.lineList}>
            {records.map((record, index) => (
              <li key={record} data-active={state.step === index}>
                {record}
              </li>
            ))}
          </ol>
        </FileSheet>
        <div className={`${s.paper} ${s.center}`}>
          <span className={s.small}>逐行读取示意</span>
          <h3>这一次，line 里是……</h3>
          <p>{records[state.step]}</p>
          <button
            className={s.primary}
            onClick={() => update({ step: (state.step + 1) % records.length })}
          >
            {state.step === records.length - 1 ? '从第一行重看' : '读取下一行'}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
      <Guide>
        <strong>for line in f</strong>{' '}
        每次处理一行。文件很大时，不必把全部文字一次读进内存。
        <strong>end=&quot;&quot;</strong> 避免再多打印一个换行。
      </Guide>
    </LessonStage>
  );
}
