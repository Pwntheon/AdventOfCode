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

const mappings = [
  ["zero", '0'],
  ["one", '1'],
  ["two", '2'],
  ["three", '3'],
  ["four", '4'],
  ["five", '5'],
  ["six", '6'],
  ["seven", '7'],
  ["eight", '8'],
  ["nine", '9'],
  ["0", "0"],
  ["1", "1"],
  ["2", "2"],
  ["3", "3"],
  ["4", "4"],
  ["5", "5"],
  ["6", "6"],
  ["7", "7"],
  ["8", "8"],
  ["9", "9"],
];

function translate(token: string) {
  for (const entry of mappings) {
    if (entry[0] === token) return entry[1];
  }
  throw Error("No mapping for " + token);
}

function* fromStart(line: string) {
  for (let i = 1; i <= line.length; ++i) {
    yield line.slice(0, i);
  }
}

function* fromEnd(line: string) {
  for (let i = line.length; i >= 0; --i) {
    yield line.slice(i);
  }
}

const pattern = new RegExp(`([0-9]|${mappings.map(m => m[0]).join("|")})`);

const solveA = (data: InputParserString) => {
  let parsed = data.splitOnNewline().split("").finish();
  let numbers = parsed.map(line => line.filter(a => /[0-9]/.test(a)));
  let sum = numbers.map(list => parseInt(list[0] + list[list.length - 1], 10));
  return sum.reduce((acc, curr) => acc + curr);
};

const solveB = (data: InputParserString) => {
  let parsed = data.splitOnNewline().finish();
  let calibrationValues = parsed.map(line => {
    const result: string[] = [];
    for (const part of fromStart(line)) {
      const token = part.match(pattern);
      if (token) {
        result.push(translate(token[0]));
        break;
      }
    }
    for (const part of fromEnd(line)) {
      const token = part.match(pattern);
      if (token) {
        result.push(translate(token[0]));
        break;
      }
    }
    return result.join("");
  }).map(e => parseInt(e, 10));
  return calibrationValues.reduce((acc, curr) => acc + curr);
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