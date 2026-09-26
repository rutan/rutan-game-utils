import { create, MiniRandom } from '@rutan/mini-random';

const random: MiniRandom = create();
export const seed: [number, number, number, number] = random.dumpSeed();
export const value: number = new MiniRandom(...seed).randInt(10);

// @ts-expect-error The upper bound must be numeric.
random.randInt('10');
// @ts-expect-error A random value cannot be assigned to a string.
export const invalidValue: string = random.rand();
