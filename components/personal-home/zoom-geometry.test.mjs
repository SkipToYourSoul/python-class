import assert from 'node:assert/strict';
import test from 'node:test';
import {
  constrainView,
  fittedSize,
  pinchView,
  zoomAt,
} from './zoom-geometry.ts';

const bounds = { width: 400, height: 300, imageWidth: 800, imageHeight: 400 };
const near = (actual, expected) =>
  assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);

test('contain keeps full landscape and portrait images in the viewport', () => {
  assert.deepEqual(fittedSize(bounds), { width: 400, height: 200 });
  assert.deepEqual(
    fittedSize({ ...bounds, imageWidth: 400, imageHeight: 800 }),
    { width: 150, height: 300 },
  );
});
test('fit resets pan; pan clamps both axes with letterboxing accounted for', () => {
  assert.deepEqual(constrainView({ scale: 1, x: 200, y: -300 }, bounds), {
    scale: 1,
    x: 0,
    y: -0,
  });
  assert.deepEqual(constrainView({ scale: 2, x: 999, y: -999 }, bounds), {
    scale: 2,
    x: 200,
    y: -50,
  });
  const portrait = { ...bounds, imageWidth: 400, imageHeight: 800 };
  assert.equal(constrainView({ scale: 2, x: 99, y: 30 }, portrait).x, 0);
});
test('wheel or button zoom retains the exact content point beneath its anchor', () => {
  const before = { scale: 2, x: 30, y: -10 },
    anchor = { x: 70, y: 30 };
  const after = zoomAt(before, 3, anchor, bounds);
  near(
    (anchor.x - before.x) / before.scale,
    (anchor.x - after.x) / after.scale,
  );
  near(
    (anchor.y - before.y) / before.scale,
    (anchor.y - after.y) / after.scale,
  );
});
test('pinch follows both scale and moving midpoint without jumping', () => {
  const start = { scale: 2, x: 20, y: -10 };
  const after = pinchView(
    start,
    { x: -50, y: -20 },
    { x: 50, y: 20 },
    { x: -75, y: -20 },
    { x: 125, y: 60 },
    bounds,
  );
  near(after.scale, 4);
  near(after.x, 65);
  near(after.y, 0);
});
test('pinch with stationary fingers preserves current pan exactly', () => {
  const start = { scale: 2, x: 20, y: -10 },
    a = { x: -30, y: 0 },
    b = { x: 30, y: 0 };
  assert.deepEqual(pinchView(start, a, b, a, b, bounds), start);
});
test('extreme zoom and pinch stay finite and respect min/max scale', () => {
  assert.equal(
    zoomAt({ scale: 1, x: 0, y: 0 }, 100, { x: 0, y: 0 }, bounds).scale,
    6,
  );
  assert.equal(
    zoomAt({ scale: 2, x: 10, y: 10 }, 0, { x: 20, y: 30 }, bounds).scale,
    1,
  );
  const after = pinchView(
    { scale: 1, x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: -500, y: 0 },
    { x: 500, y: 0 },
    bounds,
  );
  assert.ok(Object.values(after).every(Number.isFinite));
  assert.equal(after.scale, 6);
});
test('resizing clamps an already panned image to its new boundaries', () => {
  const after = constrainView(
    { scale: 2, x: 200, y: 150 },
    { width: 300, height: 600, imageWidth: 800, imageHeight: 400 },
  );
  assert.deepEqual(after, { scale: 2, x: 150, y: 0 });
});
