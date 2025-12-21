import { test, load, pipe } from "@utils";
import { allSubsetsOf, getAllSubsets, lines, logProgress, map, split, sum } from "utils/helpers";

// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>()
  .then(lines)
  .then(split(" "))
  .then(map(parseParts))

function parseParts(line: string[]) {
  const diagram = line.shift()!;
  const requirements = line.pop()!;
  const buttons = line.map(l => l.substring(1, l.length-1).split(",").map(e => parseInt(e, 10)))
  return {
    diagram: diagram.substring(1, diagram.length-1),
    requirements: requirements.substring(1, requirements.length-1).split(",").map(e => parseInt(e, 10)),
    buttons};
}

function diagramToInt(diagram: string) {
  diagram = diagram.replaceAll(".", "0");
  diagram = diagram.replaceAll("#", "1");
  
  return parseInt(diagram.split("").reverse().join(""), 2);
}

function buttonToInt(button: number[]) {
  return sum(button.map(v => Math.pow(2, v)))
}

function xorButtons(buttons: number[][]) {
  return buttons.reduce((acc, curr) =>  acc ^ buttonToInt(curr), 0);
}

function findButtons(diagram: string, buttons: number[][]) {
  const validButtonCombinations:  number[][][] = [];
  const target = diagramToInt(diagram);
  for(const combination of allSubsetsOf(buttons)) {
    if(xorButtons(combination) === target) validButtonCombinations.push(combination)
  }
  return validButtonCombinations;
}


function findMinimalNumberOfButtonPresses(diagram: string, buttons: number[][]) {
  const target = diagramToInt(diagram);
  for(const combination of allSubsetsOf(buttons)) {
    if(xorButtons(combination) === target) return combination.length;
  }
  return Number.MIN_SAFE_INTEGER;
}

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const {data, loadRaw, loadFile} = load(parseInput);

const part1 = (input: typeof data) => {
  let result = 0;
  for(let i = 0; i < input.length; ++i) {
    result += findMinimalNumberOfButtonPresses(input[i].diagram, input[i].buttons)
  }
  return result;
};

const part2 = (input: typeof data) => {
  const solver = pipe<typeof data>()

  let result = solver(input);

  result = "Not solved";
  return result;
};

// Base test - check that input is not empty
test(load(d => d).data.length > 0, true, "Has input");
const example = loadFile("example.txt");
test(example[0].diagram, ".##.", "Diagram parses")
test(example[0].requirements, [3,5,4,7], "Requirements parses")
test(example[0].buttons[1], [1,3], "Buttons parse")
test(diagramToInt(".#..#"), 18, "diagramToInt")
test(buttonToInt([1, 4]), 18, "buttonToInt")
test(buttonToInt([3, 4, 6, 7]), 216, "buttonToInt")
test(buttonToInt([1, 3]), 10, "buttonToInt")
test(xorButtons([[1, 4],[1, 3]]), buttonToInt([3, 4]), "xorButtons")
test(findMinimalNumberOfButtonPresses(example[0].diagram, example[0].buttons), 2, "Minimal button presses")
test(findMinimalNumberOfButtonPresses(example[1].diagram, example[1].buttons), 3, "Minimal button presses")


// Time and log results
console.time("Part 1");
const resultA = part1(data);
console.timeEnd("Part 1");
console.log("First answer:", resultA);

console.time("Part 2");
const resultB = part2(data);
console.timeEnd("Part 2");
console.log("Second answer:", resultB);
