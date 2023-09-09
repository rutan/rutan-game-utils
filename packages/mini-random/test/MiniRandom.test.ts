import { MiniRandom } from '../src';

describe('MiniRandom', () => {
  describe('rand', () => {
    test('valid value', () => {
      const miniRandom = new MiniRandom();
      expect(miniRandom.rand()).toBe(3701687786 / 4294967295);
      expect(miniRandom.rand()).toBe(458299110 / 4294967295);
      expect(miniRandom.rand()).toBe(2500872618 / 4294967295);
    });
  });

  describe('randInt', () => {
    test('valid value', () => {
      const miniRandom = new MiniRandom();
      expect(miniRandom.randInt(4294967295)).toBe(3701687786);
      expect(miniRandom.randInt(4294967295)).toBe(458299110);
      expect(miniRandom.randInt(4294967295)).toBe(2500872618);
    });
  });

  describe('seed', () => {
    test('use seed', () => {
      const miniRandom1 = new MiniRandom(1234, 5678, 9012, 3456);
      const miniRandom2 = new MiniRandom(9876, 5432, 1098, 7654);
      expect(miniRandom1.rand()).not.toBe(miniRandom2.rand());
      miniRandom2.loadSeed(...miniRandom1.dumpSeed());
      expect(miniRandom1.rand()).toBe(miniRandom2.rand());
    });
  });
});
