import assert from 'node:assert/strict';
import test from 'node:test';
import {
  resumeScrubPosition,
  scrubPose,
  smoothProgress,
  transitionPose,
} from './paper-motion.ts';

test('the outgoing print closes fully before the incoming print opens in the same pose', () => {
  const before = transitionPose(0.44 - 1 / 60);
  const after = transitionPose(0.44 + 1 / 60);
  assert.equal(before.closing, true);
  assert.equal(after.closing, false);
  assert.ok(before.fold > 0.975 && after.fold > 0.975);
  assert.equal(transitionPose(0.44).fold, 1);
});

test('dragging across either chapter boundary and reversing retraces the same fold', () => {
  for (const midpoint of [0.5, 1.5]) {
    const before = scrubPose(midpoint - 0.01);
    const after = scrubPose(midpoint + 0.01);
    assert.equal(after.chapter, before.chapter + 1);
    assert.ok(Math.abs(before.fold - after.fold) < 1e-10);
    assert.ok(before.fold > 0.975);
  }
  assert.equal(scrubPose(-3).fold, 0);
  assert.equal(scrubPose(5).fold, 0);
});

test('interrupting a partial fold starts from its current pose and finishes flat', () => {
  assert.equal(transitionPose(0, 0.63).fold, 0.63);
  assert.equal(transitionPose(1, 0.63).fold, 0);
  for (let i = 0; i <= 100; i++) {
    const fold = transitionPose(i / 100, 0.63).fold;
    assert.ok(fold >= 0 && fold <= 1);
  }
});

test('unfolding has zero velocity at both ends for a settled handoff', () => {
  const epsilon = 1e-5;
  assert.ok(smoothProgress(epsilon) / epsilon < 0.0001);
  assert.ok((1 - smoothProgress(1 - epsilon)) / epsilon < 0.0001);
});

test('re-grabbing either side of an in-flight page preserves its fold and chapter', () => {
  for (const [chapter, pointer] of [
    [0, 0.3],
    [1, 0.7],
    [1, 1.3],
    [2, 1.7],
  ]) {
    const pose = scrubPose(resumeScrubPosition(chapter, 0.63, pointer));
    assert.equal(pose.chapter, chapter);
    assert.ok(Math.abs(pose.fold - 0.63) < 1e-10);
  }
});
