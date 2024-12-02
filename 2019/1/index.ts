import { test, load, pipe } from "@utils";
import { lines, map, sum, toInt, toIntS } from "utils/helpers";

// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>()
  .then(lines)
  .then(toInt)

function getWeight(i: number): number{
  return Math.floor(i / 3) - 2;
}

function getWeightAdvanced(i: number): number {
  if(i <= 0) return 0;
  const ownWeight = Math.max(0, getWeight(i));
  return ownWeight + getWeightAdvanced(ownWeight);
}

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const {data, loadRaw, loadFile} = load(parseInput);

const part1 = (input: typeof data) => {
  const solver = pipe<typeof data>()
    .then(map(getWeight))
    .then(sum)

  let result = solver(input);
  return result;
};

const part2 = (input: typeof data) => {
  const solver = pipe<typeof data>()
    .then(map(getWeightAdvanced))
    .then(sum)

  let result = solver(input);
  return result;
};

// Base test - check that input is not empty
test(load(d => d).data.length > 0, true, "Has input");
test(getWeightAdvanced(100756), 50346);

// Time and log results
console.time("Part 1");
const resultA = part1(data);
console.timeEnd("Part 1");
console.log("First answer:", resultA);

console.time("Part 2");
const resultB = part2(data);
console.timeEnd("Part 2");
console.log("Second answer:", resultB);
