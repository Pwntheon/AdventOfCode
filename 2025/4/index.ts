import { test, load, pipe } from "@utils";
import Grid from "utils/grid";
import { lines } from "utils/helpers";
import Vec2i from "utils/vec2";

// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>();

const FLOOR = ".";
const PAPER = "@";

function *movables(grid: Grid) {
  for(const node of grid.nodes()) {
    if(grid.at(node) === FLOOR) continue;
    let neighbors = 0;
    for(const edge of grid.edges(node)) {
      if(grid.at(edge) === PAPER ) ++neighbors;
    }
    if(neighbors < 4) yield node;
  }
}

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const {data, loadRaw, loadFile} = load(parseInput);

const part1 = (input: typeof data) => {
  const board = new Grid(input, { diagonal: true} )
  let result = 0;
  for(const movable of movables(board)) ++result;
  return result;
};

const part2 = (input: typeof data) => {
  const board = new Grid(input, { diagonal: true} )

  let result = 0;
  let removed: Vec2i[] = [];
  do {
    removed = [];
    for(const movable of movables(board)) removed.push(movable);
    removed.forEach(node => board.write(node, "."))
    result += removed.length;
  } while(removed.length > 0)
  return result;
};

// Base test - check that input is not empty
test(load(d => d).data.length > 0, true, "Has input");

// Time and log results
console.time("Part 1");
const resultA = part1(data);
console.timeEnd("Part 1");
console.log("First answer:", resultA);

console.time("Part 2");
const resultB = part2(data);
console.timeEnd("Part 2");
console.log("Second answer:", resultB);
