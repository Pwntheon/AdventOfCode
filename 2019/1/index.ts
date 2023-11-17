import { h, test, InputParser } from "#root/utils/index.ts";
import { InputParserNumbers } from "#root/utils/input";
console.clear();

const input = InputParser.load()
  .splitOnNewline()
  .toInt()

function getFuelPerPart(weight: number) {
  return Math.floor(weight / 3) - 2;
}

const goA = (data: InputParserNumbers) => {
  let result = data.forEach(getFuelPerPart).sum().finish();
  return result;
}

const goB = (data: InputParserNumbers) => {
  let result = data.finish();
  return result
}

/* Tests */

// test(result, expected)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)