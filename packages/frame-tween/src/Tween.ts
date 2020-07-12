import { Group } from './Group';
import { linear, EasingFunc } from './Easing';
import { TweenStack } from './Stack';

export class Tween {
  static _globalGroup = new Group();

  static create(target: any, initialParams?: any) {
    return new Tween(target, initialParams);
  }

  static update() {
    Tween._globalGroup.update();
  }

  private readonly _target: any;
  private readonly _stacks: TweenStack[];
  private _group: Group | null;
  private _finished: boolean;

  constructor(target: any, initialParams?: any) {
    this._target = target;
    this._stacks = [];
    this._group = null;
    this._finished = false;

    if (initialParams) {
      Object.keys(initialParams).forEach((key) => {
        target[key] = initialParams[key];
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

  to(params: any, duration: number, easingFunc?: EasingFunc) {
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
    if (!this._group) {
      this._group = Tween._globalGroup;
    }
    this._group.add(this);
    return this;
  }

  abort() {
    if (this._group) {
      this._group.remove(this);
    }
    this._stacks.length = 0;
    this._finished = true;
    return this;
  }
}
