import { createTween, Group, Tween } from '../src';

describe('utils', () => {
  describe('createTween', () => {
    test('create Tween instance', () => {
      const obj = { x: 0 };
      const group = new Group();
      const tween = createTween(obj, group);
      expect(tween instanceof Tween).toBeTruthy();
    });
  });
});
