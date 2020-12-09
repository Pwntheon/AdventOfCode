const { test, readInput } = require("../../utils");
const { EOL } = require('os');
console.clear();

const prepareInput = (rawInput) => {
  let input = rawInput;
  return input.split(EOL).map(l => {
    let [length, character, pw] = l.split(" ");
    let [first, last] = length.split("-");
    return {
      first: parseInt(first, 10),
      last: parseInt(last, 10),
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
    if (count >= curr.first && count <= curr.last) return acc + 1;
    return acc;
  }, 0);
}
function valid2(input) {
  return input.filter(entry => {
    return (entry.pw.split("")[entry.first - 1] === entry.character) != (entry.pw.split("")[entry.last - 1] === entry.character);
  }).length;
}

const goA = (input) => {
  return valid1(input);
}

const goB = (input) => {
  return valid2(input);
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