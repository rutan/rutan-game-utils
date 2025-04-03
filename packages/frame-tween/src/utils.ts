import { Group } from './Group.js';
import { Tween } from './Tween.js';

export function createTween<T>(obj: T, group: Group, initial?: Partial<T>) {
  return new Tween(obj, initial).group(group);
}
