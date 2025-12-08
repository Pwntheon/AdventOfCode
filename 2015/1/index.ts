import { test, load, pipe } from "@utils";
import { lines, map, split, sum } from "utils/helpers";

// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>()
  .then(lines)
  .then(split(""))
  .then(i => i[0])
  .then(map(toMovement))


function toMovement(character: string) {
  if(character === "(") return 1;
  if(character === ")") return -1;
  return 0;  
}

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const {data, loadRaw, loadFile} = load(parseInput);

const part1 = (input: typeof data) => {
  const solver = pipe<typeof data>()
    .then(sum)

  let result = solver(input);
  
  
  return result;
};

const part2 = (input: typeof data) => {
  let pos = 0;
  for(let i = 0; i < input.length; ++i) {
    pos += input[i];
    if(pos === -1) return i+1
  }
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
