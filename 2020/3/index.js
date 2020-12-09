const { test, readInput } = require("../../utils");
const { EOL } = require('os');
console.clear();
const prepareInput = (rawInput) => {
    let input = rawInput;
    
    return input.split(EOL).map(y => y.split(""));
};

let posX = 0, posY = 0;
const move = (x, y) => {
  posX= ((x + posX) % input[0].length);
  posY+=y;
}

const read = (x, y) => {
  try {
    return input[y][x];
  } catch(e) {
  }
}
const input = prepareInput(readInput());
console.log(input[0].length);
const tree = "#";
const goA = (input) => {
  let trees = 0;
  while(posY < input.length) {
    move(3, 1);
    if(read(posX, posY) == tree) ++trees;
    console.log(posY, posX, read(posX, posY));
  }
  return trees;
}

const goB = (input) => {
  return "b result"
}

/* Tests */

test(read(0,0), ".");

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)