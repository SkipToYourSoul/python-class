// Run: node scripts/test-lesson06-battle.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';
const base = new URL(
  '../app/courses/ai-with-python/lesson-06/',
  import.meta.url,
);
const moduleUrl = (source) =>
  'data:text/javascript;base64,' +
  Buffer.from(
    ts.transpile(source, {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    }),
  ).toString('base64');
const dataUrl = moduleUrl(
  await readFile(new URL('study-data.ts', base), 'utf8'),
);
const data = await import(dataUrl);
const campaignUrl = moduleUrl(
  (await readFile(new URL('campaign-engine.ts', base), 'utf8')).replace(
    "'./study-data'",
    JSON.stringify(dataUrl),
  ),
);
const { assessTowerDecision, canFaceBoss, completeTower, initialCampaign } =
  await import(campaignUrl);
const battleUrl = moduleUrl(
  (await readFile(new URL('final-battle-engine.ts', base), 'utf8'))
    .replace("'./study-data'", JSON.stringify(dataUrl))
    .replace("'./campaign-engine'", JSON.stringify(campaignUrl)),
);
const { assessDecision, completeBattle, initialBattle } = await import(
  battleUrl
);
const correctTower = (tower, previous = initialCampaign) => {
  const row = data.battleReadings.find((item) => item.tower === tower);
  return {
    ...previous,
    phase: 'attacking',
    tower,
    hour: String(row.hour),
    equipment: row.weakness,
    energy: String(row.energy),
    defense: String(row.defense),
  };
};
const correctBoss = {
  ...initialBattle,
  phase: 'attacking',
  part: '胸甲',
  energy: '18',
  defense: '24',
  equipment: '火焰',
};
const allTowers = { completed: [...data.TOWER_NAMES] };

test('36 historical records produce three separate low-shield plans and three fresh readings', () => {
  assert.equal(data.history.length, 36);
  assert.deepEqual(
    data.plans.map((row) => [row.tower, row.hour]),
    [
      ['北塔', 11],
      ['东塔', 14],
      ['西塔', 17],
    ],
  );
  for (const tower of data.TOWER_NAMES) {
    const row = correctTower(tower);
    assert.equal(assessTowerDecision(row).success, true);
    const historical = data.plans.find((item) => item.tower === tower);
    assert.equal(
      assessTowerDecision({
        ...row,
        energy: String(historical.energy),
        defense: String(historical.defense),
      }).success,
      false,
      'historical values cannot replace fresh on-site evidence',
    );
  }
});

test('tower decisions require a low-shield time, lowest defense within its windows and matching equipment', () => {
  for (const tower of data.TOWER_NAMES) {
    const correct = correctTower(tower);
    const strong = data.history.find(
      (row) => row.tower === tower && row.energy >= 30,
    );
    const otherWindow = data.history.find(
      (row) =>
        row.tower === tower &&
        row.energy < 30 &&
        row.hour !== Number(correct.hour),
    );
    for (const patch of [
      { hour: String(strong.hour) },
      { hour: String(otherWindow.hour) },
      { equipment: '错误装备' },
      { energy: '' },
      { energy: 'Infinity' },
      { defense: '' },
      { defense: String(Number(correct.defense) + 1) },
      { tower: '不存在的塔' },
    ]) {
      assert.equal(
        assessTowerDecision({ ...correct, ...patch }).success,
        false,
        `${tower}: ${JSON.stringify(patch)}`,
      );
    }
  }
});

test('north-tower feedback explains why the lowest shield alone is not the best plan', () => {
  const result = assessTowerDecision({
    ...correctTower('北塔'),
    hour: '10',
  });
  assert.equal(result.success, false);
  assert.match(result.message, /10 时防御 42/);
  assert.match(result.message, /11 时只有 30/);
});

test('an ideal historical plan cannot authorize an attack when fresh shield reaches the threshold', () => {
  const fresh = data.battleReadings.find((row) => row.tower === '北塔');
  const originalEnergy = fresh.energy;
  try {
    fresh.energy = data.ATTACK_THRESHOLD;
    const instruction = correctTower('北塔');
    const result = assessTowerDecision(instruction);
    assert.equal(result.success, false);
    assert.match(result.message, /阵前外罩 30 ≥ 30/);
    assert.equal(completeTower(instruction), instruction);
  } finally {
    fresh.energy = originalEnergy;
  }
});

