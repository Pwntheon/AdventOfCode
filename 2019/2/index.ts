import { h, test, InputParser } from "#root/utils/index.ts";
import Computer from "../intcode/index.ts";

console.clear();

const input = InputParser.load().toArray().toInt();

const goA = (data) => {
  const computer = new Computer(data);
  computer.write(1, 12);
  computer.write(2, 2);
  computer.run();
  let result = computer.read(0); 
  return result;
}

const goB = (data) => {
  const target = 19690720;
  const computer = new Computer(data.clone().finish());
  let result = { noun: 0, verb: 0, result: 0 };
  for (result.noun = 0; result.noun < 99 && result.result !== target; ++result.noun) {
    for (result.verb = 0; result.verb < 99 && result.result !== target; ++result.verb) {

      computer.load(data.clone().finish());
      computer.write(1, result.noun);
      computer.write(2, result.verb);
      computer.run();
      result.result = computer.read(0);
    } 
  }
  console.log("Noun " + result.noun + " & verb " + result.verb + " = " + result.result);
  return (result.noun - 1) * 100 + result.verb - 1;
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

console.time("Time");
const resultA = goA(input.clone().finish());
console.log("Solution to part 1:", resultA);
const resultB = goB(input);
console.log("Solution to part 2:", resultB);
console.timeEnd("Time");
