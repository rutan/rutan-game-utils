import { Group } from './Group';
import { Tween } from './Tween';

export function createTween<T>(obj: T, group: Group, initial?: Partial<T>) {
  return new Tween(obj, initial).group(group);
}
