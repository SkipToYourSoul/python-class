'use client';

import { useState } from 'react';
import { Copy, Send } from 'lucide-react';
import { CheckpointTaskTemplate } from '@/components/course/ai-with-python/practice-templates';
import { usePageState } from '@/components/course/lesson-state';
import { PreparationScene } from './preparation-scene';
import {
  PRACTICE_01_FILL_CODE,
  PRACTICE_01_FILL_ANSWERS,
} from './practice-content';
import s from './class-practice-one.module.css';

const questions = [
  '导入获取网页的库',
  '导入解析网页的工具',
  '请求情报站网页',
  '找到网页中的情报区域',
  '填写情报区域的 id',
  '提取区域中的文字',
  '打开本地文件',
  '把情报写入文件',
];

export function ClassPracticeOne() {
  const [state, update] = usePageState({
    classFillAnswers: PRACTICE_01_FILL_ANSWERS.map(() => ''),
    classFillCheckedAnswers: PRACTICE_01_FILL_ANSWERS.map(() => ''),
    classFillHasChecked: false,
  });
  const [copyStatus, setCopyStatus] = useState('');
  const correct = PRACTICE_01_FILL_ANSWERS.map(
    (answer, index) => answer === state.classFillCheckedAnswers[index]?.trim(),
  );
  const correctCount = correct.filter(Boolean).length;
  const changed = state.classFillAnswers.some(
    (answer, index) => answer !== state.classFillCheckedAnswers[index],
  );
  let answerIndex = 0;
  const currentCode = PRACTICE_01_FILL_CODE.replace(/____/g, () => {
    const answer = state.classFillAnswers[answerIndex++]?.trim();
    return answer || '____';
  });

  return (
    <div className={s.practice}>
      <CheckpointTaskTemplate
        kind="class"
        number="01"
        title="补齐代码，带回三塔情报"
        question="把情报变成作战档案"
        instruction="填 8 个空：获取 → 提取 → 保存。"
        actionLabel="补全代码，再到 Notebook 运行"
        tip="先运行练习包的环境格。完成后打开 towers.csv，核对 8 列、36 条记录。"
        taskVisual={
          <PreparationScene
            completedSteps={[
              [0, 1, 2],
              [3, 4, 5],
              [6, 7],
            ].map((group) =>
              group.every(
                (index) =>
                  state.classFillHasChecked &&
                  correct[index] &&
                  state.classFillAnswers[index] ===
                    state.classFillCheckedAnswers[index],
              ),
            )}
          />
        }
      >
        <form
          className={s.form}
          onSubmit={(event) => {
            event.preventDefault();
            update({
              classFillCheckedAnswers: [...state.classFillAnswers],
              classFillHasChecked: true,
            });
          }}
        >
          <div className={s.notebook}>
            <div className={s.notebookTitle}>
              <span>第六课练习.ipynb</span>
              <button
                type="button"
                className={s.copy}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(currentCode);
                    setCopyStatus('已复制');
                  } catch {
                    setCopyStatus('请选中代码复制');
                  }
                }}
              >
                <Copy aria-hidden="true" />
                {copyStatus || '复制当前代码'}
              </button>
            </div>
            <pre className={s.code}>
              {PRACTICE_01_FILL_CODE.split('____').map((part, index, parts) => {
                const edited =
                  state.classFillAnswers[index] !==
                  state.classFillCheckedAnswers[index];
                const showResult = state.classFillHasChecked && !edited;
                return (
                  <span key={index}>
                    {part}
                    {index < parts.length - 1 && (
                      <input
                        id={`l6-class-01-answer-${index + 1}`}
                        aria-label={`课堂练习 01 第 ${index + 1} 空：${questions[index]}`}
                        aria-invalid={showResult && !correct[index]}
                        aria-describedby={`l6-class-01-status-${index + 1}`}
                        data-result={
                          showResult
                            ? correct[index]
                              ? 'correct'
                              : 'retry'
                            : 'blank'
                        }
                        autoComplete="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        maxLength={40}
                        placeholder={`${index + 1}`}
                        style={{
                          width: `${Math.max(PRACTICE_01_FILL_ANSWERS[index].length, 4) + 1}ch`,
                        }}
                        value={state.classFillAnswers[index]}
                        onChange={(event) => {
                          const answers = [...state.classFillAnswers];
                          answers[index] = event.target.value;
                          update({ classFillAnswers: answers });
                          setCopyStatus('');
                        }}
                      />
                    )}
                  </span>
                );
              })}
            </pre>
          </div>
          <div className={s.actions}>
            <button type="submit" className={s.submit}>
              <Send aria-hidden="true" />
              {state.classFillHasChecked ? '再次核对' : '核对答案'}
            </button>
            <p className={s.summary} aria-live="polite">
              {!state.classFillHasChecked
                ? '填好后，一起核对。'
                : changed
                  ? '已修改答案，请再次核对。'
                  : correctCount === PRACTICE_01_FILL_ANSWERS.length
                    ? '全部答对！运行代码，带回作战档案。'
                    : `已答对 ${correctCount}/8 个空，修改红框再试。`}
            </p>
          </div>
          <p className={s.tip}>
            先运行环境格；填空后在 Notebook 运行，核对8列、36条记录。
          </p>
          <div className={s.accessibleStatus}>
            {questions.map((question, index) => (
              <span id={`l6-class-01-status-${index + 1}`} key={question}>
                {!state.classFillHasChecked
                  ? '尚未核对'
                  : state.classFillAnswers[index] !==
                      state.classFillCheckedAnswers[index]
                    ? '已修改，等待核对'
                    : correct[index]
                      ? '答对了'
                      : '再想一想，修改后重新核对'}
              </span>
            ))}
          </div>
        </form>
      </CheckpointTaskTemplate>
    </div>
  );
}
