import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createTween, Group, Tween } from '@rutan/frame-tween';

test('the installed package animates a value through its public API', () => {
  const target = { x: 0 };
  const group = new Group();
  const tween = createTween(target, group).to({ x: 10 }, 1).start();

  assert.ok(tween instanceof Tween);
  group.update();
  assert.equal(target.x, 10);
  assert.equal(tween.finished, true);
});
