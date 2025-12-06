import { test, load, pipe } from "@utils";
import { lines, mul, rotate, split, sum } from "utils/helpers";

// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>().then(lines).then(split());

const cephParseInput = pipe<string>()
  .then(lines)
  .then(splitPreservingWhitespace)
  .then(rotate)
  .then(lines => lines.reverse());

// Our split fn from lib trims the input, and we don't want that
function splitPreservingWhitespace(lines: string[]) {
  return lines.map(l => l.split(""))
}

type ValidInstruction = "*" | "+";
function isValidInstruction(input: string | undefined): input is ValidInstruction {
  return input === "*" || input === "+";
}
const ops: Record<ValidInstruction, (i: number[]) => number> = {
  "+": sum,
  "*": mul,
};

type Problem = {
  numbers: number[],
  instruction: ValidInstruction
};
function groupIntoProblems(input: string[][]): Problem[]{
  const result: Problem[] = [];
  let numbers: number[] = [];

  input.forEach(line => {
    // Probably supposed to use empty lines to "end" a problem,
    // but hitting an instruction serves the same purpose
    if(line.every(l => l === " ")) return;

    const instruction = line.pop();
    numbers.push(parseInt(line.join(""), 10));
    if(isValidInstruction(instruction)) {
      result.push({instruction: instruction, numbers: [...numbers]});
      numbers = [];
    }
  });
  return result
}

function solveProblem(problem: string[]) {
  const instruction = problem.pop();
  if(!isValidInstruction(instruction)) throw "Invalid instruction: " + instruction;
  const op = ops[instruction];
  return op(problem.map((num) => parseInt(num, 10)));
}

function solveProblem2(problem: Problem) {
  return ops[problem.instruction](problem.numbers);
}

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const { data, loadRaw, loadFile } = load(parseInput);
const { data: cephData, loadRaw: cephLoadRaw, loadFile: cephLoadFile } = load(cephParseInput);

const part1 = (input: typeof data) => {
  const solver = pipe<typeof data>().then(rotate);

  const problems = solver(input);
  return problems.reduce((total, problem) => total + solveProblem(problem), 0);
};

const part2 = (input: typeof data) => {
  const problems = groupIntoProblems(input);
  return sum(problems.map(p => solveProblem2(p)))
};

// Base test - check that input is not empty
test(load((d) => d).data.length > 0, true, "Has input");
test(
  data[0].every((l) => l.length > 0),
  true,
  "No empty items after parse"
);
test(
  Array.from(new Set(data.map((l) => l.length))).length,
  1,
  "All lines same length"
);
const testSolver = pipe<typeof data>().then(rotate);
const rotated = testSolver(data);

test(data.length, rotated[0].length, "Rotation flips x and y size");
test(data[0].length, rotated.length, "Rotation flips y and x size");
test(data[0][4], rotated[4][0], "Spot check that data rotates");
test(solveProblem(["1", "2", "3", "+"]), 6, "Addition problem");
test(solveProblem(["4", "5", "6", "*"]), 120, "Multiplication problem");

// Cephalapod parsing

const cephExample = cephLoadFile("example.txt");
test(cephExample[0].join(""), "  4 ", "Cephalopod parsing, line 1")
test(cephExample[1].join(""), "431 ", "Cephalopod parsing, line 2")
test(cephExample[2].join(""), "623+", "Cephalopod parsing, line 3")
const cephProblems = groupIntoProblems(cephExample);
test(cephProblems[0].instruction, "+", "Cephalopod parsing: First problem correct operation")
test(cephProblems[0].numbers, [4, 431, 623], "Cephalopod parsing: First problem correct numbers")
test(solveProblem2(cephProblems[0]), 1058, "Cephalopod parsing: First problem solution")
test(cephProblems[1].instruction, "*", "Cephalopod parsing: Second problem correct operation")
test(cephProblems[1].numbers, [175, 581, 32], "Cephalopod parsing: Second problem correct numbers")
test(solveProblem2(cephProblems[1]), 3253600, "Cephalopod parsing: Second problem solution")






// Time and log results
console.time("Part 1");
const resultA = part1(data);
console.timeEnd("Part 1");
console.log("First answer:", resultA);

console.time("Part 2");
const resultB = part2(cephData);
console.timeEnd("Part 2");
console.log("Second answer:", resultB);
