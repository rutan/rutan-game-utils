import { EasingFunc } from './Easing';

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
