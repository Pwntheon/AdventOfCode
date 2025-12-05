import { test, load, pipe } from "@utils";
import { lines } from "utils/helpers";

type Range = {
  min: number;
  max: number;
};
type InputData = {
  freshRanges: Range[];
  ingredients: number[];
};
// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>()
  .then(lines)
  .then((l) =>
    l.reduce(
      (acc, curr): InputData => {
        const val = parseLine(curr);
        if (!val) return acc;
        if (typeof val === "number")
          return { ...acc, ingredients: [...acc.ingredients, val] };
        return { ...acc, freshRanges: [...acc.freshRanges, val] };
      },
      { freshRanges: [], ingredients: [] }
    )
  );

function parseLine(line: string) {
  if (line.length <= 0) return null;
  const parsed = line.split("-").map((n) => parseInt(n, 10));
  if (parsed.length === 1) return parsed[0];
  const range = { min: parsed[0], max: parsed[1] };
  return range;
}

function getFreshnessChecker(inputRanges: Range[]) {
  const ranges = inputRanges.sort((a, b) => a.min - b.min);
  return (ingredient: number) => {
    for (let i = 0; i < ranges.length; ++i) {
      if (ingredient < ranges[i].min) continue;
      // console.log(`is above min value for ${ranges[i].min}-${ranges[i].max}`);
      if (ingredient <= ranges[i].max) return true;
      // console.log(`was also above max value for ${ranges[i].min}-${ranges[i].max}`)
    }
    return false;
  };
}

function canCombine(first: Range, second: Range) {
  // Full overlap
  if (first.min <= second.min - 1 && first.max >= second.max + 1) return true;
  if (second.min <= first.min - 1 && second.max >= first.max + 1) return true;
  // Partial overlap
  if (first.min >= second.min - 1 && first.min <= second.max + 1) return true;
  if (first.max >= second.min - 1 && first.max <= second.max + 1) return true;
  return false;
}

function getCombined(first: Range, second: Range) {
  if(!canCombine(first, second)) return null;
  return {
    min: Math.min(first.min, second.min),
    max: Math.max(first.max, second.max),
  };
}

function combineRanges(ranges: Range[]) {
  // console.log("Before combine: ", ...ranges.map(r => r.min + "-" + r.max));
  let combined: Range | null = null;
  for(let a = 0; a < ranges.length; ++a) {
    for(let b = 0; b < ranges.length; ++b) {
      if(a === b) continue;
      combined = getCombined(ranges[a], ranges[b]);
      if(combined) {
        // console.log(`${ranges[a].min}-${ranges[b].max} and ${ranges[b].min}-${ranges[b].max} combined into ${combined.min}-${combined.max}`)
        ranges.splice(a, 1);
        if(a < b) --b; // index shifts if a is lower, since we remove it first
        ranges.splice(b, 1);
        
        // console.log("Before adding combined: ", ...ranges.map(r => r.min + "-" + r.max));
        ranges.push(combined);
        // console.log("After adding combined: ", ...ranges.map(r => r.min + "-" + r.max));
        return true;
      }
    }
  }
  return false;
}

function combineAll(ranges: Range[]) {
  let didCombine = false;
  do{
    didCombine = combineRanges(ranges);
  } while(didCombine);
  return ranges.sort((a, b) => a.min - b.min);
}

function countRange(range: Range) {
  return range.max - range.min + 1; // add 1 because start & end are both inclusive
}

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const { data, loadRaw, loadFile } = load(parseInput);

const part1 = (input: typeof data) => {
  const isFresh = getFreshnessChecker(input.freshRanges);
  const freshIngredients = input.ingredients.filter(isFresh);

  return freshIngredients.length;
};

const part2 = (input: typeof data) => {

  const combined = combineAll(data.freshRanges);
  const result = combined.reduce((acc, curr) => countRange(curr) + acc, 0);
  return result;
};

// Base test - check that input is not empty
test(load((d) => d).data.length > 0, true, "Has input");
test(parseLine(""), null, "parseLine empty line");
test(parseLine("12421"), 12421, "parseLine single number");
test(parseLine("12-15"), { min: 12, max: 15 }, "parseLine range");

const exampleData = loadRaw(`
3-5
10-14
16-20
12-18
`);

const checker = getFreshnessChecker(exampleData.freshRanges);
test(checker(1), false, "1");
test(checker(5), true, "5");
test(checker(8), false, "8");
test(checker(11), true, "11");
test(checker(17), true, "17");
test(checker(32), false, "32");

test(canCombine({ min: 1, max: 100 }, { min: 50, max: 75 }), true, "Overlaps (second contained by first)");
test(canCombine({ min: 24, max: 25 }, { min: 20, max: 30 }), true, "Overlaps (first contained by second)");
test(canCombine({ min: 24, max: 25 }, { min: 26, max: 30 }), true, "Touches above");
test(canCombine({ min: 24, max: 25 }, { min: 1, max: 23 }), true, "Touches below");
test(canCombine({ min: 24, max: 60 }, { min: 50, max: 100 }), true, "Partial overlap");
test(canCombine({ min: 24, max: 60 }, { min: 62, max: 100 }), false, "No overlap");

test(getCombined({ min: 1, max: 100 }, { min: 50, max: 75 }), {min: 1, max: 100}, "Combine: Overlaps (second contained by first)");
test(getCombined({ min: 24, max: 25 }, { min: 20, max: 30 }), {min: 20, max: 30}, "Combine: Overlaps (first contained by second)");
test(getCombined({ min: 24, max: 25 }, { min: 26, max: 30 }), {min: 24, max: 30}, "Combine: Touches above");
test(getCombined({ min: 24, max: 25 }, { min: 1, max: 23 }), {min: 1, max: 25}, "Combine: Touches below");
test(getCombined({ min: 24, max: 60 }, { min: 50, max: 100 }), {min: 24, max: 100}, "Combine: Partial overlap");
test(getCombined({ min: 24, max: 60 }, { min: 62, max: 100 }), null, "Combine: No overlap");

const toCombine = loadRaw(`
1-5
6-8
500-600
505-506
700-800
750-900
`).freshRanges;

const combineExpectedResult = loadRaw(`
1-8
500-600
700-900
`).freshRanges;

test(combineAll(toCombine), combineExpectedResult, "Combine ranges" )

test(countRange({min: 5, max: 10}), 6, "Count range 5-10")

// Time and log results
console.time("Part 1");
const resultA = part1(data);
console.timeEnd("Part 1");
console.log("First answer:", resultA);

console.time("Part 2");
const resultB = part2(data);
console.timeEnd("Part 2");
console.log("Second answer:", resultB);
