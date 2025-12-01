import { test, load, pipe } from "@utils";
import { lines, map } from "utils/helpers";

// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>()
  .then(lines)
  .then(map(parseLine))
  .then(map(toRotation));

type direction = "R" | "L";
type instruction = {
  direction: direction;
  distance: number;
};

function parseLine(i: string): instruction {
  const direction: direction = i.substring(0, 1) as direction;
  const distance: number = parseInt(i.substring(1), 10);
  return { direction, distance };
}

function toRotation({ direction, distance }: instruction) {
  const dir = direction === "R" ? 1 : -1;
  return distance * dir;
}

const startingPosition = 50;

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const { data, loadRaw, loadFile } = load(parseInput);

const part1 = (input: typeof data) => {
  const solver = pipe<typeof data>();

  let rots = solver(input);

  const state: state = {
    pos: startingPosition,
    hits: 0
  };
  rots.forEach((r) => {
    rotate(state, r);
  });

  return state.hits;
};

type state = {
  pos: number;
  hits: number;
};

function rotate(state: state, rotation: number) {
  state.pos = (state.pos + rotation) % 100;
  if(state.pos === 0) ++state.hits;
  return state;
}

function rotateStepwise(state: state, rotation: number) {
  const change = rotation / Math.abs(rotation);
  for (let i = rotation; i !== 0; i -= change) {
    state.pos = (state.pos + change) % 100;
    if (state.pos === 0) ++state.hits;
  }
  return state;
}

const part2 = (input: typeof data) => {
  const solver = pipe<typeof data>();

  let rots = solver(input);

  const state: state = {
    hits: 0,
    pos: startingPosition
  };

  rots.forEach((r) => {
    rotateStepwise(state, r);
  });

  return state.hits;
};

// Base test - check that input is not empty
test(load((d) => d).data.length > 0, true, "Has input");
test(parseLine("R123"), { direction: "R", distance: 123 }, "Parse line");
test(rotate({pos: 12, hits: 0}, -11).hits, 0, "Stepwise rotation miss");
test(rotate({pos: 12, hits: 0}, -12).hits, 1, "Stepwise rotation hit");
test(rotateStepwise({pos: 1, hits: 1}, -102).hits, 3, "Stepwise rotation");

// Time and log results
console.time("Part 1");
const resultA = part1(data);
console.timeEnd("Part 1");
console.log("First answer:", resultA);

console.time("Part 2");
const resultB = part2(data);
console.timeEnd("Part 2");
console.log("Second answer:", resultB);
