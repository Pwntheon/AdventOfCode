import { test, load, pipe } from "@utils";
import { chunkString } from "utils/chunkString";
import { lines } from "utils/helpers";

// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>()
  .then(lines);

function getFirstDigit(input: string) {
  const arrayed = input.split("");
  arrayed.pop();
  return arrayed.sort()[arrayed.length-1];
}

function getHighestDigitWithSpaceLeftover(bank: string, remainingDigits: number) {
  const arrayed = bank.substring(0, bank.length - remainingDigits + 1).split("");
  return arrayed.sort()[arrayed.length-1];
}

function getMaxJoltageWithNBatteries(bank: string, n: number) {
  let remaining = bank;
  let result = "";
  for(let i = n; i > 0; --i) {
    const biggest = getHighestDigitWithSpaceLeftover(remaining, i);
    const index = remaining.split("").findIndex(v => v === biggest);
    remaining = remaining.substring(1+index);
    result += biggest;
  }
  return parseInt(result, 10);
}

function getSecondDigit(input: string, firstDigit: string) {
  const firstDigitIndex = input.split("").findIndex(v => v === firstDigit);
  const remaining = input.slice(firstDigitIndex+1).split("");
  return remaining.sort()[remaining.length-1];
}

function getMaxJoltage(input: string) {
  const firstDigit = getFirstDigit(input);
    const secondDigit = getSecondDigit(input, firstDigit);
    return parseInt(firstDigit+secondDigit, 10);
}

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const {data, loadRaw, loadFile} = load(parseInput);

const part1 = (input: typeof data) => {
  const values = input.map(getMaxJoltage)

  return values.reduce((acc, curr) => acc + curr, 0);
};

const part2 = (input: typeof data) => {
  const values = input.map(bank => getMaxJoltageWithNBatteries(bank, 12));
  
  return values.reduce((acc, curr) => acc + curr, 0);
};

// Base test - check that input is not empty
test(load(d => d).data.length > 0, true, "Has input");
test(getFirstDigit("18723618723230291"), "9", "Get first digit 9 in middle");
test(getFirstDigit("18723618723230289"), "8", "Get first digit 9 last");
test(getSecondDigit("18723618723230291", "9"), "1", "Get second digit 1")
test(getSecondDigit("18723698723230291", "9"), "9", "Get second digit with first digit appearing twice")
test(getSecondDigit("18723698723230299", "9"), "9", "Get second digit with first digit appearing twice")

test(getMaxJoltage("987654321111111"), 98, "testcase 1")
test(getMaxJoltage("811111111111119"), 89, "testcase 2")
test(getMaxJoltage("234234234234278"), 78, "testcase 3")
test(getMaxJoltage("818181911112111"), 92, "testcase 4")
test(getMaxJoltageWithNBatteries("234234234234278", 12), 434234234278, "12 batteries 1")

// Time and log results
console.time("Part 1");
const resultA = part1(data);
console.timeEnd("Part 1");
console.log("First answer:", resultA);

console.time("Part 2");
const resultB = part2(data);
console.timeEnd("Part 2");
console.log("Second answer:", resultB);
