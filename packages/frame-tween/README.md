# frame-tween

## install

```
npm install @rutan/frame-tween
```

## Usage

```typescript
import { createTween, Group, easeInOutSine } from '@rutan/frame-tween';

const tweenGroup = new Group();
const tween = createTween(sprite, group, {
  x: 0,
})
  .to(
    {
      x: 100,
    },
    30,
    easeInOutSine,
  )
  .call(() => {
    console.log('finished!');
  })
  .start();

function mainLoop() {
  requestAnimationFrame(mainLoop);
  tweenGroup.update();
}
mainLoop();
```
