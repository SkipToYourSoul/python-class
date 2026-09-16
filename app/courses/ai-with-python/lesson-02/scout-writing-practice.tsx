'use client';

import { useState } from 'react';
import { Stage, ClassPracticeStamp } from '../lesson-01/lesson-ui';
import { NotebookPanel } from './notebook-panels';
import { usePageState } from './lesson-state';
import { ScoutHtmlDialog } from './scout-html-dialog';
import { scoutUrl } from './lesson-data';
import s from './lesson.module.css';

export const scoutWritingCode = `import requests

url = "${scoutUrl}"
res = requests.get(url, timeout=10)
res.encoding = "utf-8"
if res.status_code == 200:
    print(res.text)
else:
    print("请求失败：", res.status_code)`;

const checks = [
  ['跟写', '在新单元格中输入完整代码。'],
  ['运行', '按 Shift + Enter，看到 HTML 输出。'],
  ['核对', '找出 HTML 中的三个恶魔名字。'],
];

export function ScoutWritingPractice() {
  const [v, set] = usePageState({ checked: [false, false, false] });
  const [copyStatus, setCopyStatus] = useState('复制完整代码');
  const completed = v.checked.filter(Boolean).length;
  return (
    <Stage
      title="在 HTML 中找到三个恶魔"
      label="CLASS PRACTICE · 课堂练习 01"
      footer={
        <div className={s.writingFooter}>
          <p>跟写并运行代码，在 HTML 输出中寻找名字。</p>
          <div className={s.writingFooterActions}>
            <button
              className={s.secondary}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(scoutWritingCode);
                  setCopyStatus('已复制');
                } catch {
                  setCopyStatus('请选中左侧代码复制');
                }
              }}
            >
              {copyStatus}
            </button>
            <ScoutHtmlDialog />
          </div>
        </div>
      }
    >
      <div className={`${s.two} ${s.requestNotebookLesson}`}>
        <NotebookPanel
          title="我的第一次网页请求.ipynb"
          cells={[{ code: scoutWritingCode }]}
        />
        <aside className={s.writingTask}>
          <div className={s.writingHeading}>
            <ClassPracticeStamp number="01" checklist />
            <h3>
              找出三个
              <br />
              恶魔的名字
            </h3>
          </div>
          <div className={s.writingChecks}>
            {checks.map(([title, text], i) => (
              <label key={title}>
                <input
                  type="checkbox"
                  checked={v.checked[i]}
                  onChange={() =>
                    set({
                      checked: v.checked.map((value, j) =>
                        i === j ? !value : value,
                      ),
                    })
                  }
                />
                <span>
                  <strong>{title}</strong>
                  {text}
                </span>
              </label>
            ))}
          </div>
          <div className={s.writingProgress}>
            <span aria-live="polite">自查 {completed} / 3</span>
            <button
              className={s.secondary}
              onClick={() => set({ checked: [false, false, false] })}
            >
              重新自查
            </button>
          </div>
          <p className={s.writingHint}>
            名字藏在 &lt;h2&gt; 标签里。先自己找，再打开完整 HTML 核对。
          </p>
        </aside>
      </div>
    </Stage>
  );
}
