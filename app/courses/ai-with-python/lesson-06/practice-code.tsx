'use client';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { Page, CodeTools, Jump } from './lesson-ui';
import * as code from './practice-content';
import s from './lesson.module.css';
const compact = (source: string) =>
  source
    .split('\n')
    .filter((line) => line.trim())
    .join('\n');
const exercises = {
  current: {
    title: '重新走完数据全流程',
    complete: code.CURRENT_CODE,
    columns: [
      [
        {
          title: '01 获取新情报 → 02 保存 boss.csv',
          code: code.CURRENT_FETCH_CODE,
        },
      ],
      [
        {
          title: '03 筛选比较 → 04 画魔王弱点图',
          code: code.CURRENT_ANALYZE_CODE,
        },
      ],
    ],
  },
} as const;
function Result() {
  return (
    <div className={s.practiceResult}>
      <strong>这次的证据在 boss.csv</strong>
      <p>先筛选可破罩部位，再找最低防御与对应弱点。</p>
      <Jump id="l6-battle">提交魔王作战指令</Jump>
    </div>
  );
}
export function PracticeCode({ number }: { number: keyof typeof exercises }) {
  const item = exercises[number];
  return (
    <div className={s.fullPracticePage}>
      <Page title={item.title} label="FINAL CHALLENGE · 决战准备">
        <div className={s.practiceActions}>
          <CodeTools code={compact(item.complete)} />
        </div>
        <div className={s.practiceCodeGrid}>
          {item.columns.map((sections, i) => (
            <div className={s.practiceCodeColumn} key={i}>
              {sections.map((section) => (
                <div className={s.practiceNotebook} key={section.title}>
                  <NotebookPanel
                    title={section.title}
                    compact
                    cells={[{ code: compact(section.code) }]}
                  />
                </div>
              ))}
              {i === 0 && <Result />}
            </div>
          ))}
        </div>
      </Page>
    </div>
  );
}
