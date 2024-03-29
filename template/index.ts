import { h, test, InputParser } from "#root/utils/index.ts";
import {
  InputParserString,
  InputParserNumber,
  InputParserNumbers,
  InputParserStrings,
  InputParserStringsArray
} from "#root/utils/input";
console.clear();

const input = InputParser.load();

const solveA = (data: InputParserString) => {
  let result = "Not solved";
  return result;
};

const solveB = (data: InputParserString) => {
  let result = "Not solved";
  return result;
};

/* Tests */
// Base test - check that input is not empty
test(InputParser.load().finish().length > 0, true, "has input");

/* Results */

console.time("Part 1");
const resultA = solveA(input.clone());
console.timeEnd("Part 1");
console.log("Solution to part 1:", resultA);
console.time("Part 2");
const resultB = solveB(input.clone());
console.timeEnd("Part 2");
console.log("Solution to part 2:", resultB);