// Run: node scripts/test-lesson06-boss-demo.mjs
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
const referenceUrl = moduleUrl(
  await readFile(new URL('practice-content.ts', base), 'utf8'),
);
const content = await import(
  moduleUrl(
    (await readFile(new URL('boss-finale-content.ts', base), 'utf8')).replace(
      "'./practice-content'",
      JSON.stringify(referenceUrl),
    ),
  )
);
const navigation = await import(
  moduleUrl(await readFile(new URL('lesson-data.ts', base), 'utf8'))
);
const reference = await import(referenceUrl);

test('one final demonstration replaces three boss pages while old links remain valid', () => {
  assert.equal(navigation.scenes.length, 33);
  assert.equal(
    navigation.scenes.filter((scene) =>
      ['l6-final-mission', 'l6-current', 'l6-battle'].includes(scene.id),
    ).length,
    1,
  );
  assert.equal(navigation.sceneAliases['l6-current'], 'l6-final-mission');
  assert.equal(navigation.sceneAliases['l6-battle'], 'l6-final-mission');
  assert(navigation.scenes.some((scene) => scene.id === 'l6-tower-battle'));
  assert.deepEqual(
    navigation.scenes.slice(29).map((scene) => scene.id),
    ['l6-latest', 'l6-tower-battle', 'l6-final-mission', 'l6-summary'],
  );
});

test('seeking backwards or restarting resolves the corresponding code rather than retaining a later highlight', () => {
  const { BOSS_MOMENTS: moments, bossDemoPhaseAt: at } = content;
  assert.equal(at(85).from, moments.victory);
  assert.equal(at(56).from, moments.bossAppears);
  assert.equal(at(55).from, moments.gateOpen);
  for (const phase of content.BOSS_DEMO_PHASES.filter(
    (phase) => phase.from >= moments.decide,
  )) {
    assert.deepEqual(at(phase.from).lines, []);
  }
  assert.deepEqual(at(moments.decide - 0.05).lines, [13, 14, 15, 16, 17, 18]);
  assert.deepEqual(at(moments.plot - 0.05).lines, [11]);
  assert.deepEqual(at(23).lines, [10]);
  assert.deepEqual(at(16).lines, [9]);
  assert.deepEqual(at(8).lines, [5, 6, 7]);
  assert.deepEqual(at(3).lines, [1, 2, 3, 4]);
  assert.deepEqual(at(0).lines, [0]);
  for (const phase of content.BOSS_DEMO_PHASES) {
    assert.equal(at(phase.from).from, phase.from);
    assert.equal(at(phase.from + 0.05).from, phase.from);
  }
});

test('every highlight refers to a visible statement from the same runnable reference', () => {
  const lines = content.BOSS_DEMO_CODE.split('\n').map((line) =>
    line.startsWith('# ') ? '' : line.split('  # ')[0],
  );
  for (const phase of content.BOSS_DEMO_PHASES) {
    assert(phase.from < content.BOSS_VIDEO.duration);
    for (const index of phase.lines) assert(lines[index]?.trim());
  }
  for (const line of lines.filter((line) => line.trim()))
    assert(reference.CURRENT_CODE.split('\n').includes(line));
  assert(
    lines.indexOf('weak = boss[boss["energy"] < 30]') <
      lines.indexOf('print(weak.sort_values("defense"))'),
  );
  assert(!content.BOSS_DEMO_CODE.includes('itertuples'));
});
