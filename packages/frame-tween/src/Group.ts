import { linear, EasingFunc } from './Easing.js';
import { addGroup, finishTween, removeGroup } from './internal/symbol.js';
import { Tween } from './Tween.js';

interface AnimationState {
  startParams: any;
  finishParams: any;
  duration: number;
  easingFunc: EasingFunc;
  timer: number;
  isWaitingCallback: boolean;
}

type TweenableObject = Tween<any>;

interface GroupEntry {
  state: AnimationState;
  registrationId: number;
}

export class Group {
  private _items: Map<TweenableObject, GroupEntry> = new Map();
  private _lastRegistrationId = 0;
  private _isUpdating = false;

  get length() {
    return this._items.size;
  }

  /** @deprecated Use `Tween.group(group).start()` */
  add(tween: TweenableObject) {
    tween.group(this).start();
  }

  /** @deprecated Use `Tween.abort()` */
  remove(tween: TweenableObject) {
    tween.abort();
  }

  [addGroup](tween: TweenableObject) {
    // If it is already registered, do nothing
    if (this._items.has(tween)) return;

    const state: AnimationState = {
      startParams: {},
      finishParams: {},
      duration: 0,
      easingFunc: linear,
      timer: 0,
      isWaitingCallback: false,
    };

    const keep = this._beginAnimation(tween, state);

    // If it is aborted in the callback at the start, do not register it
    if (tween.finished) return;

    if (!keep) {
      tween[finishTween]();
      return;
    }

    this._items.set(tween, {
      state,
      registrationId: ++this._lastRegistrationId,
    });
  }

  [removeGroup](tween: TweenableObject) {
    this._items.delete(tween);
  }

  has(tween: TweenableObject) {
    return this._items.has(tween);
  }

  clear() {
    for (const tween of this._items.keys()) {
      tween.abort();
    }
    this._items.clear();
  }

  update() {
    if (this._isUpdating) {
      throw new Error('Group.update() is already running');
    }
    this._isUpdating = true;
    const lastRegistrationId = this._lastRegistrationId;

    try {
      for (const [tween, entry] of this._items) {
        // Tweens added during update() will be processed in the next update()
        if (entry.registrationId > lastRegistrationId) continue;

        if (tween.finished) {
          this._items.delete(tween);
          continue;
        }
        if (entry.state.isWaitingCallback) continue;

        const keep = this._updateTween(tween, entry.state);

        // If the tween is removed and re-registered in the callback, do not touch it
        if (this._items.get(tween) !== entry) continue;

        if (!keep || tween.finished) {
          this._items.delete(tween);
          if (!tween.finished) tween[finishTween]();
        }
      }
    } finally {
      this._isUpdating = false;
    }
  }

  private _updateTween(tween: TweenableObject, state: AnimationState) {
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

    return result;
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
