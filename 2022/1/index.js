const { test, utils, InputParser } = require("../../utils");
console.clear();

const input = new InputParser()
  .splitOnNewline()
  .splitOnEmpty()
  .toInt()
  .forEach(d => utils.sum(d))
  .finish();

const goA = (data) => {
  let result = data.sort((a, b) => b - a)[0];
  return result;
}

const goB = (data) => {
  let result = utils.sum(data.sort((a, b) => b - a).slice(0, 3));
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