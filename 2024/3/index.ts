import { test, load, pipe } from "@utils";
import { map, match, sum } from "utils/helpers";

// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>();

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const { data, loadRaw, loadFile } = load(parseInput);

function getPattern(op: string) {
  return new RegExp(op + "\\(\\d{1,3},\\d{1,3}\\)", "g");
}

function filterDonts(i: string) {
  return Array.from(i.matchAll(/(?:do\(\)|^)(?:.|\s)*?(?:don't\(\)|$)/g)).join("");
}

function getTokens(i: string[]) {
  return i.map((e) => {
    const matches = e.match(/(^\w+)\((\d{1,3}),(\d{1,3})\)/);
    if (!matches || matches.length < 4) throw Error("Oops");
    return {
      fn: matches[1],
      param1: parseInt(matches[2], 10),
      param2: parseInt(matches[3], 10),
    };
  });
}

const fnMap: Record<string, (a: number, b: number) => number> = {
  mul: (a, b) => a * b,
};

function calc(tokens: { fn: string; param1: number; param2: number }) {
  return fnMap[tokens.fn](tokens.param1, tokens.param2);
}

const part1 = (input: typeof data) => {
  const solver = pipe<typeof data>()
    .then(match(getPattern("mul")))
    .then(getTokens)
    .then(map(calc))
    .then(sum);

  let result = solver(input);
  return result;
};

const part2 = (input: typeof data) => {
  const solver = pipe<typeof data>()
    .then(filterDonts)
    .then(match(getPattern("mul")))
    .then(getTokens)
    .then(map(calc))
    .then(sum)

  let result = solver(input);
  return result;
};

// Base test - check that input is not empty
test(load((d) => d).data.length > 0, true, "Has input");
test(
  filterDonts(`xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?
mul(8,5))xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`),
  `xmul(2,4)&mul[3,7]!^don't()do()?
mul(8,5))xmul(2,4)&mul[3,7]!^don't()do()?mul(8,5))`
);

// Time and log results
console.time("Part 1");
const resultA = part1(data);
console.timeEnd("Part 1");
console.log("First answer:", resultA);

console.time("Part 2");
const resultB = part2(data);
console.timeEnd("Part 2");
console.log("Second answer:", resultB);
