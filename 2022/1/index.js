const { test, input } = require("../../utils");
console.clear();
const prepareInput = (rawInput) => {
    let result = input.fromLines(rawInput);
    result = input.splitOnEmpty(result);
    result = result.map(n => n.map(input.toInt()));
    result = result.map(n => input.sum(n));
    return result;
};

const parsedInput = prepareInput(input.read())

const goA = (data) => {
  let result = data.sort((a, b) => b-a)[0];
  return result;
}

const goB = (data) => {
  let result = input.sum(data.sort((a, b) => b-a).slice(0, 3));
  return result
}

/* Tests */

// test(result, expected)

/* Results */

console.time("Time")
const resultA = goA(parsedInput)
const resultB = goB(parsedInput)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)