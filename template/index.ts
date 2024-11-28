import { test, load, pipe } from "@utils";

// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>()

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const {data, loadRaw, loadFile} = load(parseInput);

const part1 = (input: typeof data) => {
  let result = "";
  return result;
};

const part2 = (input: typeof data) => {
  let result = "";
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
