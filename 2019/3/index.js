const { test, readInput } = require("../../utils");

const prepareInput = (rawInput) => {
    let a = rawInput.split("\r\n")[0].split(',').map(e => e.trim());
    let b = rawInput.split("\r\n")[1].split(',').map(e => e.trim());
    return {a, b};
};

const input = prepareInput(readInput())

const path = Map();

const toCoord = s => s.split(',');
const toKey = (x, y) => `${x},${y}`;
const moves = {
  U: ({x, y}) => ({x: x, y = y+1}),
  D: ({x, y}) => ({x: x, y = y-1}),
  R: ({x, y}) => ({x: x+1, y = y}),
  L: ({x, y}) => ({x: x-1, y = y})  
};

const move = (input) => {
  let move = input.substring(0, 1);
  let numberOfMoves = Number.parseInt(input.substring(1), 10);
  while(numberOfMoves) {
    
    let currMove = moves[move];
    let wires = path.get()
    path.set(toKey)
  }
}

const goA = (input) => {
  return "a result"
}

const goB = (input) => {
  return "b result"
}

/* Tests */

test(input.a.length > 0, true);
test(input.b.length > 0, true);

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)