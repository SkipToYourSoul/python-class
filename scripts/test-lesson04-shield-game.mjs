// Run: node scripts/test-lesson04-shield-game.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

const source = await readFile(
  new URL(
    '../app/courses/ai-with-python/lesson-04/final-challenge/shield-engine.ts',
    import.meta.url,
  ),
  'utf8',
);
const engineUrl =
  'data:text/javascript;base64,' +
  Buffer.from(
    ts.transpile(source, {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    }),
  ).toString('base64');
const {
  DEMONS,
  CASE_COUNT,
  makeCase,
  deriveRows,
  selectionResult,
  finalResult,
} = await import(engineUrl);
const cases = Array.from({ length: CASE_COUNT }, (_, index) => makeCase(index));

test('sixteen distinct cases are deterministic and safely wrap indices', () => {
  assert.ok(CASE_COUNT >= 12);
  assert.equal(new Set(cases.map((battle) => battle.id)).size, CASE_COUNT);
  assert.equal(
    new Set(cases.map((battle) => JSON.stringify(battle))).size,
    CASE_COUNT,
  );
  cases.forEach((battle, index) => assert.deepEqual(makeCase(index), battle));
  assert.deepEqual(makeCase(CASE_COUNT), makeCase(0));
  assert.deepEqual(makeCase(-1), makeCase(CASE_COUNT - 1));
  assert.deepEqual(makeCase(NaN), makeCase(0));
  assert.deepEqual(makeCase(Infinity), makeCase(0));
  assert.deepEqual(makeCase(2.8), makeCase(2));
});

test('every displayed mean and count comes from real observation rows', () => {
  for (const battle of cases) {
    const rows = deriveRows(battle);
    assert.deepEqual(
      rows.map((row) => row.id),
      DEMONS.map((demon) => demon.id),
    );
    assert.equal(
      new Set(battle.records.map((record) => record.id)).size,
      battle.records.length,
    );
    assert.equal(
      rows.reduce((sum, row) => sum + row.count, 0),
      battle.records.length,
    );
    for (const record of battle.records) {
      assert.equal(record.demons.length, 1);
      assert.ok(DEMON_IDS.has(record.demons[0]));
      assert.ok(
        Number.isInteger(record.threat) &&
          record.threat >= 0 &&
          record.threat <= 100,
      );
    }
    for (const row of rows) {
      const readings = battle.records.filter((record) =>
        record.demons.includes(row.id),
      );
      assert.equal(row.count, readings.length);
      assert.equal(
        row.mean,
        readings.reduce((sum, record) => sum + record.threat, 0) /
          readings.length,
      );
      assert.equal(row.name, DEMONS.find((demon) => demon.id === row.id).name);
    }
  }
});

const DEMON_IDS = new Set(DEMONS.map((demon) => demon.id));

test('all cases preserve the single-reading trap and two close, well-sampled candidates', () => {
  for (const battle of cases) {
    const rows = deriveRows(battle);
    const outlier = rows.find((row) => row.id === battle.outlier);
    assert.equal(outlier.count, 1);
    assert.ok(outlier.mean >= 95 && outlier.mean <= 99);
    assert.equal(
      [...rows].sort((a, b) => b.mean - a.mean)[0].id,
      battle.outlier,
    );
    const eligible = rows
      .filter((row) => row.count >= 3)
      .sort((a, b) => b.mean - a.mean);
    assert.deepEqual(
      new Set(eligible.slice(0, 2).map((row) => row.id)),
      new Set(battle.candidates),
    );
    assert.equal(battle.candidates.length, 2);
    assert.ok(battle.candidates.includes(battle.host));
    assert.notEqual(battle.host, battle.outlier);
    assert.ok(eligible[0].mean - eligible[1].mean <= 3);
    for (const row of eligible.slice(0, 2)) {
      assert.ok(row.mean >= 70 && row.count >= 4 && row.count <= 8);
    }
    assert.ok(
      eligible[2].mean >= 45 &&
        eligible[2].mean <= 55 &&
        eligible[2].count >= 3,
    );
  }
});

test('every portrait can host the boss at either first or second eligible rank', () => {
  const positions = new Map(DEMONS.map((demon) => [demon.id, new Set()]));
  for (const battle of cases) {
    const ranked = deriveRows(battle)
      .filter((row) => row.count >= 3)
      .sort((a, b) => b.mean - a.mean);
    positions
      .get(battle.host)
      .add(ranked.findIndex((row) => row.id === battle.host));
  }
  for (const ranks of positions.values())
    assert.deepEqual(ranks, new Set([0, 1]));
  assert.deepEqual(new Set(cases.map((battle) => battle.outlier)), DEMON_IDS);
});

