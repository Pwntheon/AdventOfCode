import { lines } from "./helpers";
import pipe from "./pipe";
import { test } from "./test";
import Vec2i from "./vec2";

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

  static makeBlank(width: number, height: number, fillChar?: string) {
    if(!fillChar) fillChar = ".";
    let inputString = Array(height).fill("".padEnd(width, fillChar)).join("\n");
    return new Grid(inputString);
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

  floodFill(pos: Vec2i, character: string) {
    const next: Vec2i[] = [pos];
    const oldChar = this.at(pos);
    while(next.length) {
      const current = next.pop()!;
      this.write(current, character);
      for(const edge of this.edges(current)) {
        if(this.at(edge) === oldChar) next.push(edge)
      }
    }
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

  // All nodes that lie in a straight line between a and b
  *between(a: Vec2i, b: Vec2i) {
    if(this.diagonal) throw "Non orthagonal lines not supported yet";
    const distance = b.sub(a);
    const direction = distance.div(distance.length());
    if(!(direction.length(true) === 1)) throw "Error: Direction vector should be unit";
    let next = a.add(direction);
    do {
      yield next;
      next = next.add(direction);
    } while(!next.equals(b));
  }

  *square(a: Vec2i, b: Vec2i) {
    for(let x = Math.min(a.x, b.x); x <= Math.max(a.x, b.x); ++x ) {
      for(let y = Math.min(a.y, b.y); y <= Math.max(a.y, b.y); ++y) {
        yield new Vec2i(x, y);
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



if(process.env.TEST === "true") {
  const testGrid = new Grid(`.....
.S...
.....
.....
.E...`);
  let start = new Vec2i(0, 1);
  let end = new Vec2i(0, 4);
  let numberOfSteps = 0;
  for(const steps of testGrid.between(start, end)) ++numberOfSteps;
  test(numberOfSteps, 2, "Number of steps between 0,1 and 0,4 is 2");

  start = testGrid.find("S")!;
  end = testGrid.find("E")!;
  for(const step of testGrid.between(start, end)) testGrid.write(step, "W");
  test(testGrid.at(new Vec2i(1, 2)), "W", "between write 1, 2")
  test(testGrid.at(new Vec2i(1, 3)), "W", "between write 1, 3")

  const blankGrid = Grid.makeBlank(5, 3, "o");
  test(blankGrid.at(new Vec2i(4,2)), "o", "Blank grid dimensions are correct");
}