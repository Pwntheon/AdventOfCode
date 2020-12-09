const { test, readInput } = require("../../utils");

function Calculate2(input, target) {
  for(let i = 0; i < input.length; i++) {
    for(let y = 0; y < input.length; y++) {
      let sum = input[i]+input[y];
      if(sum==target) return input[i]*input[y];
    }
  }
}


function Calculate3(input, target) {
  for(let i = 0; i < input.length; i++) {
    for(let y = 0; y < input.length; y++) {
      let sum = input[i]+input[y];
      if(sum < target) {
        for(let u = 0; u < input.length; ++u) {
          if(sum + input[u] === target) return input[i]*input[y]*input[u];
        }
      }
    }
  }
}

const prepareInput = (rawInput) => {
    let input = rawInput;
    return input.split("\n").map(n => parseInt(n, 10));
};

const input = prepareInput(readInput())

const goA = (input) => {
  return Calculate2(input, 2020);
}

const goB = (input) => {
  return Calculate3(input, 2020);
}

/* Tests */

const testArray = [
1721,
979,
366,
299,
675,
1456
];
test(Calculate2(testArray, 2020), 514579);

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)