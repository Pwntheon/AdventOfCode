import { test, load, pipe } from "@utils";
import { lines, map, match, toInt } from "utils/helpers";

// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>()
  .then(lines)
  .then(
    map((e) => {
      return {
        target: parseTarget(e),
        terms: parseTerms(e),
      };
    })
  );

const parseTarget = pipe<string>()
  .then(match(/^\d*/g))
  .then(toInt)
  .then((i) => i[0]);

const parseTerms = pipe<string>()
  .then(match(/ (\d*)/g))
  .then(map((s) => s.trim()))
  .then(toInt);

const ops = ["+", "*"];
const ops2 = ["+", "*", ""];

function generatePermutations(permutations: number[][], operators: string[]) {
  if (permutations[0].length === 1) return permutations;
  return generatePermutations(
    operators.flatMap((o) =>
      permutations.map((p) => [fastEval(p[0],o,p[1]), ...p.slice(2)])
    ),
    operators
  );
}

function fastEval(t1: number, o: string, t2: number) {
  if(o === "+") return t1+t2;
  if(o === "*") return t1*t2;
  return parseInt(`${t1}${t2}`, 10);
}

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const { data, loadRaw, loadFile } = load(parseInput);

const part1 = (input: typeof data) => {
  return input.reduce((acc, curr) => {
    const permutations = generatePermutations([curr.terms], ops).flat();
    if (permutations.some((p) => p === curr.target)) return acc + curr.target;
    return acc;
  }, 0);
};

const part2 = (input: typeof data) => {
  return input.reduce((acc, curr) => {
    const permutations = generatePermutations([curr.terms], ops2).flat();
    if (permutations.some((p) => p === curr.target)) return acc + curr.target;
    return acc;
  }, 0);
};

// Base test - check that input is not empty
test(load((d) => d).data.length > 0, true, "Has input");
test(part1(loadFile("example.txt")), 3749);

// Time and log results
console.time("Part 1");
const resultA = part1(data);
console.timeEnd("Part 1");
console.log("First answer:", resultA);

console.time("Part 2");
const resultB = part2(data);
console.timeEnd("Part 2");
console.log("Second answer:", resultB);
