import { describe, expect, test } from 'vitest';
import { create } from '../src';

describe('create', () => {
  test('callable create', () => {
    const miniRandom = create();
    expect(miniRandom).toBeTruthy();
  });
});
