import { test, load, pipe } from "@utils";
import { lines, split } from "utils/helpers";

// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>()
  .then(lines)
  .then(split("x"))
  .then(l => l.map( v => v.map(i => parseInt(i, 10))));

function getSides(dimensions: number[]) {
  if(dimensions.length !== 3) throw "Malformed input";
  return [
    dimensions[0] * dimensions[1],
    dimensions[0] * dimensions[2],
    dimensions[1] * dimensions[2]
  ].sort();
}

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const {data, loadRaw, loadFile} = load(parseInput);

const part1 = (input: typeof data) => {
  const solver = pipe<typeof data>()

  let result = solver(input);
  
  result = "Not solved";
  return result;
};

const part2 = (input: typeof data) => {
  const solver = pipe<typeof data>()

  let result = solver(input);

  result = "Not solved";
  return result;
};

// Base test - check that input is not empty
test(load(d => d).data.length > 0, true, "Has input");
test(getSides([2, 3, 4]), [12, 8, 6], "getSides")

// Time and log results
console.time("Part 1");
const resultA = part1(data);
console.timeEnd("Part 1");
console.log("First answer:", resultA);

console.time("Part 2");
const resultB = part2(data);
console.timeEnd("Part 2");
console.log("Second answer:", resultB);
