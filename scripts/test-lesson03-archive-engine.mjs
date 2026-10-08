// Run: node scripts/test-lesson03-archive-engine.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

// Match the app's extensionless import without imposing Node's resolver on app code.
const base = new URL(
  '../app/courses/ai-with-python/lesson-03/',
  import.meta.url,
);
const asModule = (source) =>
  'data:text/javascript;base64,' +
  Buffer.from(
    ts.transpile(source, {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    }),
  ).toString('base64');
const content = asModule(
  await readFile(new URL('practice-content.ts', base), 'utf8'),
);
const source = (
  await readFile(new URL('archive-engine.ts', base), 'utf8')
).replace("'./practice-content'", JSON.stringify(content));
const {
  archiveReducer: reduce,
  createArchiveState,
  expectedGrid,
  archiveFiles,
  codeSlots,
  readSlots,
  toCsv,
  fullArchiveCode,
  isGridCorrect,
  isCellCorrect,
} = await import(asModule(source));
const act = (state, type, rest = {}) => reduce(state, { type, ...rest });
const start = () => act(createArchiveState(), 'start');
function correctRead(state = start()) {
  readSlots.forEach((slot, index) => {
    state = act(state, 'read-slot', { index });
    state = act(state, 'read-choice', { value: slot.answer });
  });
  return state;
}
function finishRaid(state) {
  return state.raidRemainingMs > 0
    ? act(state, 'tick', { elapsedMs: 3600 })
    : state;
}
const advance = (state, type) => finishRaid(act(state, type));
function organizing() {
  let state = act(correctRead(), 'select-file', { id: 'scout' });
  state = act(state, 'read');
  return advance(state, 'use-file');
}
function fill(state = organizing()) {
  expectedGrid.forEach((row, r) =>
    row.forEach((value, c) => {
      state = act(state, 'token', { value });
      state = act(state, 'place', { row: r, col: c });
    }),
  );
  return state;
}
function writing(state = fill()) {
  state = act(state, 'check-grid');
  state = act(state, 'separator', { value: ',' });
  state = act(state, 'line-break', { value: '\n' });
  return advance(state, 'check-format');
}
function correctCode(state = writing()) {
  codeSlots.forEach((slot, index) => {
    state = act(state, 'slot', { index });
    state = act(state, 'choice', { value: slot.answer });
  });
  return state;
}

test('selecting never reads; changing selection cannot reuse previously opened evidence', () => {
  let state = act(correctRead(), 'select-file', { id: 'scout' });
  assert.equal(state.openedFile, null);
  assert.equal(act(state, 'use-file').step, 0);
  state = act(state, 'read');
  state = act(state, 'select-file', { id: 'watch' });
  assert.equal(state.openedFile, 'scout');
  assert.equal(act(state, 'use-file').step, 0);
  state = act(state, 'read');
  assert.equal(act(state, 'use-file').step, 0);
  assert.deepEqual(state.readFiles, ['scout', 'watch']);
  assert.equal(organizing().step, 1);
  for (const file of archiveFiles.filter((file) => !file.useful)) {
    assert.equal(
      act(
        act(act(correctRead(), 'select-file', { id: file.id }), 'read'),
        'use-file',
      ).step,
      0,
    );
  }
});

test('incorrect grids preserve evidence, require correction and a fresh check', () => {
  let state = fill();
  state = act(state, 'token', { value: expectedGrid[1][2] });
  state = act(state, 'place', { row: 0, col: 2 });
  state = act(state, 'check-grid');
  assert.equal(state.gridChecked, true);
  assert.equal(state.tone, 'error');
  assert.equal(state.grid[0][2], expectedGrid[1][2]);
  assert.equal(writing(state).step, 1);
  state = act(state, 'token', { value: expectedGrid[0][2] });
  state = act(state, 'place', { row: 0, col: 2 });
  assert.equal(state.gridChecked, false);
  assert.equal(act(state, 'check-format').step, 1);
  assert.equal(writing(state).step, 2);
});

test('CSV format requires English commas and one record per line', () => {
  let state = act(fill(), 'check-grid');
  state = act(state, 'separator', { value: '，' });
  state = act(state, 'line-break', { value: '\n' });
  assert.equal(act(state, 'check-format').step, 1);
  state = act(state, 'separator', { value: ',' });
  state = act(state, 'line-break', { value: '' });
  assert.equal(act(state, 'check-format').step, 1);
  assert.equal(writing(state).formatReady, true);
});

