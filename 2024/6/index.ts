import { test, load, pipe } from "@utils";
import Grid, { node, position, posString, rotateClockwise } from "utils/grid";

const WALL = "#";
const GUARD = "^";
// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>();

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const { data, loadRaw, loadFile } = load(parseInput);

const getLoopMarkerForDir = {
  "[0, -1]": "S",
  "[1, 0]": "W",
  "[0, 1]": "N",
  "[-1, 0]": "E",
}

class Char {
  grid: Grid;
  pos: position | null;
  dir: position;
  constructor(grid: Grid, start: position, dir: position) {
    this.grid = grid;
    this.pos = start;
    this.dir = dir;
  }

  turn() {
    this.dir = rotateClockwise(this.dir);
  }

  #shouldTurn() {
    if(!this.pos) return false;
    const nextStep = this.grid.getRelativePos(this.pos, this.dir.x, this.dir.y);
    if(!nextStep) return false;
    return this.grid.at(nextStep.x, nextStep.y) === WALL;
  }

  step() {
    if(!this.pos) throw Error("Attempt to move when out of bounds");
    let turned: position | undefined = undefined;
    while(this.#shouldTurn()) {
      this.turn()
      turned = this.pos;
    };
    this.pos = this.grid.getRelativePos(this.pos, this.dir.x, this.dir.y);
    return turned;
  }
}

function markPotentialObstaclePosition(char: Char) {
  if(!char.pos) return;
  const tileInFront = char.grid.getRelativePos(char.pos, char.dir.x, char.dir.y);
  if(!tileInFront) return;
  char.grid.write(tileInFront.x, tileInFront.y, "_");
}

const part1 = (input: typeof data) => {
  const grid = new Grid(input);
  let startingNode = grid.find(GUARD);
  if (!startingNode) throw Error("Couldn't find starting position");
  const guard = new Char(grid, startingNode.pos(), { x: 0, y: -1 });
  while(guard.pos) {
    grid.write(guard.pos.x, guard.pos.y, "x");
    guard.step();
  }

  return grid.findAll("x").length;
};

const part2 = (input: typeof data) => {
  return "Not yet solved";
};

// Base test - check that input is not empty
test(load((d) => d).data.length > 0, true, "Has input");

// Time and log results
console.time("Part 1");
const resultA = part1(data);
console.timeEnd("Part 1");
console.log("First answer:", resultA);

console.time("Part 2");
const resultB = part2(data);
console.timeEnd("Part 2");
console.log("Second answer:", resultB);