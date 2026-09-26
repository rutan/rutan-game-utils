import { createTween, Group, Tween } from '@rutan/frame-tween';

const group = new Group();
const tween: Tween<{ x: number }> = createTween({ x: 0 }, group).to({ x: 10 }, 1);
export const position: number = tween.target.x;
export const finished: boolean = tween.finished;

// @ts-expect-error The target property must retain its numeric type.
tween.to({ x: '10' }, 1);
// @ts-expect-error A numeric position cannot be assigned to a string.
export const invalidPosition: string = tween.target.x;
