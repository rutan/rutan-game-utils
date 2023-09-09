import { Group, Tween } from '../src';

describe('Tween', () => {
  let globalGroup = new Group();

  beforeEach(() => {
    globalGroup = new Group();
  });

  test('no group', () => {
    const obj = { x: 0 };
    const tween = new Tween(obj).to({ x: 100 }, 10);

    expect(() => tween.start()).toThrow(Error);
  });

  test('use group', () => {
    const group = new Group();
    const obj = { x: 0 };
    new Tween(obj).group(group).to({ x: 100 }, 10).start();
    expect(obj.x).toBe(0);

    globalGroup.update();
    expect(obj.x).toBe(0);

    for (let i = 0; i < 10; ++i) {
      group.update();
      expect(obj.x).toBe(10 * (i + 1));
    }
  });

  test('callback', () => {
    let flagA = false;
    let flagB = false;

    const obj = { x: 0 };
    new Tween(obj)
      .group(globalGroup)
      .wait(1)
      .call(() => (flagA = true))
      .call(() => (flagB = true))
      .start();

    expect(flagA).toBe(false);
    globalGroup.update();
    expect(flagA).toBe(true);
    expect(flagB).toBe(true);
  });

  test('add in callback', () => {
    const obj = { x: 0 };
    new Tween(obj)
      .group(globalGroup)
      .wait(1)
      .call(() => {
        new Tween(obj).group(globalGroup).to({ x: 100 }, 10).start();
      })
      .start();

    expect(obj.x).toBe(0);
    globalGroup.update();
    expect(obj.x).toBe(0);
    globalGroup.update();
    expect(obj.x).toBe(10);
  });

  test('async callback', () => {
    let flagA = false;
    let doneFunc: (() => void) | undefined;

    const obj = { x: 0 };
    new Tween(obj)
      .group(globalGroup)
      .wait(1)
      .call((done: () => void) => {
        doneFunc = done;
      })
      .call(() => (flagA = true))
      .start();

    expect(flagA).toBe(false);
    globalGroup.update();
    expect(flagA).toBe(false); // check first stop
    globalGroup.update();
    expect(flagA).toBe(false); // check second stop

    if (doneFunc) doneFunc();
    expect(flagA).toBe(false); // no update

    globalGroup.update();
    expect(flagA).toBe(true);
  });

  test('async callback (quickly)', () => {
    let flagA = false;

    const obj = { x: 0 };
    new Tween(obj)
      .group(globalGroup)
      .wait(1)
      .call((done: () => void) => done())
      .call(() => (flagA = true))
      .start();

    expect(flagA).toBe(false);
    globalGroup.update();
    expect(flagA).toBe(true);
  });

  test('finished', () => {
    const obj = { x: 0 };
    const tween = new Tween(obj).group(globalGroup).to({ x: 100 }, 2).start();
    expect(tween.finished).toBe(false);
    globalGroup.update();
    expect(tween.finished).toBe(false);
    globalGroup.update();
    expect(tween.finished).toBe(true);
  });

  test('abort', () => {
    const obj = { x: 0 };
    const tween = new Tween(obj).group(globalGroup).to({ x: 100 }, 10).start();
    expect(obj.x).toBe(0);

    globalGroup.update();
    expect(obj.x).toBe(10);

    tween.abort();
    globalGroup.update();
    expect(obj.x).toBe(10);
  });

  test('addUpdateListener', () => {
    let count = 0;
    const obj = { x: 0 };
    new Tween(obj)
      .group(globalGroup)
      .addUpdateListener(() => ++count)
      .to({ x: 100 }, 2)
      .start();

    globalGroup.update();
    expect(count).toBe(1);
    globalGroup.update();
    expect(count).toBe(2);
    globalGroup.update();
    expect(count).toBe(2);
  });

  test('group length', () => {
    const obj = { x: 0 };
    const group = new Group();
    expect(group.length).toBe(0);

    new Tween(obj).group(globalGroup).to({ x: 100 }, 2).group(group).start();
    expect(group.length).toBe(1);

    group.update();
    expect(group.length).toBe(1);

    group.update();
    expect(group.length).toBe(0);
  });

  test('group stop', () => {
    const obj = { x: 0 };
    const group = new Group();

    new Tween(obj).group(globalGroup).to({ x: 100 }, 1).to({ x: 200 }, 1).group(group).start();

    group.update();
    expect(obj.x).toBe(100);
    expect(group.length).toBe(1);
    group.clear();
    group.update();
    expect(obj.x).toBe(100);
    expect(group.length).toBe(0);
  });
});
