export default class MiniRandom {
  public static create() {
    const generator = new MiniRandom(Math.floor(Math.random() * 123456789));
    return generator;
  }

  private _x!: number;
  private _y!: number;
  private _z!: number;
  private _w!: number;

  constructor(x = 123456789, y = 362436069, z = 521288629, w = 88675123) {
    this.loadSeed(x, y, z, w);
  }

  public loadSeed(x: number, y: number, z: number, w: number) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
  }

  public dumpSeed() {
    return [this._x, this._y, this._z, this._w];
  }

  public rand() {
    return this._step() / 4294967295;
  }

  public randInt(max: number) {
    return Math.floor(this.rand() * max);
  }

  private _step() {
    const t = this._x ^ (this._x << 11);
    this._x = this._y;
    this._y = this._z;
    this._z = this._w;
    this._w = this._w ^ (this._w >>> 19) ^ (t ^ (t >>> 8));
    return this._w >>> 0;
  }
}