test('wrong code cannot save; choices survive feedback and can be corrected', () => {
  let state = correctCode();
  for (let index = 0; index < codeSlots.length; index++) {
    const wrong = codeSlots[index].options.find(
      (option) => option !== codeSlots[index].answer,
    );
    state = act(state, 'slot', { index });
    state = act(state, 'choice', { value: wrong });
    state = act(state, 'save');
    assert.equal(state.phase, 'playing');
    assert.equal(state.savedCsv, null);
    assert.equal(state.codeChecked, true);
    assert.equal(state.choices[index], wrong);
    assert.equal(state.activeSlot, index);
    state = act(state, 'choice', { value: codeSlots[index].answer });
  }
  state = advance(state, 'save');
  assert.equal(state.phase, 'won');
  assert.equal(state.savedCsv, toCsv(expectedGrid));
  assert.match(fullArchiveCode(state), /writer\.writeheader\(\)/);
  assert.match(fullArchiveCode(state), /writer\.writerows\(records\)/);
  assert.match(fullArchiveCode(state), /with open\(path, "r"/);
  assert.equal(state.savedCsv.trim().split('\n').length, 4);
});

test('countdown respects pause, clamps timeout and preserves classroom work', () => {
  const before = fill();
  let state = act(before, 'tick', { elapsedMs: 1200 });
  assert.equal(state.remainingMs, before.remainingMs - 1200);
  const paused = act(state, 'pause');
  assert.equal(act(paused, 'tick', { elapsedMs: 999999 }), paused);
  assert.equal(act(paused, 'undo'), paused);
  state = act(act(paused, 'pause'), 'tick', { elapsedMs: 999999 });
  assert.equal(state.phase, 'timeout');
  assert.equal(state.remainingMs, 0);
  assert.deepEqual(state.grid, expectedGrid);
  assert.equal(act(state, 'save'), state);
  assert.equal(act(state, 'check-grid'), state);
  state = act(state, 'continue-practice');
  assert.equal(state.practice, true);
  const practiceRaid = act(state, 'tick', { elapsedMs: 999999 });
  assert.equal(practiceRaid.remainingMs, 0);
  assert.equal(practiceRaid.raidRemainingMs, 3600);
  state = finishRaid(practiceRaid);
  const finished = advance(correctCode(writing(state)), 'save');
  assert.equal(finished.phase, 'won');
  assert.equal(finished.practice, true);
  assert.match(finished.feedback, /练习完成/);
  assert.deepEqual(act(finished, 'restart'), createArchiveState());
});

test('out-of-phase and malformed actions cannot bypass progression or corrupt state', () => {
  const ready = createArchiveState();
  assert.equal(act(ready, 'read'), ready);
  assert.equal(act(start(), 'check-format').step, 0);
  assert.equal(act(start(), 'save').phase, 'playing');
  for (const elapsedMs of [NaN, Infinity, -1])
    assert.deepEqual(act(start(), 'tick', { elapsedMs }), start());
  const state = act(organizing(), 'token', { value: expectedGrid[0][0] });
  assert.equal(act(state, 'place', { row: -1, col: 0 }), state);
  assert.equal(act(state, 'place', { row: 0, col: 1.5 }), state);
  assert.equal(act(writing(), 'choice', { value: 'injected' }).choices[0], '');
  const won = advance(correctCode(), 'save');
  assert.equal(act(won, 'tick', { elapsedMs: 999999 }), won);
  assert.equal(act(won, 'choice', { value: '"r"' }), won);
});

test('CSV escaping preserves commas, quotes and embedded newlines', () => {
  assert.equal(
    toCsv([['a,b', 'say "hi"', 'two\nlines']]),
    '恶魔,地点,弱点\n"a,b","say ""hi""","two\nlines"\n',
  );
});

test('undo restores the actual previous placement, including overwritten cells', () => {
  const first = fill();
  let state = act(first, 'token', { value: expectedGrid[1][0] });
  state = act(state, 'place', { row: 0, col: 0 });
  assert.equal(state.grid[0][0], expectedGrid[1][0]);
  state = act(state, 'undo');
  assert.deepEqual(state.grid, first.grid);
  assert.deepEqual(state.gridHistory, first.gridHistory);
  state = act(state, 'undo');
  assert.equal(state.grid[2][2], '');
  assert.equal(state.grid[0][0], expectedGrid[0][0]);
  assert.equal(state.gridChecked, false);
});

test('records may be reordered while duplicate rows and mismatched fields fail', () => {
  const reordered = [expectedGrid[2], expectedGrid[0], expectedGrid[1]];
  assert.equal(isGridCorrect(reordered), true);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++)
      assert.equal(isCellCorrect(reordered, row, col), true);
  }
  const state = writing({ ...organizing(), grid: reordered });
  assert.equal(state.step, 2);
  assert.equal(advance(correctCode(state), 'save').savedCsv, toCsv(reordered));
  const duplicates = [expectedGrid[0], expectedGrid[0], expectedGrid[2]];
  assert.equal(isGridCorrect(duplicates), false);
  assert.equal(isCellCorrect(duplicates, 0, 0), false);
  assert.equal(isCellCorrect(duplicates, 1, 0), false);
  const swapped = expectedGrid.map((row) => [...row]);
  [swapped[0][1], swapped[1][1]] = [swapped[1][1], swapped[0][1]];
  assert.equal(isGridCorrect(swapped), false);
  assert.equal(isCellCorrect(swapped, 0, 1), false);
  assert.equal(isCellCorrect(swapped, 1, 1), false);
  assert.equal(isCellCorrect(swapped, 0, 2), true);
  const unnamed = [['', expectedGrid[1][1], expectedGrid[0][0]]];
  assert.equal(isCellCorrect(unnamed, 0, 0), false);
  assert.equal(isCellCorrect(unnamed, 0, 1), true);
  assert.equal(isCellCorrect(unnamed, 0, 2), false);
});

