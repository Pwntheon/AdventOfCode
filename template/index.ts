import { h, test, InputParser } from "#root/utils/index.ts";
console.clear();

const input = InputParser.load()

const goA = (data) => {
  let result = "Not solved";
  return result;
}

const goB = (data) => {
  let result = "Not solved";
  return result;
}

/* Tests */

// test(result, expected)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)