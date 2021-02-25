import { Tween } from './Tween';
import { linear, EasingFunc } from './Easing';

interface AnimationState {
  startParams: any;
  finishParams: any;
  duration: number;
  easingFunc: EasingFunc;
  timer: number;
  isWaitingCallback: boolean;
}

type TweenableObject = Tween<any>;
type TweenItem = [TweenableObject, AnimationState];

export class Group {
  private _items: TweenItem[] = [];

  get length() {
    return this._items.length;
  }

  add(tween: TweenableObject) {
    const state: AnimationState = {
      startParams: {},
      finishParams: {},
      duration: 0,
      easingFunc: linear,
      timer: 0,
      isWaitingCallback: false,
    };
    if (!this._beginAnimation(tween, state)) return;

    this._items.push([tween, state]);
  }

  remove(tween: TweenableObject) {
    this._items = this._items.filter(([t, _]) => t !== tween);
  }

  update() {
    const items = this._items.slice();
    this._items.length = 0;
    this._items = items
      .filter(([tween, state]) => {
        if (tween.finished) return false;
        if (state.isWaitingCallback) return true;

        ++state.timer;

        if (state.timer < state.duration) {
          const n = state.easingFunc(state.timer / state.duration);
          Object.keys(state.finishParams).forEach((key) => {
            tween.target[key] = state.startParams[key] + (state.finishParams[key] - state.startParams[key]) * n;
          });
        } else {
          Object.keys(state.finishParams).forEach((key) => {
            tween.target[key] = state.finishParams[key];
          });
        }

        const result = state.timer < state.duration || this._beginAnimation(tween, state);
        tween.callUpdateListeners();
        if (!result) tween.abort();

        return result;
      })
      .concat(this._items);
  }

  private _beginAnimation(tween: TweenableObject, state: AnimationState) {
    while (true) {
      const stack = tween.stacks.shift();

      if (!stack) return false;

      switch (stack.type) {
        case 'call':
          if (stack.func.length === 0) {
            stack.func();
          } else {
            state.isWaitingCallback = true;
            stack.func(() => (state.isWaitingCallback = false));
          }

          if (state.isWaitingCallback) {
            return true;
          } else {
            break; // loop!
          }
        case 'move': {
          const startParams: any = {};
          Object.keys(stack.params).forEach((key) => {
            startParams[key] = tween.target[key];
          });

          state.startParams = startParams;
          state.finishParams = stack.params;
          state.duration = stack.duration;
          state.easingFunc = stack.easingFunc;
          state.timer = 0;
          return true;
        }
      }
    }
  }
}
