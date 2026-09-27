import { EasingFunc } from './Easing.js';

export type TweenStack<T> = SetStack<T> | MoveStack<T> | CallStack;

export interface SetStack<T> {
  type: 'set';
  params: Partial<T>;
}

export interface MoveStack<T> {
  type: 'move';
  params: Partial<T>;
  duration: number;
  easingFunc: EasingFunc;
}

export interface CallStack {
  type: 'call';
  func: Function;
}
