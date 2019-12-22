const { test, readInput } = require("../../utils");
const { Tests, Computer } = require("../IntCode");

const prepareInput = (rawInput) => {
    let input = rawInput.split(",").map(e => e.trim());
    return input;
};

const input = prepareInput(readInput())

const goA = (input) => { 
  input[1] = "12";
  input[2] = "2";
  const c = new Computer();
  c.loadProgram(input);
  return c.run().firstLine;
}

const goB = (input) => {
  const c = new Computer();
  for(let noun = 0; noun < 100; ++noun) {
    for(let verb = 0; verb < 100; ++verb) {
      input[1] = noun;
      input[2] = verb;
      c.loadProgram(input);
      if(c.run().firstLine == "19690720") return 100 * noun + verb;
    }
  }
}

/* Tests */

Tests.run(test);

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)