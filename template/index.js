const { test, readInput } = require("../../utils");

const prepareInput = (rawInput) => {
    let input = rawInput;
    
    return input;
};

const input = prepareInput(readInput())

const goA = (input) => {
  return "a result"
}

const goB = (input) => {
  return "b result"
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