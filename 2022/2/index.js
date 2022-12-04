const { test, utils, InputParser } = require("../../utils");
console.clear();

const values = {
  A: 0,
  B: 1,
  C: 2,
  X: 0,
  Y: 1,
  Z: 2
};

function didWin([a, b]) {
  let result = b-a;
  if(Math.abs(result) == 2) result = result * (-2) % 3;
  return result
}

function getScore(input) {
  return input.reduce((acc, curr) =>
    acc + 1 + curr[1] + (didWin(curr)+1)*3
  ,0)
}

const input = new InputParser()
  .splitOnNewline()
  .forEach(l => l.split(" "))
  .forEach(l => [values[l[0]], values[l[1]]] )
  .finish();

const goA = (data) => {
  let result = getScore(data);
  return result;
}

const goB = (data) => {
  data = data.map(transpose);
  let result = getScore(data);
  return result;
}

function transpose([a, b]) {
  return [a,
    (a + b - 1 + 3) % 3
  ]
}

/* Tests */ 

// test(didWin([values.A, values.A]), 0);
// test(didWin([values.B, values.B]), 0);
// test(didWin([values.C, values.C]), 0);
// test(didWin([values.B, values.A]), -1);
// test(didWin([values.C, values.B]), -1);
// test(didWin([values.A, values.C]), -1);
// test(didWin([values.A, values.B]), 1);
// test(didWin([values.B, values.C]), 1);
// test(didWin([values.C, values.A]), 1);

test(transpose([0, 0]), [0, 2]);
test(transpose([0, 1]), [0, 0]);
test(transpose([0, 2]), [0, 1]);
test(transpose([1, 0]), [1, 0]);
test(transpose([1, 1]), [1, 1]);
test(transpose([1, 2]), [1, 2]);
test(transpose([2, 0]), [2, 1]);
test(transpose([2, 1]), [2, 2]);
test(transpose([2, 2]), [2, 0]);

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)