import { lines } from "./helpers";
import pipe from "./pipe";

// Infinite loop protection for wrapped grids
const readMax = 1000;

export type GridOptions = {
  wrap?: boolean;
  diagonal?: boolean;
};

export default class Grid {
  width: number;
  height: number;
  data: string;
  wrap: boolean;
  diagonal: boolean;
  constructor(input: string, options?: GridOptions) {
    const parser = pipe<string>().then(lines);
    const data = parser(input);

    this.width = data[0].length;
    this.height = data.length;
    this.wrap = options?.wrap ?? false;
    this.diagonal = options?.diagonal ?? false;

    this.data = data.join("");
  }

  *nodes() {
    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        yield this.node(x, y);
      }
    }
  }

  node(x: number, y: number) {
    ({x, y} = this.#posFromCoords(x, y)!);
    return {
      data: () => this.at(x, y),
      edges: () => this.edges(x, y),
      pos: () => ({x, y})
    };
  }

  at(x: number, y: number) {
    ({x, y} = this.#posFromCoords(x, y)!);
    const index = y * this.width + (x % this.width);
    return this.data[index];
  }

  *edges(x: number, y: number) {
    for (let y1 = y - 1; y1 <= y + 1; ++y1) {
      for (let x1 = x - 1; x1 <= x + 1; ++x1) {
        const origin = this.#posFromCoords(x, y);
        const dest = this.#posFromCoords(x1, y1);
        if(!origin || !dest) continue; // oob
        if (equal(origin, dest)) continue; // self
        const direction = this.#delta(origin, dest);
        if(!this.diagonal && Math.abs(direction.x) + Math.abs(direction.y) > 1) continue; // diagonal
        yield this.node(x1, y1);
      }
    }
  }

  *getReader(start: position, next: position) {
    const delta = this.#delta(start, next);
    let current: position | null = start;
    let steps = 0;
    while(current !== null && ++steps < readMax) {
        yield this.node(current.x, current.y).data();
        current = this.#posFromCoords(current.x + delta.x, current.y + delta.y);
    }
  }

  #posFromCoords(x: number, y: number): position | null {
    if (this.wrap) {
      x = (x + this.width) % this.width;
      y = (y + this.height) % this.height;
    }
    if (!(x >= 0 && x < this.width && y >= 0 && y < this.height)) return null;
    return { x, y };
  }

  #delta(first: position, second: position) {
    let deltaX = second.x - first.x;
    let deltaY = second.y - first.y;
    if(this.wrap) {
        deltaX = absMin(deltaX, deltaX - this.width, deltaX + this.width);
        deltaY = absMin(deltaY, deltaY - this.width, deltaY + this.width);
    }
    return { x: deltaX, y: deltaY };
  }
}

type position = { x: number; y: number };


function equal(first: position, second: position) {
    return first.x === second.x && first.y === second.y;
}

function absMin(...numbers: number[]) {
    return numbers.reduce((acc, curr) => Math.abs(curr) < Math.abs(acc) ? curr : acc, numbers[0]);
}