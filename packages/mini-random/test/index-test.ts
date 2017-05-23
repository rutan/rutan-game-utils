import * as mocha from 'mocha';
import * as assert from 'power-assert';
import MiniRandom from '../src/index';

describe('MiniRandom', () => {
    context('create', () => {
        it('callable create', () => {
            const miniRandom = MiniRandom.create();
            assert.ok(miniRandom);
        });
    });

    context('rand', () => {
        it('valid value', () => {
            const miniRandom = new MiniRandom();
            assert.ok(miniRandom.rand() === (3701687786 / 4294967295));
            assert.ok(miniRandom.rand() === (458299110 / 4294967295));
            assert.ok(miniRandom.rand() === (2500872618 / 4294967295));
        });
    });

    context('randInt', () => {
        it('valid value', () => {
            const miniRandom = new MiniRandom();
            assert.ok(miniRandom.randInt(4294967295) === (3701687786));
            assert.ok(miniRandom.randInt(4294967295) === (458299110));
            assert.ok(miniRandom.randInt(4294967295) === (2500872618));
        });
    });

    context('seed', () => {
        it('use seed', () => {
            const miniRandom1 = MiniRandom.create();
            const miniRandom2 = new MiniRandom();
            assert.ok(miniRandom1.rand() !== miniRandom2.rand());
            const seeds = miniRandom1.dumpSeed();
            miniRandom2.loadSeed(seeds[0], seeds[1], seeds[2], seeds[3]);
            assert.ok(miniRandom1.rand() === miniRandom2.rand());
        });
    });
});