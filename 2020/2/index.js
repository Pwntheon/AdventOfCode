const { test, readInput } = require("../../utils");
const { EOL } = require('os');

const prepareInput = (rawInput) => {
    let input = rawInput;
    return input.split(EOL).map(l => {
      let [length, character, pw] = l.split(" ");
      let [min, max] = length.split("-");
      return {
        min: min,
        max: max,
        character: character[0],
        pw: pw
      };
    });
};

const input = prepareInput(readInput())

function countChar(input, char) {
  return input.split("").reduce((acc, curr) => acc + (curr === char ? 1 : 0), 0);
}
function valid1(input) {
  return input.reduce((acc, curr) => {
    const count = countChar(curr.pw, curr.character);
    if(count >= curr.min && count <= curr.max) return acc+1;
    return acc;
  }, 0);
}

const goA = (input) => {
  return valid1(input);
}

const goB = (input) => {
  return "b result"
}

/* Tests */
test(countChar("aaads", "a"), 3);
test(countChar("aaads", "d"), 1);
test(countChar("aaads", "f"), 0);
/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB) 