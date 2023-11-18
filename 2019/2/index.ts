import { h, test, InputParser } from "#root/utils/index.ts";
import Computer from "../intcode/index.ts";

console.clear();

const input = InputParser.load(undefined, true).toArray().toInt().finish();

const goA = (data) => {
  const computer = new Computer(data);
  computer.write(1, 12);
  computer.write(2, 2);
  computer.run();
  let result = computer.read(0);
  return result;
}

const goB = (data) => {
  console.log(data);
  const computer = new Computer(data);
  computer.debug = true;
  let input = "";
  for (let noun = 0; noun < 99; ++noun) {
    for (let verb = 0; verb < 99; ++verb) {

      computer.load(data);
      computer.write(1, noun);
      computer.write(2, verb);
      computer.run();
      const result = computer.read(0);
      console.log(result);
      input = noun + " " + verb;
      if (result === 19690720) break;
    }
  }
  return input;
}

/* Tests */

const testProg = [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50];
const testComputer = new Computer(testProg);
testComputer.run();
test(testComputer.memory[0], 3500);
testComputer.load([1, 0, 0, 0, 99]);
testComputer.run();
test(testComputer.memory.join(", "), [2, 0, 0, 0, 99].join(", "));
testComputer.load([2, 3, 0, 3, 99]);
testComputer.run();
test(testComputer.memory.join(", "), [2, 3, 0, 6, 99].join(", "));
testComputer.load([2, 4, 4, 5, 99, 0]);
testComputer.run();
test(testComputer.memory.join(", "), [2, 4, 4, 5, 99, 9801].join(", "));
testComputer.load([1, 1, 1, 4, 99, 5, 6, 0, 99]);
testComputer.run();
test(testComputer.memory.join(", "), [30, 1, 1, 4, 2, 5, 6, 0, 99].join(", "));

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)