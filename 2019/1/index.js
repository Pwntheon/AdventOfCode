const { test, readInput } = require("../../utils");

const prepareInput = (rawInput) => {
    let input = rawInput;
    input = input.split("\r\n");
    return input;
};

const input = prepareInput(readInput())

const calcFuel = (fuel) => {
  return Math.floor(fuel / 3) - 2;
}

const calcFuelRecursive = (fuel) => {
  let costOfThis = calcFuel(fuel);
  if(costOfThis <= 0) return 0;
  let costOfFuel = calcFuelRecursive(costOfThis);

  return costOfThis + costOfFuel;
}

const goA = (input) => {
  
  return input.reduce((acc, curr) => acc + calcFuel(curr), 0);
}

const goB = (input) => {
  return input.reduce((acc, curr) => acc + calcFuelRecursive(curr), 0);
}

/* Tests */

// test(result, expected)

test (calcFuelRecursive(100756), 50346);

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)