test('five-minute challenge gates reads with two choices and preserves the unopened file on errors', () => {
  let state = act(start(), 'select-file', { id: 'scout' });
  assert.equal(state.remainingMs, 300000);
  state = act(state, 'read');
  assert.equal(state.openedFile, null);
  assert.equal(state.activeReadSlot, 0);
  assert.equal(state.readChecked, true);
  state = act(state, 'read-choice', { value: '"w"' });
  state = act(state, 'read-choice', { value: 'read' });
  state = act(state, 'read');
  assert.equal(state.openedFile, null);
  assert.deepEqual(state.readFiles, []);
  assert.equal(state.readChoices[0], '"w"');
  state = correctRead(state);
  state = act(state, 'read');
  assert.equal(state.openedFile, 'scout');
  state = act(state, 'read-slot', { index: 1 });
  state = act(state, 'read-choice', { value: 'write' });
  assert.equal(act(state, 'use-file').step, 0);
  state = act(state, 'read');
  assert.equal(state.activeReadSlot, 1);
  assert.match(state.feedback, /read/);
  assert.equal(state.openedFile, 'scout');
});

test('raids occur after random 10–20 second intervals and pause with all choices intact', () => {
  for (const random of [0, 0.25, 0.5, 1]) {
    let state = act(createArchiveState(), 'start', { random });
    assert.equal(state.raidInMs, 10000 + random * 10000);
    state = correctRead(state);
    state = act(state, 'select-file', { id: 'scout' });
    state = act(state, 'tick', { elapsedMs: state.raidInMs - 1, random });
    assert.equal(state.raidSerial, 0);
    state = act(state, 'tick', { elapsedMs: 1, random });
    assert.equal(state.raidSerial, 1);
    assert.deepEqual(state.raidSeeds, [Math.floor(random * 0xffffffff)]);
    assert.deepEqual(state.raidCount, [1, 0, 0]);
    assert.equal(state.raidDemon, Math.min(2, Math.floor(random * 3)));
    assert.equal(state.raidRemainingMs, 3600);
    assert.equal(act(state, 'read'), state);
    assert.equal(act(state, 'read-choice', { value: 'write' }), state);
    const paused = act(state, 'pause');
    assert.equal(act(paused, 'tick', { elapsedMs: 20000 }), paused);
    state = act(act(paused, 'pause'), 'tick', { elapsedMs: 3600, random });
    assert.equal(state.raidRemainingMs, 0);
    assert.equal(state.raidSerial, 1);
    assert.equal(state.selectedFile, 'scout');
    assert.deepEqual(
      state.readChoices,
      readSlots.map((slot) => slot.answer),
    );
    assert.equal(state.raidInMs, 10000 + random * 10000 - 3600);
    state = act(state, 'tick', { elapsedMs: state.raidInMs - 1, random });
    assert.equal(state.raidSerial, 1);
    state = act(state, 'tick', { elapsedMs: 1, random });
    assert.equal(state.raidSerial, 2);
    assert.deepEqual(state.raidSeeds, [
      Math.floor(random * 0xffffffff),
      Math.floor(random * 0xffffffff),
    ]);
    state = act(state, 'tick', { elapsedMs: 99999, random });
    assert.equal(state.raidRemainingMs, 0);
    assert.equal(state.raidInMs, 0);
    assert.equal(
      state.raidSerial,
      2,
      'a long tick may finish only the current raid',
    );
  }
});

