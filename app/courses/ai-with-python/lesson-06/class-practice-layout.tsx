'use client';

import type { ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';
import { ClassPracticeStamp } from '@/components/course/ai-with-python/practice-templates';
import { Page } from './lesson-ui';
import type { usePracticeWordFill } from './practice-word-fill';
import s from './class-practice-layout.module.css';

export function ClassPracticeLayout({
  number,
  title,
  codeLabel,
  exercise,
  children,
}: {
  number: '01' | '02' | '03';
  title: string;
  codeLabel: string;
  exercise: ReturnType<typeof usePracticeWordFill>;
  children: ReactNode;
}) {
  const {
    attachForm,
    checkAnswers,
    canClearBlank,
    clearSelectedBlank,
    copyCode,
    copyStatus,
    renderCode,
    bank,
    hasChecked,
    summary,
    overlay,
    status,
  } = exercise;
  return (
    <div className={s.practice}>
      <Page title={title} label={`CLASS PRACTICE · 课堂练习 ${number}`}>
        <form
          className={s.form}
          ref={attachForm}
          onSubmit={(event) => {
            event.preventDefault();
            checkAnswers();
          }}
        >
          <div className={s.columns} data-practice-number={number}>
            <div className={s.videoPanel}>
              <ClassPracticeStamp number={number} checklist />
              {children}
            </div>
            <div className={s.answerColumn}>
              <section
                className={s.notebook}
                aria-label={codeLabel}
                data-scroll-code={number === '03' || undefined}
              >
                <div className={s.notebookTitle}>
                  <span>第六课练习.ipynb</span>
                  <div className={s.notebookActions}>
                    <button
                      type="button"
                      disabled={!canClearBlank}
                      onClick={clearSelectedBlank}
                    >
                      清空此空
                    </button>
                    <button type="button" onClick={copyCode}>
                      <Copy aria-hidden="true" />
                      <span aria-live="polite">
                        {copyStatus || '复制当前代码'}
                      </span>
                    </button>
                  </div>
                </div>
                <pre className={s.code}>{renderCode()}</pre>
              </section>
              {bank}
              <div className={s.actions}>
                <button type="submit" className={s.submit}>
                  <Check aria-hidden="true" />
                  {hasChecked ? '再次核对' : '核对答案'}
                </button>
                <p className={s.summary} aria-live="polite">
                  {summary}
                </p>
              </div>
            </div>
          </div>
          {overlay}
          {status}
        </form>
      </Page>
    </div>
  );
}
