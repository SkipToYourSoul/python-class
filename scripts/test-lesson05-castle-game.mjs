// Run: node scripts/test-lesson05-castle-game.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

const base = new URL(
  '../app/courses/ai-with-python/lesson-05/',
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
const dataUrl = asModule(
  await readFile(new URL('study-data.ts', base), 'utf8'),
);
const source = (
  await readFile(new URL('castle-challenge-engine.ts', base), 'utf8')
).replace("'./study-data'", JSON.stringify(dataUrl));
const { demons, demonKinds, demonHistograms, patrol } = await import(dataUrl);
const {
  challengeTools,
  challengeRounds,
  speedBins,
  speedBinFor,
  kindSpeeds,
  patrolPoints,
  targetDemon,
  escapeRoutes,
  escapeRuleMatches,
  challengeReducer: reduce,
  createInitialChallengeState,
} = await import(asModule(source));
const act = (state, type, rest = {}) => reduce(state, { type, ...rest });
const start = () => act(createInitialChallengeState(), 'start');
const answers = [
  [...speedBins].sort((a, b) => b.count - a.count)[0].id,
  [...kindSpeeds].sort((a, b) => b.speed - a.speed)[0].id,
  [...patrolPoints].sort((a, b) => a.speed - b.speed)[0].id,
  targetDemon.kind,
];
function solveRound(state) {
  state = act(state, 'tool', { tool: challengeRounds[state.round].tool });
  if (state.round === 3) state = act(state, 'reinforce');
  state = act(state, 'choose', { choice: answers[state.round] });
  return act(state, 'execute');
}
function atRound(round) {
  let state = start();
  while (state.round < round) state = act(solveRound(state), 'next');
  return state;
}

test('the speed histogram preserves all actual counts and exact interval boundaries', () => {
  assert.equal(demons.length, 90);
  assert.equal(speedBins.length, 8);
  assert.deepEqual(
    speedBins.map((bin) => bin.count),
    [3, 10, 11, 16, 18, 14, 12, 6],
  );
  assert.deepEqual(
    speedBins.map(({ low, high, count }) => ({ low, high, count })),
    demonHistograms.speed,
  );
  const counted = new Map(speedBins.map((bin) => [bin.id, 0]));
  for (const demon of demons) {
    const bin = speedBinFor(demon.speed);
    assert.ok(bin, `${demon.id} must belong to exactly one speed interval`);
    counted.set(bin.id, counted.get(bin.id) + 1);
  }
  for (const [index, bin] of speedBins.entries()) {
    assert.equal(counted.get(bin.id), bin.count);
    assert.equal(speedBinFor(bin.low)?.id, bin.id);
    assert.equal(
      speedBinFor(bin.high)?.id,
      index === speedBins.length - 1 ? bin.id : speedBins[index + 1].id,
    );
  }
  assert.equal(speedBinFor(2.2)?.id, speedBins[0].id);
  assert.equal(speedBinFor(13.1)?.id, speedBins.at(-1).id);
  for (const value of [2.19, 13.11, NaN, -Infinity, Infinity])
    assert.equal(speedBinFor(value), null);
  assert.equal(answers[0], 'speed-4');
  assert.equal(speedBins[4].count, 18);
  assert.match(speedBins[4].label, /约/);
});

test('species means, patrol extrema and the D004 exception use the lesson records', () => {
  assert.deepEqual(
    challengeRounds.map((round) => round.options.length),
    [3, 3, 3, 3],
  );
  assert.deepEqual(
    challengeRounds[0].options.map((option) => option.id),
    ['speed-3', 'speed-4', 'speed-5'],
  );
  assert.deepEqual(
    challengeRounds[2].options.map((option) => option.id),
    ['hour-8', 'hour-12', 'hour-16'],
  );
  assert.deepEqual(
    kindSpeeds.map((item) => item.kind),
    demonKinds,
  );
  for (const row of kindSpeeds) {
    const members = demons.filter((demon) => demon.kind === row.kind);
    assert.equal(row.count, 30);
    assert.equal(row.count, members.length);
    assert.equal(
      row.speed,
      members.reduce((total, member) => total + member.speed, 0) /
        members.length,
    );
  }
  assert.equal(answers[1], '冰翼魔族');
  assert.deepEqual(
    patrolPoints.map(({ hour, speed }) => ({ hour, speed })),
    patrol,
  );
  assert.deepEqual(
    patrolPoints.map((point) => point.hour),
    [8, 10, 12, 14, 16, 18],
  );
  assert.equal(answers[2], 'hour-16');
  assert.equal(Math.min(...patrolPoints.map((point) => point.speed)), 5.8);
  assert.equal(Math.max(...patrolPoints.map((point) => point.speed)), 8.1);
  assert.deepEqual(targetDemon, {
    id: 'D004',
    kind: '炎角兽族',
    height: 205,
    speed: 11.7,
    mass: 101,
  });
  const sameKind = demons.filter((demon) => demon.kind === targetDemon.kind);
  assert.ok(
    targetDemon.height >
      sameKind.reduce((sum, d) => sum + d.height, 0) / sameKind.length,
  );
  assert.ok(
    targetDemon.speed > Math.max(...kindSpeeds.map((row) => row.speed)),
  );
});

test('every wrong tool is recoverable and cannot advance or lose collected clues', () => {
  for (let round = 0; round < 4; round++) {
    for (const tool of challengeTools.filter(
      (item) => item.id !== challengeRounds[round].tool,
    )) {
      const state = atRound(round);
      const failed = act(state, 'tool', { tool: tool.id });
      assert.equal(failed.phase, 'feedback');
      assert.equal(failed.tool, tool.id);
      assert.equal(failed.result.success, false);
      assert.equal(failed.alarms, state.alarms + 1);
      assert.deepEqual(failed.clues, state.clues);
      assert.strictEqual(act(failed, 'next'), failed);
      assert.strictEqual(act(failed, 'execute'), failed);
      const recovered = act(failed, 'retry');
      assert.equal(recovered.phase, 'tool');
      assert.equal(recovered.tool, null);
      assert.deepEqual(recovered.clues, state.clues);
      assert.equal(solveRound(recovered).result.success, true);
    }
  }
});

test('wrong actions in the first three rounds preserve evidence and support unlimited correction', () => {
  for (let round = 0; round < 3; round++) {
    const prepared = act(atRound(round), 'tool', {
      tool: challengeRounds[round].tool,
    });
    for (const wrong of challengeRounds[round].options.filter(
      (option) => option.id !== answers[round],
    )) {
      let state = act(prepared, 'choose', { choice: wrong.id });
      for (let attempt = 0; attempt < 5; attempt++) {
        const failed = act(state, 'execute');
        assert.equal(failed.result.success, false);
        assert.equal(failed.phase, 'feedback');
        assert.equal(failed.choice, wrong.id);
        assert.equal(failed.round, round);
        assert.equal(failed.alarms, prepared.alarms + attempt + 1);
        assert.deepEqual(failed.clues, prepared.clues);
        assert.strictEqual(act(failed, 'next'), failed);
        state = act(failed, 'retry');
        assert.equal(state.phase, 'choice');
        assert.equal(state.reinforced, prepared.reinforced);
      }
      state = act(state, 'choose', { choice: answers[round] });
      state = act(state, 'execute');
      assert.equal(state.result.success, true);
      assert.equal(state.clues.length, round + 1);
      assert.deepEqual(state.clues.slice(0, round), prepared.clues);
    }
  }
});

test('all D004 candidates require a second feature pair without creating an alarm', () => {
  for (const candidate of challengeRounds[3].options) {
    let state = act(atRound(3), 'tool', { tool: 'scatter' });
    state = act(state, 'choose', { choice: candidate.id });
    const missingEvidence = act(state, 'execute');
    assert.equal(missingEvidence.phase, 'choice');
    assert.equal(missingEvidence.alarms, state.alarms);
    assert.equal(missingEvidence.choice, candidate.id);
    assert.equal(missingEvidence.clues.length, 3);
    assert.match(missingEvidence.result.text, /再看体重，核对另一组特征/);
    assert.strictEqual(act(missingEvidence, 'next'), missingEvidence);
    const reinforced = act(missingEvidence, 'reinforce');
    assert.equal(reinforced.reinforced, true);
    assert.equal(reinforced.choice, candidate.id);
    assert.equal(reinforced.result, null);
  }
});

test('all three reinforced candidates can consult the same actual D004 dossier without punishment', () => {
  const confirmedClues = [];
  for (const candidate of challengeRounds[3].options) {
    let state = act(atRound(3), 'tool', { tool: 'scatter' });
    state = act(state, 'reinforce');
    state = act(state, 'choose', { choice: candidate.id });
    const confirmed = act(state, 'execute');
    assert.equal(confirmed.phase, 'feedback');
    assert.equal(confirmed.result.success, true);
    assert.equal(confirmed.alarms, state.alarms);
    assert.equal(confirmed.choice, candidate.id);
    assert.equal(confirmed.result.title, '候选已核实，档案到手');
    assert.match(
      confirmed.result.text,
      new RegExp(`先前候选是${candidate.id}`),
    );
    assert.match(confirmed.result.text, /核查档案确认 D004 属于炎角兽族/);
    assert.match(confirmed.result.text, /点群重叠，不能单靠图表确定身份/);
    assert.equal(confirmed.clues[3].value, '炎角兽族');
    confirmedClues.push(confirmed.clues[3]);
    const escape = act(confirmed, 'next');
    assert.equal(escape.phase, 'escape');
    assert.deepEqual(
      escapeRoutes
        .filter((route) => escapeRuleMatches(route, escape.clues))
        .map((route) => route.id),
      ['east'],
    );
  }
  assert.deepEqual(confirmedClues[0], confirmedClues[1]);
  assert.deepEqual(confirmedClues[1], confirmedClues[2]);
});

test('four rounds advance once each and all four facts are required for the only valid exit', () => {
  const state = atRound(4);
  assert.equal(state.phase, 'escape');
  assert.equal(state.round, 4);
  assert.equal(state.clues.length, 4);
  assert.deepEqual(
    state.clues.map((clue) => clue.value),
    answers,
  );
  const matches = escapeRoutes.filter((route) =>
    escapeRuleMatches(route, state.clues),
  );
  assert.equal(matches.length, 1);
  assert.equal(matches[0].id, 'east');
  for (const route of escapeRoutes) {
    assert.equal(route.rules.length, 4);
    assert.deepEqual(
      new Set(route.rules.map((rule) => rule.clue)),
      new Set(state.clues.map((clue) => clue.id)),
    );
    for (const clue of state.clues) {
      assert.equal(
        escapeRuleMatches(
          route,
          state.clues.filter((item) => item.id !== clue.id),
        ),
        false,
      );
    }
  }
  for (const route of escapeRoutes.filter((route) => route.id !== 'east')) {
    const chosen = act(state, 'choose', { choice: route.id });
    const failed = act(chosen, 'execute');
    assert.equal(failed.phase, 'feedback');
    assert.equal(failed.result.success, false);
    assert.equal(failed.choice, route.id);
    assert.deepEqual(failed.clues, state.clues);
    assert.match(failed.result.text, /与已收集记录不一致/);
    const recovered = act(failed, 'retry');
    assert.equal(recovered.phase, 'escape');
    assert.equal(recovered.alarms, 1);
    assert.deepEqual(recovered.clues, state.clues);
    const victory = act(
      act(recovered, 'choose', { choice: 'east' }),
      'execute',
    );
    assert.equal(victory.phase, 'victory');
    assert.equal(victory.result.success, true);
    assert.deepEqual(victory.clues, state.clues);
  }
});

test('inactive, stale and premature actions cannot bypass decisions or duplicate success', () => {
  const initial = createInitialChallengeState();
  for (const type of ['next', 'execute', 'retry', 'reinforce'])
    assert.strictEqual(act(initial, type), initial);
  let state = start();
  assert.strictEqual(act(state, 'start'), state);
  assert.strictEqual(act(state, 'next'), state);
  assert.strictEqual(act(state, 'execute'), state);
  assert.strictEqual(act(state, 'reinforce'), state);
  assert.strictEqual(act(state, 'choose', { choice: answers[0] }), state);
  assert.strictEqual(act(state, 'tool', { tool: 'unknown' }), state);
  state = act(state, 'tool', { tool: 'histogram' });
  assert.strictEqual(act(state, 'execute'), state);
  assert.strictEqual(act(state, 'choose', { choice: 'unknown' }), state);
  state = act(act(state, 'choose', { choice: answers[0] }), 'execute');
  const success = structuredClone(state);
  assert.strictEqual(act(state, 'execute'), state);
  assert.strictEqual(act(state, 'retry'), state);
  assert.strictEqual(act(state, 'choose', { choice: 'speed-0' }), state);
  assert.deepEqual(state, success);
  const next = act(state, 'next');
  assert.equal(next.round, 1);
  assert.equal(next.phase, 'tool');
  assert.strictEqual(act(next, 'next'), next);
  const escape = atRound(4);
  assert.strictEqual(act(escape, 'choose', { choice: 'unknown' }), escape);
  assert.strictEqual(act(escape, 'execute'), escape);
});

test('reset clears every game field; reducer actions never mutate earlier snapshots', () => {
  const initial = createInitialChallengeState();
  const initialSnapshot = structuredClone(initial);
  const active = act(initial, 'start');
  assert.deepEqual(initial, initialSnapshot);
  const activeSnapshot = structuredClone(active);
  const success = solveRound(active);
  assert.deepEqual(active, activeSnapshot);
  const successSnapshot = structuredClone(success);
  act(success, 'next');
  assert.deepEqual(success, successSnapshot);
  let state = atRound(4);
  state = act(act(state, 'choose', { choice: 'west' }), 'execute');
  state = act(state, 'retry');
  state = act(act(state, 'choose', { choice: 'east' }), 'execute');
  assert.equal(state.phase, 'victory');
  for (const type of ['start', 'next', 'retry', 'execute', 'reinforce'])
    assert.strictEqual(act(state, type), state);
  const reset = act(state, 'reset');
  assert.deepEqual(reset, initialSnapshot);
  reset.clues.push({ id: 'scan', title: '', text: '', value: '' });
  assert.equal(createInitialChallengeState().clues.length, 0);
  assert.equal(state.clues.length, 4);
  assert.deepEqual(atRound(4), atRound(4));
});