test('candidate selection requires exactly two distinct, correct objects and supports retry', () => {
  for (const battle of cases) {
    const before = JSON.stringify(battle);
    assert.equal(selectionResult(battle, []).ok, false);
    assert.equal(selectionResult(battle, [battle.host]).ok, false);
    assert.equal(selectionResult(battle, [battle.host, battle.host]).ok, false);
    assert.equal(
      selectionResult(
        battle,
        DEMONS.map((demon) => demon.id),
      ).ok,
      false,
    );
    const trap = selectionResult(battle, [battle.host, battle.outlier]);
    assert.equal(trap.ok, false);
    assert.match(trap.message, /不代表.*清白/);
    const other = DEMONS.find(
      (demon) =>
        !battle.candidates.includes(demon.id) && demon.id !== battle.outlier,
    );
    assert.equal(selectionResult(battle, [battle.host, other.id]).ok, false);
    assert.equal(selectionResult(battle, battle.candidates).ok, true);
    assert.equal(
      selectionResult(battle, [...battle.candidates].reverse()).ok,
      true,
    );
    assert.equal(JSON.stringify(battle), before);
  }
});

test('two conflicting orders have exactly one match to both actual movements', () => {
  const speakingPositions = new Map(
    DEMONS.map((demon) => [demon.id, new Set()]),
  );
  for (const battle of cases) {
    assert.equal(battle.commands.orders.length, 2);
    assert.deepEqual(
      new Set(battle.commands.orders.map((order) => order.actor)),
      new Set(battle.candidates),
    );
    const [first, second] = battle.commands.orders;
    assert.notEqual(first.destinations[0], second.destinations[0]);
    assert.notEqual(first.destinations[1], second.destinations[1]);
    for (const order of battle.commands.orders) {
      assert.equal(
        order.text,
        `东队，前往${order.destinations[0]}！西队，守住${order.destinations[1]}！`,
      );
    }
    const actual = battle.commands.responses.map(
      (response) => response.destination,
    );
    const matches = battle.commands.orders.filter((order) =>
      order.destinations.every((place, i) => place === actual[i]),
    );
    assert.equal(matches.length, 1);
    assert.equal(matches[0].actor, battle.host);
    assert.equal(battle.commands.responses.length, 2);
    assert.equal(
      new Set(battle.commands.responses.map((response) => response.actor)).size,
      2,
    );
    assert.ok(
      battle.commands.responses.every(
        (response) => !battle.candidates.includes(response.actor),
      ),
    );
    assert.equal(battle.commands.responses[0].text, `东队已到${actual[0]}！`);
    assert.equal(
      battle.commands.responses[1].text,
      `西队已经守住${actual[1]}！`,
    );
    speakingPositions
      .get(battle.host)
      .add(
        battle.commands.orders.findIndex(
          (order) => order.actor === battle.host,
        ),
      );
  }
  for (const positions of speakingPositions.values())
    assert.deepEqual(positions, new Set([0, 1]));
});

test('the higher-mean candidate has fewer observations without determining the host', () => {
  for (const battle of cases) {
    const candidates = deriveRows(battle)
      .filter((row) => battle.candidates.includes(row.id))
      .sort((a, b) => b.mean - a.mean);
    assert.ok(candidates[0].count < candidates[1].count);
  }
});

test('neither guessing the host nor high mean alone can conclude before evidence', () => {
  for (const battle of cases) {
    const before = JSON.stringify(battle);
    for (const demon of DEMONS) {
      assert.equal(finalResult(battle, demon.id, false).ok, false);
      assert.equal(
        finalResult(battle, demon.id, true).ok,
        demon.id === battle.host,
      );
    }
    assert.equal(finalResult(battle, battle.outlier, true).ok, false);
    assert.equal(finalResult(battle, battle.host, true).ok, true);
    assert.equal(JSON.stringify(battle), before);
  }
});

test('restarting produces clean data and calculations do not mutate the case', () => {
  const battle = makeCase(0);
  const original = makeCase(0);
  deriveRows(battle).sort((a, b) => b.mean - a.mean);
  assert.deepEqual(battle, original);
  battle.records[0].threat = 0;
  battle.candidates.pop();
  battle.commands.responses[0].text = 'modified';
  assert.deepEqual(makeCase(0), original);
});
