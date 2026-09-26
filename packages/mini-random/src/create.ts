import { MiniRandom } from './MiniRandom.js';

export function create() {
  return new MiniRandom(Math.floor(Math.random() * 123456789));
}
