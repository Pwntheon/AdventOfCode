import { test, load, pipe } from "@utils";
import { lines, rotate, split, toInt, toIntS } from "utils/helpers";

// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>()
  .then(lines)
  .then(split(null))
  .then(rotate)
  .then(i => i.map(row => toInt(row).sort()))

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const {data, loadRaw, loadFile} = load(parseInput);

const part1 = (input: typeof data) => {
  const solver = pipe<typeof data>()
    .then(rotate)
  return solver(input).reduce((acc, curr) => acc + Math.abs(curr[0] - curr[1]) ,0);
};

const part2 = (input: typeof data) => {
  return input[0].reduce((acc, curr) => acc + curr * input[1].filter(e => e === curr).length ,0);
};

// Base test - check that input is not empty
test(load(d => d).data.length > 0, true, "Has input");
test(part1(loadRaw(
`3   4
4   3
2   5
1   3
3   9
3   3`
)), 11)

// Time and log results
console.time("Part 1");
const resultA = part1(data);
console.timeEnd("Part 1");
console.log("First answer:", resultA);

console.time("Part 2");
const resultB = part2(data);
console.timeEnd("Part 2");
console.log("Second answer:", resultB);
