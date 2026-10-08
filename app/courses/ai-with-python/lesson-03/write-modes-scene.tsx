/* oxlint-disable next/no-img-element -- Local classroom comic illustration. */
'use client';

import { ArrowRight, FileText } from 'lucide-react';
import { usePageState } from '@/components/course/lesson-state';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { assetBase } from './lesson-data';
import { Guide, LessonStage } from './lesson-ui';
import s from './write-modes.module.css';

type ModeState = {
  access: 'r' | 'w';
  step: 'ready' | 'opened' | 'done';
};

const initial: ModeState = { access: 'r', step: 'ready' };
const oldRecord = '炎角兽怕强光。';
const newRecord = '藤甲魔怕火。';

export function WriteModesScene() {
  const [state, update] = usePageState(initial);
  const writing = state.access === 'w';
  const content =
    !writing || state.step === 'ready'
      ? oldRecord
      : state.step === 'opened'
        ? ''
        : newRecord;
  const caption =
    state.step === 'done'
      ? writing
        ? '勇士：新情报写好了，合上档案！'
        : '勇士：读到了！原记录还在。'
      : state.step === 'opened'
        ? writing
          ? '管理员：旧记录已清空，现在是空档案。'
          : '管理员：档案已打开，旧记录还在。'
        : '勇士：打开这份旧档案，内容会变吗？';
  const explanation =
    state.step === 'ready'
      ? '先猜一猜：用这两种模式打开，旧情报会怎样？'
      : writing
        ? state.step === 'opened'
          ? 'w 在打开时就清空旧内容，还没执行 write()！'
          : 'write() 写入新情报；离开 with 后，文件自动关闭。'
        : 'r 读取原有内容，不会改变文件里的记录。';
  const message =
    state.step === 'ready'
      ? '每次从同一份旧档案开始，比较 r 和 w。'
      : state.step === 'opened'
        ? writing
          ? '打开后：旧内容已清空，尚未写入。'
          : '打开后：旧内容保留，等待读取。'
        : writing
          ? '写入完成，文件已关闭。'
          : `读取结果：${oldRecord}文件已关闭。`;
  const comicStep = writing ? (state.step === 'done' ? 2 : 0) : 0;
  const showOriginal = !writing || state.step === 'ready';
  const actionLabel =
    state.step === 'ready'
      ? '1. 打开文件'
      : state.step === 'opened'
        ? writing
          ? '2. 写入新情报'
          : '2. 读取内容'
        : '再试一次';

  function advance() {
    update({
      step:
        state.step === 'ready'
          ? 'opened'
          : state.step === 'opened'
            ? 'done'
            : 'ready',
    });
  }

  return (
    <LessonStage title="借阅旧档案，还是重新写？" label="MODE · 文件操作模拟">
      <div className={s.workspace}>
        <div className={s.lab}>
          <NotebookPanel
            compact
            title="第三课练习.ipynb"
            cells={[
              {
                code: `path = "./notes.txt"\nwith open(path, "${state.access}", encoding="utf-8") as f:\n    ${writing ? `f.write("${newRecord}")` : 'text = f.read()'}`,
                activeLines:
                  state.step === 'done'
                    ? [2]
                    : state.step === 'ready'
                      ? [0, 1]
                      : [1],
              },
            ]}
          />
          <div className={s.controls}>
            <fieldset aria-label="打开模式" className={s.modes}>
              {(['r', 'w'] as const).map((access) => (
                <button
                  key={access}
                  aria-pressed={state.access === access}
                  onClick={() => update({ access, step: 'ready' })}
                >
                  {access} · {access === 'r' ? '读取' : '写入'}
                </button>
              ))}
            </fieldset>
            <button className={s.advanceButton} onClick={advance}>
              {actionLabel}
            </button>
          </div>
          <div className={s.comparison} aria-label="文件内容前后对照">
            <section>
              <h3>
                <FileText size={22} aria-hidden="true" />
                打开前
              </h3>
              <p>{oldRecord}</p>
            </section>
            <ArrowRight className={s.arrow} size={24} aria-hidden="true" />
            <section data-current="true">
              <h3>
                <FileText size={22} aria-hidden="true" />
                当前文件
              </h3>
              <p>{content || '（空文件）'}</p>
            </section>
          </div>
          <output className={s.feedback} aria-live="polite">
            {message}
          </output>
        </div>
        <figure className={s.comic}>
          <div className={s.comicFrame}>
            <img
              src={`${assetBase}/assets/${showOriginal ? 'write-archive-records.png' : 'write-archive-journey.png'}`}
              alt={
                comicStep === 2
                  ? '勇士把写好的情报档案归还档案架'
                  : showOriginal
                    ? '勇士和管理员一起阅读档案里的原有记录'
                    : '档案馆管理员向勇士递交空档案'
              }
              style={{ transform: `translateX(-${(comicStep * 100) / 3}%)` }}
            />
          </div>
          <figcaption>{caption}</figcaption>
          <div className={s.rule}>
            <strong>{writing ? 'w · 写入' : 'r · 读取'}</strong>
            <span>{writing ? '已有 → 清空后写' : '已有 → 保留原文'}</span>
            <span>{writing ? '没有 → 创建文件' : '没有 → 报错'}</span>
          </div>
        </figure>
      </div>
      <Guide>{explanation}</Guide>
    </LessonStage>
  );
}
