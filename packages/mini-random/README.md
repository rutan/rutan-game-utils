# MiniRandom

[![npm version](https://badge.fury.io/js/%40rutan%2Fmini-random.svg)](https://badge.fury.io/js/%40rutan%2Fmini-random)

## install

```
npm install @rutan/mini-random
```

## Usage

```javascript
import { MiniRandom, create } from '@rutan/mini-random';

const random1 = create();
random1.rand(); // => 0.8618663500207165
random1.randInt(100); // => 10

const random2 = new MiniRandom(...random1.dumpSeed());
console.log(random1.rand() === random2.rand()); // => true
```
