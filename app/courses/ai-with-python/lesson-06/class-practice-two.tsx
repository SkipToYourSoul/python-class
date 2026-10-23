'use client';

import { useState } from 'react';
import { Copy, Send } from 'lucide-react';
import { ClassPracticeStamp } from '@/components/course/ai-with-python/practice-templates';
import { PracticeStoryVideo } from '@/components/course/ai-with-python/practice-story-video';
import { usePageState } from '@/components/course/lesson-state';
import { Page } from './lesson-ui';
import {
  PRACTICE_02_FILL_ANSWERS,
  PRACTICE_02_FILL_CODE,
  PRACTICE_02_FILL_SECTIONS,
} from './practice-content';
import s from './class-practice-two.module.css';

const questions = [
  '读取 CSV 情报文件',
  '查看前几条记录',
  '查看数据的整体信息',
  '按魔塔与弱点分组',
  '计算平均外罩强度',
  '统计守卫数量',
  '筛选外罩强度这一列',
  '按魔塔和防御力排序',
];

const sectionOffsets = PRACTICE_02_FILL_SECTIONS.map((_, index, sections) =>
  sections
    .slice(0, index)
    .reduce(
      (count, section) => count + (section.code.match(/____/g)?.length || 0),
      0,
    ),
);

export function ClassPracticeTwo() {
  const [state, update] = usePageState({
    classTwoAnswers: PRACTICE_02_FILL_ANSWERS.map(() => ''),
    classTwoCheckedAnswers: PRACTICE_02_FILL_ANSWERS.map(() => ''),
    classTwoHasChecked: false,
  });
  const [copyStatus, setCopyStatus] = useState('');
  const correct = PRACTICE_02_FILL_ANSWERS.map(
    (answer, index) => answer === state.classTwoCheckedAnswers[index]?.trim(),
  );
  const correctCount = correct.filter(Boolean).length;
  const changed = state.classTwoAnswers.some(
    (answer, index) => answer !== state.classTwoCheckedAnswers[index],
  );
  let answerIndex = 0;
  const currentCode = PRACTICE_02_FILL_CODE.replace(/____/g, () => {
    const answer = state.classTwoAnswers[answerIndex++]?.trim();
    return answer || '____';
  });

  function renderCode(sectionIndex: number) {
    return (
      <section
        className={s.notebook}
        aria-label={PRACTICE_02_FILL_SECTIONS[sectionIndex].title}
      >
        <div className={s.notebookTitle}>
          <span>{sectionIndex === 0 ? '01' : '02 → 03'}</span>
          {PRACTICE_02_FILL_SECTIONS[sectionIndex].title}
        </div>
        <pre className={s.code}>
          {PRACTICE_02_FILL_SECTIONS[sectionIndex].code
            .split('____')
            .map((part, index, parts) => {
              const answer = sectionOffsets[sectionIndex] + index;
              const edited =
                state.classTwoAnswers[answer] !==
                state.classTwoCheckedAnswers[answer];
              const showResult = state.classTwoHasChecked && !edited;
              return (
                <span key={index}>
                  {part}
                  {index < parts.length - 1 && (
                    <input
                      id={`l6-class-02-answer-${answer + 1}`}
                      aria-label={`课堂练习 02 第 ${answer + 1} 空：${questions[answer]}`}
                      aria-invalid={showResult && !correct[answer]}
                      aria-describedby={`l6-class-02-status-${answer + 1}`}
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
                        width: `${Math.max(PRACTICE_02_FILL_ANSWERS[answer].length, 4) + 1}ch`,
                      }}
                      value={state.classTwoAnswers[answer]}
                      onChange={(event) => {
                        const answers = [...state.classTwoAnswers];
                        answers[answer] = event.target.value;
                        update({ classTwoAnswers: answers });
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
        title="补齐代码，部署三队作战计划"
        label="CLASS PRACTICE · 课堂练习 02"
      >
        <form
          className={s.form}
          onSubmit={(event) => {
            event.preventDefault();
            update({
              classTwoCheckedAnswers: [...state.classTwoAnswers],
              classTwoHasChecked: true,
            });
          }}
        >
          <div className={s.columns}>
            <div className={s.inspection}>
              {renderCode(0)}
              <div className={s.videoPanel}>
                <ClassPracticeStamp number="02" checklist />
                <PracticeStoryVideo
                  pageId="l6-practice-02"
                  title="三队作战部署"
                  src="/courses/ai-with-python/lesson-06/assets/strategy-wan3-v1.mp4"
                  poster="/courses/ai-with-python/lesson-06/assets/strategy-v2.jpg"
                  description="勇士对照三塔情报与地图，为三色队伍分配对应装备，交付进攻指令。"
                  descriptionTrack="/courses/ai-with-python/lesson-06/assets/strategy-wan3-v1.zh.vtt"
                  initialDuration={12}
                  initialCaption="勇士对照情报，部署三队。"
                  phases={[
                    { from: 0, text: '对照情报与地图，找出突破时刻。' },
                    { from: 4, text: '按守卫弱点，为三色队伍分配装备。' },
                    { from: 8, text: '交付作战指令，三队准备出发。' },
                  ]}
                  compact
                />
              </div>
              <p className={s.target}>
                填 8 空：检查 → 统计 → 筛选。运行核对三塔统计；找出外罩低于
                30、防御较低的时刻，按弱点配装备。
              </p>
            </div>
            {renderCode(1)}
          </div>
          <div className={s.actions}>
            <button type="submit" className={s.submit}>
              <Send aria-hidden="true" />
              {state.classTwoHasChecked ? '再次核对' : '核对答案'}
            </button>
            <p className={s.summary} aria-live="polite">
              {!state.classTwoHasChecked
                ? '填好后，一起核对。'
                : changed
                  ? '已修改答案，请再次核对。'
                  : correctCount === PRACTICE_02_FILL_ANSWERS.length
                    ? '全部答对！运行代码，为三支队伍制定计划。'
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
              <span id={`l6-class-02-status-${index + 1}`} key={question}>
                {!state.classTwoHasChecked
                  ? '尚未核对'
                  : state.classTwoAnswers[index] !==
                      state.classTwoCheckedAnswers[index]
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
