# frame-tween

## install

```
npm install @rutan/frame-tween
```

## Usage

### Simple

```javascript
import { Tween, Easing } from '@rutan/frame-tween';

Tween.create(sprite, {
  x: 0,
})
  .to(
    {
      x: 100,
    },
    30,
    Easing.linear
  )
  .call(() => {
    console.log('finished!');
  })
  .start();

function mainLoop() {
  requestAnimationFrame(mainLoop);
  Tween.update();
}
mainLoop();
```

### use Group

```javascript
import { Tween, Group, Easing } from '@rutan/frame-tween';

const groupA = new Group();
Tween.create(spriteA, {
  x: 0,
})
  .group(groupA)
  .to(
    {
      x: 100,
    },
    30,
    Easing.linear
  )
  .start();

const groupB = new Group();
groupB
  .create(spriteB, { y: 0 })
  .to(
    {
      y: 100,
    },
    30,
    Easing.linear
  )
  .start();

function mainLoop() {
  requestAnimationFrame(mainLoop);
  groupA.update();
  groupB.update();
}
mainLoop();
```
