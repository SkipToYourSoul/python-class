'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { usePageState } from '@/components/course/lesson-state';
import s from './practice-word-fill.module.css';

const stateKeys = {
  '01': ['classFillAnswers', 'classFillCheckedAnswers', 'classFillHasChecked'],
  '02': ['classTwoAnswers', 'classTwoCheckedAnswers', 'classTwoHasChecked'],
  '03': [
    'classThreeAnswers',
    'classThreeCheckedAnswers',
    'classThreeHasChecked',
  ],
} as const;

type WordFlight = {
  word: string;
  index: number;
  origin: DOMRect;
};

export function usePracticeWordFill({
  number,
  source,
  expected,
  questions,
  wordBank,
  successMessage,
}: {
  number: keyof typeof stateKeys;
  source: string;
  expected: readonly string[];
  questions: readonly string[];
  wordBank: readonly string[];
  successMessage: string;
}) {
  const [answerKey, checkedKey, hasCheckedKey] = stateKeys[number];
  const [state, update] = usePageState<
    Partial<
      Record<typeof answerKey | typeof checkedKey, string[]> &
        Record<typeof hasCheckedKey, boolean>
    >
  >({});
  function readAnswers(saved: string[] | undefined) {
    if (number === '02' && saved?.length === 8) {
      // The previous exercise included head() as its second blank.
      return saved.filter((_, index) => index !== 1);
    }
    if (number === '03' && saved?.length === 8) {
      return saved.slice(0, expected.length);
    }
    return saved ?? expected.map(() => '');
  }
  const answers = readAnswers(state[answerKey]);
  const checkedAnswers = readAnswers(state[checkedKey]);
  const hasChecked = state[hasCheckedKey] ?? false;
  const id = `l6-class-${number}`;
  const [copyStatus, setCopyStatus] = useState('');
  const [selection, setSelection] = useState<number | string | null>(null);
  const [flight, setFlight] = useState<WordFlight | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const flightRef = useRef<HTMLSpanElement>(null);
  const blanks = useRef<(HTMLButtonElement | null)[]>([]);
  const words = useRef(new Map<string, HTMLSpanElement>());
  const selectedBlank = typeof selection === 'number' ? selection : null;
  const selectedWord = typeof selection === 'string' ? selection : null;
  const canClearBlank =
    selectedBlank !== null && Boolean(answers[selectedBlank]);

  useLayoutEffect(() => {
    if (!flight) return;
    const form = formRef.current;
    const chip = flightRef.current;
    const target = blanks.current[flight.index];
    if (!form || !chip || !target) return;

    const frame = form.getBoundingClientRect();
    const destination = target.getBoundingClientRect();
    const { origin } = flight;
    const startX = origin.left + origin.width / 2 - frame.left;
    const startY = origin.top + origin.height / 2 - frame.top;
    const endX = destination.left + destination.width / 2 - frame.left;
    const endY = destination.top + destination.height / 2 - frame.top;
    const position = (x: number, y: number, scale: number) =>
      `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`;

    const animation = chip.animate(
      [
        { transform: position(startX, startY, 1), opacity: 1 },
        {
          transform: position(
            (startX + endX) / 2 + 24,
            (startY + endY) / 2,
            1.08,
          ),
          opacity: 1,
        },
        { transform: position(endX, endY, 0.8), opacity: 0.85, offset: 0.88 },
        { transform: position(endX, endY, 0.72), opacity: 0 },
      ],
      { duration: 420, easing: 'cubic-bezier(.35, .05, .3, 1)', fill: 'both' },
    );
    animation.onfinish = () => setFlight(null);
    return () => animation.cancel();
  }, [flight]);

  function fillBlank(index: number, word: string) {
    const origin = words.current.get(word);
    setFlight(
      origin && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? { word, index, origin: origin.getBoundingClientRect() }
        : null,
    );
    const next = [...answers];
    next[index] = word;
    update({ [answerKey]: next });
    setSelection(null);
    setCopyStatus('');
  }

  const correct = expected.map(
    (answer, index) => answer === checkedAnswers[index]?.trim(),
  );
  const correctCount = correct.filter(Boolean).length;
  const changed = answers.some(
    (answer, index) => answer !== checkedAnswers[index],
  );
  let answerIndex = 0;
  const currentCode = source.replace(/____/g, () => {
    const answer = answers[answerIndex++]?.trim();
    return answer || '____';
  });

  function renderCode() {
    let blankIndex = 0;
    return (
      <>
        {source.split('\n').map((line, lineIndex) => {
          const comment = line
            .match(/"[^"]*"|'[^']*'|#.*/g)
            ?.find((part) => part.startsWith('#'));
          const code = comment ? line.slice(0, -comment.length) : line;
          return (
            <span key={lineIndex} className={s.codeLine}>
              {code.split('____').map((part, partIndex) => {
                if (partIndex === 0) return part;
                const index = blankIndex++;
                const answer = answers[index] ?? '';
                const showResult =
                  hasChecked && answer === checkedAnswers[index];
                return (
                  <span key={partIndex}>
                    <button
                      type="button"
                      className={s.blank}
                      ref={(node) => {
                        blanks.current[index] = node;
                      }}
                      data-receiving={flight?.index === index || undefined}
                      aria-label={`第 ${index + 1} 空，${questions[index]}，${answer || '未填写'}`}
                      aria-pressed={selectedBlank === index}
                      aria-describedby={`${id}-status-${index + 1}`}
                      data-result={
                        showResult && (correct[index] ? 'correct' : 'retry')
                      }
                      style={{
                        minWidth: `${Math.max(expected[index].length, 4) + 1}ch`,
                      }}
                      onClick={() => {
                        if (selectedWord) fillBlank(index, selectedWord);
                        else
                          setSelection(selectedBlank === index ? null : index);
                      }}
                    >
                      {answer.length > 14
                        ? `${answer.slice(0, 13)}…`
                        : answer || index + 1}
                    </button>
                    {part}
                  </span>
                );
              })}
              {comment && <span className={s.codeComment}>{comment}</span>}
            </span>
          );
        })}
      </>
    );
  }

  const bank = (
    <fieldset className={s.wordBank} aria-label="选词填空词库">
      <strong>词库</strong>
      {wordBank.map((word) => {
        const used = answers.includes(word);
        return (
          <button
            key={word}
            type="button"
            aria-pressed={selectedWord === word}
            aria-describedby={used ? `${id}-word-used` : undefined}
            data-used={used || undefined}
            onClick={() => {
              if (selectedBlank !== null) fillBlank(selectedBlank, word);
              else setSelection(selectedWord === word ? null : word);
            }}
          >
            <span
              className={s.wordTile}
              ref={(node) => {
                if (node) words.current.set(word, node);
                else words.current.delete(word);
              }}
            >
              {word}
            </span>
          </button>
        );
      })}
    </fieldset>
  );
  const overlay = flight && (
    <span ref={flightRef} className={s.flyingWord} aria-hidden="true">
      {flight.word}
    </span>
  );
  function clearSelectedBlank() {
    if (canClearBlank && selectedBlank !== null) fillBlank(selectedBlank, '');
  }
  const status = (
    <div className={s.accessibleStatus}>
      <span id={`${id}-word-used`}>已填入代码</span>
      {questions.map((question, index) => (
        <span id={`${id}-status-${index + 1}`} key={question}>
          {!hasChecked
            ? '尚未核对'
            : answers[index] !== checkedAnswers[index]
              ? '已修改，等待核对'
              : correct[index]
                ? '答对了'
                : '再想一想，修改后重新核对'}
        </span>
      ))}
    </div>
  );
  const summary = selectedWord
    ? `已选 ${selectedWord}，点击要填的空。`
    : selectedBlank !== null
      ? `已选第 ${selectedBlank + 1} 空，请从词库选词。`
      : !hasChecked
        ? '点词语，再点对应的空。'
        : changed
          ? '已修改答案，请再次核对。'
          : correctCount === expected.length
            ? successMessage
            : `已答对 ${correctCount}/${expected.length} 个空，修改红框再试。`;

  function checkAnswers() {
    setSelection(null);
    update({ [checkedKey]: [...answers], [hasCheckedKey]: true });
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopyStatus('已复制');
    } catch {
      setCopyStatus('请选中代码复制');
    }
  }

  return {
    answers,
    checkedAnswers,
    hasChecked,
    correct,
    summary,
    renderCode,
    bank,
    overlay,
    canClearBlank,
    clearSelectedBlank,
    status,
    attachForm: (node: HTMLFormElement | null) => {
      formRef.current = node;
    },
    checkAnswers,
    copyCode,
    copyStatus,
  };
}
