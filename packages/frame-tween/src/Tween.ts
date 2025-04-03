import { Group } from './Group.js';
import { linear, EasingFunc } from './Easing.js';
import { TweenStack } from './Stack.js';

export class Tween<T> {
  private readonly _target: T;
  private readonly _stacks: TweenStack[];
  private _group: Group | null;
  private _onUpdateListeners: (() => void)[];
  private _finished: boolean;

  constructor(target: T, initialParams?: Partial<T>) {
    this._target = target;
    this._stacks = [];
    this._group = null;
    this._onUpdateListeners = [];
    this._finished = false;

    if (initialParams) {
      (Object.keys(initialParams) as (keyof T)[]).forEach((key) => {
        target[key] = initialParams[key]!;
      });
    }
  }

  get stacks() {
    return this._stacks;
  }

  get target() {
    return this._target;
  }

  get finished() {
    return this._finished;
  }

  group(group: Group) {
    this._group = group;
    return this;
  }

  addUpdateListener(func: () => void) {
    this._onUpdateListeners.push(func);
    return this;
  }

  removeUpdateListener(func: () => void) {
    this._onUpdateListeners = this._onUpdateListeners.filter((f) => f !== func);
    return this;
  }

  callUpdateListeners() {
    this._onUpdateListeners.forEach((f) => f());
  }

  to(params: Partial<T>, duration: number, easingFunc?: EasingFunc) {
    this._stacks.push({
      type: 'move',
      params,
      duration,
      easingFunc: easingFunc || linear,
    });
    return this;
  }

  wait(duration: number) {
    this._stacks.push({
      type: 'move',
      params: {},
      duration,
      easingFunc: linear,
    });
    return this;
  }

  call(func: Function) {
    this._stacks.push({
      type: 'call',
      func,
    });
    return this;
  }

  start() {
    if (!this._group) throw new Error('not grouped');

    this._group.add(this);
    return this;
  }

  abort() {
    this._stacks.length = 0;
    this._finished = true;
    return this;
  }
}