test('each tower contributes once, preserves its receipt and all three are needed for the boss', () => {
  let state = completeTower(correctTower('东塔'));
  assert.deepEqual(state.completed, ['东塔']);
  assert.equal(canFaceBoss(state), false);
  for (let index = 0; index < 3; index++)
    state = completeTower(correctTower('东塔', state));
  assert.deepEqual(state.completed, ['东塔']);
  assert.equal(canFaceBoss(state), false);
  const eastReceipt = state.receipts['东塔'];
  state = completeTower(correctTower('西塔', state));
  assert.equal(canFaceBoss(state), false);
  state = completeTower(correctTower('北塔', state));
  assert.deepEqual(state.completed, data.TOWER_NAMES);
  assert.equal(canFaceBoss(state), true);
  assert.equal(Object.keys(state.receipts).length, 3);
  assert.deepEqual(state.receipts['东塔'], eastReceipt);
  assert.equal(canFaceBoss({ completed: ['北塔', '北塔', '北塔'] }), false);
  assert.equal(
    canFaceBoss({ completed: ['北塔', '东塔', '不存在的塔'] }),
    false,
  );
});

test('feedback cannot complete a tower and bad evidence cannot be promoted by finishing animation', () => {
  const correct = correctTower('北塔');
  const feedback = { ...correct, phase: 'feedback' };
  assert.equal(completeTower(feedback), feedback);
  const incorrect = { ...correct, energy: '999' };
  assert.equal(completeTower(incorrect), incorrect);
});

test('opening the final URL or replaying after a tower reset cannot bypass the three-tower gate', () => {
  for (const campaign of [
    initialCampaign,
    { completed: ['北塔'] },
    { completed: ['北塔', '东塔'] },
    { completed: ['北塔', '北塔', '北塔'] },
  ]) {
    assert.equal(assessDecision(correctBoss, campaign).success, false);
    assert.equal(completeBattle(correctBoss, campaign), correctBoss);
  }
  assert.equal(assessDecision(correctBoss, allTowers).success, true);
  assert.equal(completeBattle(correctBoss, allTowers).phase, 'victory');
});

test('the boss requires chest armor, matching fire equipment and both exact evidence values', () => {
  for (const row of data.bossRecords) {
    const state = {
      ...correctBoss,
      part: row.part,
      energy: String(row.energy),
      defense: String(row.defense),
      equipment: row.weakness,
    };
    assert.equal(assessDecision(state, allTowers).success, row.part === '胸甲');
  }
  for (const patch of [
    { part: '' },
    { equipment: '强光' },
    { equipment: '' },
    { energy: '' },
    { energy: ' ' },
    { energy: 'NaN' },
    { energy: '22' },
    { defense: '' },
    { defense: '40' },
  ]) {
    const state = { ...correctBoss, ...patch };
    assert.equal(
      assessDecision(state, allTowers).success,
      false,
      JSON.stringify(patch),
    );
    assert.equal(completeBattle(state, allTowers), state);
  }
  assert.match(
    assessDecision(
      {
        ...correctBoss,
        part: '腰甲',
        energy: '22',
        defense: '40',
        equipment: '强光',
      },
      allTowers,
    ).message,
    /防御最低/,
  );
  const before = structuredClone(correctBoss);
  assessDecision(correctBoss, initialCampaign);
  assert.deepEqual(correctBoss, before);
});

test('incorrect boss readings guide another attempt without revealing the answer', () => {
  for (const patch of [
    { energy: '', defense: '' },
    { energy: '24', defense: '18' },
    { energy: '22', defense: '40' },
  ]) {
    const result = assessDecision({ ...correctBoss, ...patch }, allTowers);
    assert.equal(result.success, false);
    assert.match(result.message, /纵轴是外罩，横轴是防御/);
    assert.match(result.message, /展开读数提示/);
    assert.doesNotMatch(result.message, /18|24|火焰/);
  }
});
