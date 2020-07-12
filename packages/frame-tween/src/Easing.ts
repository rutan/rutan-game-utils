export type EasingFunc = (n: number) => number;

export const linear = (n: number) => n;
export const easeInSine = (n: number) => 1 - Math.cos((n * Math.PI) / 2);
export const easeOutSine = (n: number) => Math.sin((n * Math.PI) / 2);
export const easeInOutSine = (n: number) => (1 - Math.cos(n * Math.PI)) / 2;
export const easeInQuad = (n: number) => n * n;
export const easeOutQuad = (n: number) => n * (2 - n);
export const easeInOutQuad = (n: number) => {
  n *= 2;
  if (n < 1) {
    return (n * n) / 2;
  } else {
    --n;
    return (1 + n * (2 - n)) / 2;
  }
};
export const easeInCubic = (n: number) => Math.pow(n, 3);
export const easeOutCubic = (n: number) => {
  --n;
  return Math.pow(n, 3) + 1;
};
export const easeInOutCubic = (n: number) => {
  n *= 2;
  if (n < 1) {
    return Math.pow(n, 3) / 2;
  } else {
    n -= 2;
    return (Math.pow(n, 3) + 2) / 2;
  }
};
export const easeInCircular = (n: number) => 1 - Math.sqrt(1 - n * n);
export const easeOutCircular = (n: number) => {
  n--;
  return Math.sqrt(1 - n * n);
};
export const easeInOutCircular = (n: number) => {
  n *= 2;
  if (n < 1) {
    return -(Math.sqrt(1 - n * n) - 1) / 2;
  } else {
    n -= 2;
    return (Math.sqrt(1 - n * n) + 1) / 2;
  }
};
