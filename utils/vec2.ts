import { test } from "./test";

// Slightly higher epsilon than minimum, to allow for
// more than one operation without rounding in between
const EPSILON = Number.EPSILON * 100;

export default class Vec2i {
  readonly #x: number;
  readonly #y: number;
  constructor(x: number, y: number) {
    this.#x = Math.round(x);
    this.#y = Math.round(y);
    if (
      Math.abs(this.x - x) > EPSILON ||
      Math.abs(this.y - y) > EPSILON
    ) {
      throw Error(`Non integer: [${x},${y}]`);
    }
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get isStraight() {
    return this.x === 0 || this.y === 0
  }

  get isDiagonal() {
    return !this.isStraight
  }

  toString() {
    return `[${this.x},${this.y}]`;
  }

  equals(other: Vec2i) {
    return this.toString() === other.toString();
  }

  add(other: Vec2i) {
    return new Vec2i(this.x + other.x, this.y + other.y);
  }

  sub(other: Vec2i) {
    return new Vec2i(this.x - other.x, this.y - other.y);
  }

  mul(scalar: number) {
    return new Vec2i(this.x * scalar, this.y * scalar);
  }

  div(scalar: number) {
    return new Vec2i(this.x / scalar, this.y / scalar);
  }

  rot(deg: number) {
    const angle = deg * (Math.PI / 180);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vec2i(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }

  length(manhattan = true) {
    if (!manhattan) return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    return Math.abs(this.x) + Math.abs(this.y);
  }
}

export const Unit = {
    N: new Vec2i(0, -1),
    NE: new Vec2i(1, -1),
    E: new Vec2i(1, 0),
    SE: new Vec2i(1, 1),
    S: new Vec2i(0, 1),
    SW: new Vec2i(-1, 1),
    W: new Vec2i(-1, 0),
    NW: new Vec2i(-1, -1)
};

if(process.env.TEST === "true") {

    const SE = new Vec2i(1, -1);
    const SE5 = SE.mul(5);
    test(SE.toString(), "[1,-1]", "Unit");
    test(SE5.toString(), "[5,-5]", "Scalar multiplication");
    
    const unitTriangle = new Vec2i(3, 4);
    test(unitTriangle.length(), 7, "Manhattan distance");
    test(unitTriangle.length(false), 5, "Eucledian distance");
    
    const north = new Vec2i(0, -1);
    const east = north.rot(90);
    const south = north.rot(180);
    const west = north.rot(270);
    test(east.toString(), "[1,0]", "rot(90)");
    test(south.toString(), "[0,1]", "rot(180)");
    test(west.toString(), "[-1,0]", "rot(270)");

    test(north.isStraight, true);
    test(SE5.isDiagonal, true);
  
}