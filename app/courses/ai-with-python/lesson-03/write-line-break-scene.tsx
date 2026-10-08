'use client';

import { FileText } from 'lucide-react';
import { usePageState } from '@/components/course/lesson-state';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { CodeDialog, Guide, LessonStage, Steps } from './lesson-ui';
import { practiceSource } from './practice-content';
import s from './write-line-break.module.css';

const examples = [
  {
    code: practiceSource.codes.WRITE_JOINED_LINES,
    content: practiceSource.joinedLines,
    prediction: '连续写两条，它们会自动分成两行吗？',
    explanation: 'write() 不会自动换行。第二次写入，会接在上一段文字后面。',
  },
  {
    code: practiceSource.codes.WRITE_SEPARATE_LINES,
    content: practiceSource.separateLines,
    prediction: '每条末尾加上 "\\n"，会怎样？',
    explanation:
      '"\\n" 是一个换行符。把它写进文件，下一条记录就从新的一行开始。',
  },
] as const;

export function WriteLineBreakScene() {
  const [state, update] = usePageState({
    step: 0,
    joinedRevealed: false,
    separateRevealed: false,
  });
  const example = examples[state.step];
  const revealed =
    state.step === 0 ? state.joinedRevealed : state.separateRevealed;
  const lines = example.content.trimEnd().split('\n');

  return (
    <LessonStage
      title="写了两次，为什么挤在一行？"
      label="WRITE LINES · 让记录各占一行"
      footer={
        <Guide>
          {revealed
            ? example.explanation
            : '先观察代码、预测文件里的内容，再打开示意核对。'}
        </Guide>
      }
    >
      <Steps
        labels={['连续写两条', '加上换行符 \\n']}
        value={state.step}
        onChange={(step) => update({ step })}
      />
      <div className={s.workspace}>
        <div className={s.code}>
          <NotebookPanel
            compact
            title="第三课练习.ipynb · 完整写入代码"
            cells={[{ code: example.code, activeLines: [2, 3] }]}
          />
          <p>两次调用 write()，中间没有重新打开文件。</p>
          <CodeDialog
            code={example.code}
            output={example.content}
            outputLabel="文件内容示例"
            note="在练习文件夹的 Notebook 中输入并运行。写入代码没有 print，输出区为空；到 JupyterLab 文件列表打开 line-break-test.txt，观察实际内容。两份示例写入同一文件，后运行的代码会覆盖前一次内容。"
          />
        </div>
        <section className={s.file} aria-label="连续写入后的文件内容示意">
          <header>
            <FileText size={26} aria-hidden="true" />
            <strong>line-break-test.txt</strong>
            <span>内容示意</span>
          </header>
          <div className={s.fileBody} aria-live="polite">
            <h3>{example.prediction}</h3>
            {revealed ? (
              <div className={s.result}>
                <strong>文件里有 {lines.length} 行记录</strong>
                <div className={s.lines}>
                  {lines.map((line, index) => (
                    <div key={line}>
                      <span>{index + 1}</span>
                      <code>{line}</code>
                    </div>
                  ))}
                </div>
                <p>
                  {state.step === 0
                    ? '调用两次 write()，并不等于写出两行。'
                    : '加上换行符，记录就各占一行。'}
                </p>
              </div>
            ) : (
              <p className={s.hiddenContent}>先说说你的预测，再查看文件。</p>
            )}
            <button
              onClick={() =>
                update(
                  state.step === 0
                    ? { joinedRevealed: !revealed }
                    : { separateRevealed: !revealed },
                )
              }
            >
              {revealed ? '隐藏内容，再预测' : '查看文件内容'}
            </button>
          </div>
        </section>
      </div>
    </LessonStage>
  );
}
