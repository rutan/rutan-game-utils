import { MiniRandom } from './MiniRandom';

export function create() {
  return new MiniRandom(Math.floor(Math.random() * 123456789));
}
