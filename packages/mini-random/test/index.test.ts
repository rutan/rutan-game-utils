import MiniRandom from '../src/index';

describe('MiniRandom', () => {
  describe('create', () => {
    test('callable create', () => {
      const miniRandom = MiniRandom.create();
      expect(miniRandom).toBeTruthy();
    });
  });

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
      const miniRandom1 = MiniRandom.create();
      const miniRandom2 = new MiniRandom();
      expect(miniRandom1.rand()).not.toBe(miniRandom2.rand());
      const seeds = miniRandom1.dumpSeed();
      miniRandom2.loadSeed(seeds[0], seeds[1], seeds[2], seeds[3]);
      expect(miniRandom1.rand()).toBe(miniRandom2.rand());
    });
  });
});
