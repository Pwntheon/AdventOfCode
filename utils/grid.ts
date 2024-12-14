import { lines } from "./helpers";
import pipe from "./pipe";
import Vec2i from "./vec2";

// Infinite loop protection for wrapped grids
const readMax = 1000;

export type GridOptions = {
  wrap?: boolean;
  diagonal?: boolean;
};

export default class Grid {
  width: number;
  height: number;
  data: string[];
  wrap: boolean;
  diagonal: boolean;
  constructor(input: string, options?: GridOptions) {
    const parser = pipe<string>().then(lines);
    const data = parser(input);

    this.width = data[0].length;
    this.height = data.length;
    this.wrap = options?.wrap ?? false;
    this.diagonal = options?.diagonal ?? false;

    this.data = data.join("").split("");
  }

  *nodes() {
    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        yield new Vec2i(x, y);
      }
    }
  }

  at(pos: Vec2i) {
    return this.data[this.#index(pos)];
  }

  getRelativePos(pos: Vec2i, delta: Vec2i) {
    return this.#constrain(pos.add(delta));
  }

  write(pos: Vec2i, character: string) {
    const index = this.#index(pos);
    this.data[index] = character;
  }

  find(character: string) {
    for (const node of this.nodes()) {
      if (this.at(node) === character) return node;
    }
  }

  findAll(character: string) {
    return this.nodes().filter((n) => this.at(n) === character);
  }

  toString() {
    let result = "";
    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        result += this.at(new Vec2i(x, y));
      }
      result += "\r\n";
    }
    return result;
  }

  *edges(pos: Vec2i) {
    for (let y = pos.y - 1; y <= pos.y + 1; ++y) {
      for (let x = pos.x - 1; x <= pos.x + 1; ++x) {
        const origin = this.#constrain(pos);
        const dest = this.#constrain(new Vec2i(x, y));
        if (!origin || !dest) continue; // oob
        if (origin.equals(dest)) continue;
        const direction = this.#delta(origin, dest);
        if (!this.diagonal && direction.isDiagonal) continue;
        yield dest;
      }
    }
  }

  #constrain({ x, y }: Vec2i): Vec2i | null {
    if (this.wrap) {
      x = (x + this.width) % this.width;
      y = (y + this.height) % this.height;
    }
    if (!(x >= 0 && x < this.width && y >= 0 && y < this.height)) return null;
    return new Vec2i(x, y);
  }

  #index(pos: Vec2i) {
    const { x, y } = this.#constrain(pos)!;
    return y * this.width + (x % this.width);
  }

  #delta(first: Vec2i, second: Vec2i) {
    let deltaX = second.x - first.x;
    let deltaY = second.y - first.y;
    if (this.wrap) {
      deltaX = closestToZero(deltaX, deltaX - this.width, deltaX + this.width);
      deltaY = closestToZero(deltaY, deltaY - this.width, deltaY + this.width);
    }
    return new Vec2i(deltaX, deltaY);
  }
}

function closestToZero(...numbers: number[]) {
  return numbers.reduce(
    (acc, curr) => (Math.abs(curr) < Math.abs(acc) ? curr : acc),
    numbers[0]
  );
}
