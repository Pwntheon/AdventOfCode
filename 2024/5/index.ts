import { test, load, pipe } from "@utils";
import { lines, map, split } from "utils/helpers";

type Rule = { first: string; second: string };

const parseRules = pipe<string[]>()
  .then(split("|"))
  .then(map((a) => ({ first: a[0], second: a[1] })));

const parseUpdates = pipe<string[]>().then(split(","));

// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>()
  .then(lines)
  .then((i) => {
    const rules = parseRules(i.filter((l) => l.includes("|")));
    const updates = parseUpdates(i.filter((l) => l.includes(",")));
    return { rules, updates };
  });

function satisfies(update: string[], rule: Rule) {
  let first = update.indexOf(rule.first);
  let second = update.indexOf(rule.second);
  return first === -1 || second === -1 || first < second;
}

function isValid(update: string[], rules: Rule[]) {
  return rules.every((r) => satisfies(update, r));
}

function swap(update: string[], rule: Rule | undefined) {
  if(!rule) return;
  let first = update.indexOf(rule.first);
  let second = update.indexOf(rule.second);
  [update[first], update[second]] = [update[second], update[first]]; // Swap in place
}

function getMiddleValue(update: string[]) {
  const middle = Math.floor(update.length / 2);
  return parseInt(update[middle], 10);
}

function sortUpdate(update: string[], rules: Rule[]) {
  let invalidRules: Rule[] = [];
  do {
    invalidRules = rules.filter((r) => !satisfies(update, r));
    swap(update, invalidRules[0]);
  } while (invalidRules.length > 0);
}

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const { data, loadRaw, loadFile } = load(parseInput);

const part1 = (input: typeof data) => {
  return input.updates
    .filter((u) => isValid(u, input.rules))
    .reduce((acc, curr) => acc + getMiddleValue(curr), 0);
};

const part2 = (input: typeof data) => {
  const invalid = input.updates.filter((u) => !isValid(u, input.rules));
  // return invalid.length;
  invalid.forEach((u) => sortUpdate(u, input.rules));
  return invalid.reduce((acc, curr) => acc + getMiddleValue(curr), 0);
};

// Base test - check that input is not empty
test(load((d) => d).data.length > 0, true, "Has input");
const testInput = loadFile("example.txt");
const validUpdates = testInput.updates.filter((u) =>
  isValid(u, testInput.rules)
);
test(validUpdates[0].join(), "75,47,61,53,29");
test(validUpdates[1].join(), "97,61,53,29,13");
test(validUpdates[2].join(), "75,29,13");
test(
  validUpdates.reduce((acc, curr) => acc + getMiddleValue(curr), 0),
  143
);

const invalidUpdates = testInput.updates.filter(
  (u) => !isValid(u, testInput.rules)
);
invalidUpdates.forEach((u) => sortUpdate(u, testInput.rules));
test(invalidUpdates[0].join(), "97,75,47,61,53");
test(invalidUpdates[1].join(), "61,29,13");
test(invalidUpdates[2].join(), "97,75,47,29,13");
test(
  invalidUpdates.reduce((acc, curr) => acc + getMiddleValue(curr), 0),
  123
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