test('even fast correct submissions encounter one raid in each step before advancing', () => {
  let state = act(correctRead(), 'select-file', { id: 'scout' });
  state = act(state, 'read');
  state = act(state, 'use-file', { random: 0 });
  assert.equal(state.step, 0);
  assert.equal(state.pendingAdvance, 'use-file');
  assert.deepEqual(state.raidCount, [1, 0, 0]);
  const paused = act(state, 'pause');
  assert.equal(act(paused, 'tick', { elapsedMs: 3600 }), paused);
  state = finishRaid(act(paused, 'pause'));
  assert.equal(state.step, 1);
  assert.equal(state.pendingAdvance, null);
  state = act(fill(state), 'check-grid');
  state = act(state, 'separator', { value: ',' });
  state = act(state, 'line-break', { value: '\n' });
  const grid = state.grid;
  state = act(state, 'check-format', { random: 1 });
  assert.equal(state.step, 1);
  assert.equal(state.pendingAdvance, 'check-format');
  assert.deepEqual(state.raidCount, [1, 1, 0]);
  assert.equal(act(state, 'undo'), state);
  state = finishRaid(state);
  assert.equal(state.step, 2);
  assert.deepEqual(state.grid, grid);
  state = correctCode(state);
  const choices = state.choices;
  state = act(state, 'save');
  assert.equal(state.phase, 'playing');
  assert.equal(state.pendingAdvance, 'save');
  assert.deepEqual(state.raidCount, [1, 1, 1]);
  assert.equal(state.savedCsv, null);
  state = finishRaid(state);
  assert.equal(state.phase, 'won');
  assert.equal(state.pendingAdvance, null);
  assert.equal(state.raidSerial, 3);
  assert.deepEqual(state.choices, choices);
  assert.equal(state.savedCsv, toCsv(grid));
});

test('a pending raid survives timeout and finishes in practice without losing answers', () => {
  let state = act(correctRead(), 'select-file', { id: 'scout' });
  state = act(state, 'read');
  state = act({ ...state, remainingMs: 1000 }, 'use-file');
  state = act(state, 'tick', { elapsedMs: 1000 });
  assert.equal(state.phase, 'timeout');
  assert.equal(state.pendingAdvance, 'use-file');
  state = act(state, 'continue-practice');
  state = finishRaid(state);
  assert.equal(state.step, 1);
  assert.equal(state.remainingMs, 0);
  assert.equal(state.practice, true);
  assert.equal(state.openedFile, 'scout');
  assert.deepEqual(act(state, 'restart'), createArchiveState());
});

test('different raid randomness yields distinct persistent shuffle seeds', () => {
  const low = act(start(), 'tick', { elapsedMs: 15000, random: 0.1 });
  const high = act(start(), 'tick', { elapsedMs: 15000, random: 0.9 });
  assert.notEqual(low.raidSeeds[0], high.raidSeeds[0]);
  const next = act(finishRaid(low), 'tick', { elapsedMs: 15000, random: 0.9 });
  assert.deepEqual(next.raidSeeds, [low.raidSeeds[0], high.raidSeeds[0]]);
  assert.equal(next.raidSeeds.length, next.raidSerial);
  assert.deepEqual(act(next, 'restart').raidSeeds, []);
});
