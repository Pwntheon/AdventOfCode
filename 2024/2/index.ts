import { test, load, pipe } from "@utils";
import { lines, map, split, toInt } from "utils/helpers";

// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>()
  .then(lines)
  .then(split(null))
  .then(map(toInt));

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const { data, loadRaw, loadFile } = load(parseInput);

function delta(input: number[]) {
  const result: number[] = [];
  for (let i = 0; i < input.length - 1; ++i) {
    result.push(input[i + 1] - input[i]);
  }
  return result;
}

function isValid(input: number[]) {
  const validDirection = input.every((e) => e > 0) || input.every((e) => e < 0);
  const deltaWithinRange = input.every(
    (e) => Math.abs(e) >= 1 && Math.abs(e) <= 3
  );
  return validDirection && deltaWithinRange;
}

// Get an iterator to an array, excluding a single index
function* getVariant(input: number[], indexToSkip: number) {
  for(let i = 0; i < input.length; ++i) {
    if(i !== indexToSkip) yield input[i];
  }
}

// For a given array, get a copy for each possible variant excluding one element
function getVariants(input: number[]) {
  const generators = input.map((_, i) => getVariant(input, i));
  return generators.map(generator => {
    const result: number[] = [];
    for(const val of generator) result.push(val);
    return result;
  })
}

const part1 = (input: typeof data) => {
  const solver = pipe<typeof data>().then(map(delta)).then(map(isValid));

  let result = solver(input).filter((e) => e).length;
  return result;
};

const part2 = (input: typeof data) => {
  return input.map(report => {
    let errors = 0;
    getVariants(report).forEach(variant => {
      if(!isValid(delta(variant))) ++errors;
    });
    return errors < report.length ;
  }).filter(e => e).length;
};

// Time and log results
console.time("Part 1");
const resultA = part1(data);
console.timeEnd("Part 1");
console.log("First answer:", resultA);

console.time("Part 2");
const resultB = part2(data);
console.timeEnd("Part 2");
console.log("Second answer:", resultB);
