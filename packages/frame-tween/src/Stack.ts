import { EasingFunc } from './Easing.js';

export type TweenStack = MoveStack | CallStack;

export interface MoveStack {
  type: 'move';
  params: any;
  duration: number;
  easingFunc: EasingFunc;
}

export interface CallStack {
  type: 'call';
  func: Function;
}
