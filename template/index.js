const { test, utils, InputParser } = require("../../utils");
console.clear();

const input = new InputParser()
  .finish();

const goA = (data) => {
  let result = ["data: ", data];
  return result;
}

const goB = (data) => {
  let result = ["data: ", data];
  return result
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