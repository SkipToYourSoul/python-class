'use client';

import { useState } from 'react';
import { Copy, Send } from 'lucide-react';
import { ClassPracticeStamp } from '@/components/course/ai-with-python/practice-templates';
import { PracticeStoryVideo } from '@/components/course/ai-with-python/practice-story-video';
import { usePageState } from '@/components/course/lesson-state';
import { Page } from './lesson-ui';
import {
  PRACTICE_03_FILL_ANSWERS,
  PRACTICE_03_FILL_CODE,
  PRACTICE_03_FILL_SECTIONS,
} from './practice-content';
import s from './class-practice-three.module.css';

const questions = [
  '读取自己保存的 CSV',
  '选择折线图方法',
  '横轴表示观测时刻',
  '纵轴表示外罩强度',
  '按魔塔分类着色',
  '选择散点图方法',
  '横轴表示守卫防御力',
  '保存散点图文件',
];

// Keep all source lines visible: the short reading cell sits beside the two charts.
const chartStart = PRACTICE_03_FILL_SECTIONS[0].code.indexOf('\n\nplt.figure');
const displaySections = [
  {
    title: '读取自己保存的情报',
    code: PRACTICE_03_FILL_SECTIONS[0].code.slice(0, chartStart),
  },
  {
    title: '折线找时刻 → 散点比防御',
    code: `${PRACTICE_03_FILL_SECTIONS[0].code.slice(chartStart + 2)}\n\n${PRACTICE_03_FILL_SECTIONS[1].code}`,
  },
];

const sectionOffsets = displaySections.map((_, index, sections) =>
  sections
    .slice(0, index)
    .reduce(
      (count, section) => count + (section.code.match(/____/g)?.length || 0),
      0,
    ),
);

export function ClassPracticeThree() {
  const [state, update] = usePageState({
    classThreeAnswers: PRACTICE_03_FILL_ANSWERS.map(() => ''),
    classThreeCheckedAnswers: PRACTICE_03_FILL_ANSWERS.map(() => ''),
    classThreeHasChecked: false,
  });
  const [copyStatus, setCopyStatus] = useState('');
  const correct = PRACTICE_03_FILL_ANSWERS.map(
    (answer, index) => answer === state.classThreeCheckedAnswers[index]?.trim(),
  );
  const correctCount = correct.filter(Boolean).length;
  const changed = state.classThreeAnswers.some(
    (answer, index) => answer !== state.classThreeCheckedAnswers[index],
  );
  let answerIndex = 0;
  const currentCode = PRACTICE_03_FILL_CODE.replace(/____/g, () => {
    const answer = state.classThreeAnswers[answerIndex++]?.trim();
    return answer || '____';
  });

  function renderCode(sectionIndex: number) {
    return (
      <section
        className={s.notebook}
        aria-label={displaySections[sectionIndex].title}
      >
        <div className={s.notebookTitle}>
          <span>{sectionIndex === 0 ? '01' : '02 → 03'}</span>
          {displaySections[sectionIndex].title}
        </div>
        <pre className={s.code}>
          {displaySections[sectionIndex].code
            .split('____')
            .map((part, index, parts) => {
              const answer = sectionOffsets[sectionIndex] + index;
              const edited =
                state.classThreeAnswers[answer] !==
                state.classThreeCheckedAnswers[answer];
              const showResult = state.classThreeHasChecked && !edited;
              return (
                <span key={index}>
                  {part}
                  {index < parts.length - 1 && (
                    <input
                      id={`l6-class-03-answer-${answer + 1}`}
                      aria-label={`课堂练习 03 第 ${answer + 1} 空：${questions[answer]}`}
                      aria-invalid={showResult && !correct[answer]}
                      aria-describedby={`l6-class-03-status-${answer + 1}`}
                      data-result={
                        showResult
                          ? correct[answer]
                            ? 'correct'
                            : 'retry'
                          : 'blank'
                      }
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      maxLength={40}
                      placeholder={`${answer + 1}`}
                      style={{
                        width: `${Math.max(PRACTICE_03_FILL_ANSWERS[answer].length, 4) + 1}ch`,
                      }}
                      value={state.classThreeAnswers[answer]}
                      onChange={(event) => {
                        const answers = [...state.classThreeAnswers];
                        answers[answer] = event.target.value;
                        update({ classThreeAnswers: answers });
                        setCopyStatus('');
                      }}
                    />
                  )}
                </span>
              );
            })}
        </pre>
      </section>
    );
  }

  return (
    <div className={s.practice}>
      <Page
        title="补齐代码，用图表核对作战计划"
        label="CLASS PRACTICE · 课堂练习 03"
      >
        <form
          className={s.form}
          onSubmit={(event) => {
            event.preventDefault();
            update({
              classThreeCheckedAnswers: [...state.classThreeAnswers],
              classThreeHasChecked: true,
            });
          }}
        >
          <div className={s.columns}>
            <div className={s.inspection}>
              {renderCode(0)}
              <div className={s.videoPanel}>
                <ClassPracticeStamp number="03" checklist />
                <PracticeStoryVideo
                  pageId="l6-practice-03"
                  title="三队攻塔战役"
                  src="/courses/ai-with-python/lesson-06/assets/tower-assault-wan3-v1.mp4"
                  poster="/courses/ai-with-python/lesson-06/assets/tower-assault.jpg"
                  description="三支队伍依次突破魔塔：北塔用强光解开外罩，东塔用火焰清开藤蔓，西塔用热量融开冰层。"
                  descriptionTrack="/courses/ai-with-python/lesson-06/assets/tower-assault-wan3-v1.zh.vtt"
                  initialDuration={15}
                  initialCaption="三队按时刻与弱点，发起进攻。"
                  phases={[
                    { from: 0, text: '北塔：强光解开外罩。' },
                    { from: 5, text: '东塔：火焰清开藤蔓。' },
                    { from: 10, text: '西塔：热量融开冰层。' },
                    { from: 13.5, text: '三塔通道已打开，队伍继续前进。' },
                  ]}
                  compact
                />
              </div>
              <p className={s.target}>
                填 8
                空，运行并保存两图。比较虚线下同塔候选的防御，说明三队的时刻、装备与数据依据。
              </p>
            </div>
            {renderCode(1)}
          </div>
          <div className={s.actions}>
            <button type="submit" className={s.submit}>
              <Send aria-hidden="true" />
              {state.classThreeHasChecked ? '再次核对' : '核对答案'}
            </button>
            <p className={s.summary} aria-live="polite">
              {!state.classThreeHasChecked
                ? '填好后，一起核对。'
                : changed
                  ? '已修改答案，请再次核对。'
                  : correctCount === PRACTICE_03_FILL_ANSWERS.length
                    ? '全部答对！运行两张图，说出三队的进攻依据。'
                    : `已答对 ${correctCount}/8 个空，修改红框再试。`}
            </p>
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
          <div className={s.accessibleStatus}>
            {questions.map((question, index) => (
              <span id={`l6-class-03-status-${index + 1}`} key={question}>
                {!state.classThreeHasChecked
                  ? '尚未核对'
                  : state.classThreeAnswers[index] !==
                      state.classThreeCheckedAnswers[index]
                    ? '已修改，等待核对'
                    : correct[index]
                      ? '答对了'
                      : '再想一想，修改后重新核对'}
              </span>
            ))}
          </div>
        </form>
      </Page>
    </div>
  );
}
