# MiniRandom

[![npm version](https://badge.fury.io/js/%40rutan%2Fmini-random.svg)](https://badge.fury.io/js/%40rutan%2Fmini-random)

## install

```
npm install @rutan/mini-random
```

## Usage

```javascript
import { MiniRandom } from '@rutan/mini-random';

const random = MiniRandom.create();
random.rand(); // => 0.8618663500207165
random.randInt(100); // => 10
```
