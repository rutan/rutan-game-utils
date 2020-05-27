export type EasingFunc = (n: number) => number;

export const Easing = {
  linear: (n: number) => n,
  easeInSine: (n: number) => 1 - Math.cos((n * Math.PI) / 2),
  easeOutSine: (n: number) => Math.sin((n * Math.PI) / 2),
  easeInOutSine: (n: number) => (1 - Math.cos(n * Math.PI)) / 2,
  easeInQuad: (n: number) => n * n,
  easeOutQuad: (n: number) => n * (2 - n),
  easeInOutQuad: (n: number) => {
    n *= 2;
    if (n < 1) {
      return (n * n) / 2;
    } else {
      --n;
      return (1 + n * (2 - n)) / 2;
    }
  },
  easeInCubic: (n: number) => Math.pow(n, 3),
  easeOutCubic: (n: number) => {
    --n;
    return Math.pow(n, 3) + 1;
  },
  easeInOutCubic: (n: number) => {
    n *= 2;
    if (n < 1) {
      return Math.pow(n, 3) / 2;
    } else {
      n -= 2;
      return (Math.pow(n, 3) + 2) / 2;
    }
  },
  easeInCircular: (n: number) => 1 - Math.sqrt(1 - n * n),
  easeOutCircular: (n: number) => {
    n--;
    return Math.sqrt(1 - n * n);
  },
  easeInOutCircular: (n: number) => {
    n *= 2;
    if (n < 1) {
      return -(Math.sqrt(1 - n * n) - 1) / 2;
    } else {
      n -= 2;
      return (Math.sqrt(1 - n * n) + 1) / 2;
    }
  },
};
