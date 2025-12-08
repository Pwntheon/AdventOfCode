export default class Vec3 {
  readonly #x: number;
  readonly #y: number;
  readonly #z: number;
  constructor(x: number, y: number, z: number) {
    this.#x = x;
    this.#y = y;
    this.#z = z;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get z() {
    return this.#z;
  }

  toString() {
    return `[${this.x},${this.y},${this.z}]`;
  }

  equals(other: Vec3) {
    return this.toString() === other.toString();
  }

  add(other: Vec3) {
    return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  sub(other: Vec3) {
    return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  mul(scalar: number) {
    return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  div(scalar: number) {
    return new Vec3(this.x / scalar, this.y / scalar, this.z / scalar);
  }

  distance(target: Vec3 = Unit.Origin) {
    return Math.sqrt(
      Math.pow(this.x - target.x, 2)
    + Math.pow(this.y - target.y, 2)
    + Math.pow(this.z - target.z, 2));
  }

  length(manhattan = true) {
    if (!manhattan) return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    return Math.abs(this.x) + Math.abs(this.y);
  }
}

export const Unit = {
    Origin: new Vec3(0, 0, 0)
};