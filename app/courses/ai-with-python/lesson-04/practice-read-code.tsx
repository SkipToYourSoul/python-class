'use client';

import { usePageState } from '@/components/course/lesson-state';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { LessonStage, PracticeTools, RecordTable, Tabs } from './lesson-ui';
import { records } from './investigation-data';
import { codeBlocks } from './practice-content';
import outputs from '@/public/courses/ai-with-python/lesson-04/practice/reference-outputs.json';
import s from './practice-read-code.module.css';

const keys = ['load', 'info', 'row', 'select'] as const;
const names = ['读取五列', '检查全表', '取出一行', '选出三列'];

export function PracticeReadCode() {
  const [state, update] = usePageState({
    step: 0,
    checkedByKey: {} as Record<string, boolean>,
  });
  const step = Math.max(0, Math.min(3, state.step));
  const key = keys[step];
  return (
    <LessonStage
      title="一格一格运行，逐步核对结果"
      label="CLASS PRACTICE · 课堂练习 02"
      footer={
        <PracticeTools code={keys.map((k) => codeBlocks[k]).join('\n\n')} />
      }
    >
      <Tabs
        labels={names.map((name, i) => `${i + 1} ${name}`)}
        value={step}
        onChange={(step) => update({ step })}
      />
      <div className={s.workspace}>
        <div className={s.code}>
          <NotebookPanel
            title="第四课练习.ipynb · 分成 4 个代码单元格"
            compact
            cells={keys.map((k, i) => ({
              code: codeBlocks[k],
              activeLines:
                i === step ? codeBlocks[k].split('\n').map((_, n) => n) : [],
            }))}
          />
          <p className={s.instruction}>
            CSV 与笔记本放在一起。从第 1 格开始，用 Shift + Enter 逐格运行。
          </p>
        </div>
        <section
          className={s.result}
          aria-label={`第 ${step + 1} 个单元格的输出示例`}
        >
          <h3>
            第 {step + 1} 格 · {names[step]}
          </h3>
          <div className={s.output}>
            {key === 'load' ? (
              <RecordTable
                full
                items={records.slice(0, 5)}
                caption="df.head() 输出示例 · 5 行 × 5 列"
              />
            ) : key === 'select' ? (
              <RecordTable
                compact
                items={records.slice(0, 5)}
                caption="focus.head() 输出示例 · 5 行 × 3 列"
              />
            ) : (
              <>
                <p className={s.caption}>
                  {key === 'info'
                    ? 'df.info() 原始输出示例'
                    : 'df.iloc[0] 输出示例 · 第一行的全部 5 个字段'}
                </p>
                <pre>{outputs[key].trimEnd()}</pre>
              </>
            )}
          </div>
          <button
            aria-pressed={Boolean(state.checkedByKey[key])}
            onClick={() =>
              update({
                checkedByKey: {
                  ...state.checkedByKey,
                  [key]: !state.checkedByKey[key],
                },
              })
            }
          >
            {state.checkedByKey[key]
              ? '已核对本格输出'
              : '我已运行并核对本格输出'}
          </button>
        </section>
      </div>
    </LessonStage>
  );
}
