import { linear, EasingFunc } from './Easing.js';
import { Group } from './Group.js';
import { addGroup, finishTween, removeGroup } from './internal/symbol.js';
import { TweenStack } from './Stack.js';

export type TweenStatus = 'idle' | 'running' | 'completed' | 'aborted';

export class Tween<T> {
  private readonly _target: T;
  private readonly _stacks: TweenStack<T>[];
  private _group: Group | null;
  private _onUpdateListeners: (() => void)[];

  private _status: TweenStatus = 'idle';

  constructor(target: T);

  /**
   * @deprecated The `initialParams` parameter is deprecated.
   * Use `new Tween(target).set(initialParams)` instead.
   */
  constructor(target: T, initialParams: Partial<T> | undefined);

  constructor(target: T, initialParams?: Partial<T>) {
    this._target = target;
    this._stacks = [];
    this._group = null;
    this._onUpdateListeners = [];

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

  get status() {
    return this._status;
  }

  get finished() {
    return this._status === 'completed' || this._status === 'aborted';
  }

  group(group: Group) {
    if (this._status === 'running') {
      throw new Error('Tween is already in a group and is running');
    }

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

  set(params: Partial<T>) {
    this._stacks.push({
      type: 'set',
      params,
    });
    return this;
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
    if (this._status === 'running') {
      console.warn('Tween is already running.');
      return this;
    }

    this._status = 'running';
    try {
      this._group[addGroup](this);
    } catch (error) {
      this.abort();
      throw error;
    }
    return this;
  }

  abort() {
    if (this.finished) return this;

    this._status = 'aborted';
    this._cancelAnimation();
    return this;
  }

  [finishTween]() {
    if (this._status !== 'running') {
      throw new Error('Tween is not running, cannot finish.');
    }

    this._status = 'completed';
    this._cancelAnimation();
  }

  private _cancelAnimation() {
    this._stacks.length = 0;
    this._group?.[removeGroup](this);
  }
}
