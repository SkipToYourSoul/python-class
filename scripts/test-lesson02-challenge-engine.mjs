// Run: node --experimental-strip-types scripts/test-lesson02-challenge-engine.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  firstTryCount,
  initialDefense,
  judgeAnswer,
  remainingAt,
} from '../app/courses/ai-with-python/lesson-02/challenge-engine.ts';

const answering = (changes = {}) => ({
  ...structuredClone(initialDefense),
  phase: 'answer',
  remainingMs: 30000,
  selected: 1,
  ...changes,
});

test('wrong answer records the attempt and keeps the question available', () => {
  const before = answering();
  const after = judgeAnswer(before, 2);
  assert.equal(after.phase, 'answer');
  assert.deepEqual(after.answers[0], { attempts: [1], solved: false });
  assert.equal(after.remainingMs, 20000);
  assert.deepEqual(before.answers[0], { attempts: [], solved: false });
});

test('correct answer stops answering and only updates the current wave and step', () => {
  const before = answering({ wave: 2, step: 1, selected: 0 });
  const after = judgeAnswer(before, 0);
  assert.equal(after.phase, 'correct');
  assert.equal(after.remainingMs, before.remainingMs);
  assert.deepEqual(after.answers[7], { attempts: [0], solved: true });
  assert.equal(firstTryCount(after.answers), 1);
  after.answers.forEach((answer, index) => {
    if (index !== 7) assert.deepEqual(answer, before.answers[index]);
  });
});

test('no selection or exhausted timer cannot submit an answer', () => {
  for (const changes of [
    { selected: -1 },
    { remainingMs: 0 },
    { remainingMs: -1 },
    { phase: 'timeout' },
  ]) {
    const before = answering(changes);
    assert.strictEqual(judgeAnswer(before, 1), before);
    assert.equal(firstTryCount(before.answers), 0);
  }
});

test('only the answering phase accepts submissions', () => {
  for (const phase of ['ready', 'correct', 'defense', 'complete']) {
    const before = answering({ phase });
    assert.strictEqual(judgeAnswer(before, 1), before);
  }
});

test('correcting multiple wrong attempts completes a question without a first-try point', () => {
  const firstWrong = judgeAnswer(answering({ selected: 0 }), 2);
  const secondWrong = judgeAnswer({ ...firstWrong, selected: 1 }, 2);
  const corrected = judgeAnswer({ ...secondWrong, selected: 2 }, 2);
  assert.deepEqual(corrected.answers[0], { attempts: [0, 1, 2], solved: true });
  assert.equal(corrected.phase, 'correct');
  assert.equal(firstTryCount(corrected.answers), 0);
  // A repeated confirmation on a solved question cannot add another attempt.
  assert.strictEqual(judgeAnswer(corrected, 2), corrected);
});

test('first-try score counts only solved questions with exactly one attempt', () => {
  assert.equal(
    firstTryCount([
      { attempts: [], solved: false },
      { attempts: [1], solved: false },
      { attempts: [2], solved: true },
      { attempts: [0, 2], solved: true },
      { attempts: [1, 0, 2], solved: true },
    ]),
    1,
  );
});

test('remaining time is calculated from the deadline and never falls below zero', () => {
  assert.equal(remainingAt(90000, 10000), 80000);
  assert.equal(remainingAt(90000, 89999), 1);
  assert.equal(remainingAt(90000, 90000), 0);
  assert.equal(remainingAt(90000, 91000), 0);
});

test('wrong-answer penalties accumulate and can exhaust the countdown', () => {
  let state = answering({ remainingMs: 25000 });
  state = judgeAnswer(state, 2);
  assert.equal(state.remainingMs, 15000);
  state = judgeAnswer(state, 2);
  assert.equal(state.remainingMs, 5000);
  state = judgeAnswer(state, 2);
  assert.equal(state.remainingMs, 0);
  assert.equal(state.phase, 'timeout');
  assert.deepEqual(state.answers[0].attempts, [1, 1, 1]);
  assert.strictEqual(judgeAnswer(state, 2), state);
});

test('exactly ten seconds remaining is exhausted by one wrong answer', () => {
  const state = judgeAnswer(answering({ remainingMs: 10000 }), 2);
  assert.equal(state.phase, 'timeout');
  assert.equal(state.remainingMs, 0);
});
