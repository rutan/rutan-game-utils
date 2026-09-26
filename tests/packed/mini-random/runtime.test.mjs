import assert from 'node:assert/strict';
import { test } from 'node:test';
import { create, MiniRandom } from '@rutan/mini-random';

test('the installed package creates and restores a random generator', () => {
  const random = create();
  assert.ok(random instanceof MiniRandom);

  const restored = new MiniRandom(...random.dumpSeed());
  const value = random.rand();
  assert.equal(typeof value, 'number');
  assert.ok(value >= 0 && value <= 1);
  assert.equal(restored.rand(), value);
});
