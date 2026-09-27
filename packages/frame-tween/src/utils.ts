import { Group } from './Group.js';
import { Tween } from './Tween.js';

export function createTween<T>(obj: T, group: Group): Tween<T>;

/**
 * @deprecated The `initial` parameter is deprecated.
 * Use `createTween(obj, group).set(initial)` instead.
 */
export function createTween<T>(obj: T, group: Group, initial: Partial<T> | undefined): Tween<T>;

export function createTween<T>(obj: T, group: Group, initial?: Partial<T>) {
  return new Tween(obj, initial).group(group);
}
