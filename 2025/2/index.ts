import { test, load, pipe } from "@utils";
import { chunkString } from "utils/chunkString";
import { flat, lines, map, split } from "utils/helpers";
import { range } from "utils/range";

// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>()
  .then(lines)
  .then(split(","))
  .then((i) => i[0])
  .then(map(explode))
  .then(flat);

function explode(ids: string) {
  const [min, max] = ids.split("-").map((i) => parseInt(i, 10));
  return range(min, max + 1);
}

function isValid(input: number) {
  const asString = "" + input;
  for (let i = 1; i <= asString.length / 2; ++i) {
    const chunks = chunkString(asString, i)!;
    if(chunks.length !== 2) continue
    const uniqueChunks = Array.from(new Set(chunks));
    // console.log(`${input} in ${i} length chunks: ${chunks}`);
    // console.log(`Unique chunks: ${uniqueChunks}`);
    if (uniqueChunks.length === 1) {
      // console.log(`${input} invalid, because ${chunks} can be built by repeating ${uniqueChunks}`);
      return false;
    }
  }
  return true;
}

function isValid2(input: number) {
  const asString = "" + input;
  for (let i = 1; i <= asString.length / 2; ++i) {
    const chunks = chunkString(asString, i)!;
    const uniqueChunks = Array.from(new Set(chunks));
    // console.log(`${input} in ${i} length chunks: ${chunks}`);
    // console.log(`Unique chunks: ${uniqueChunks}`);
    if (uniqueChunks.length === 1) {
      // console.log(`${input} invalid, because ${chunks} can be built by repeating ${uniqueChunks}`);
      return false;
    }
  }
  return true;
}

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const { data, loadRaw, loadFile } = load(parseInput);

const part1 = (input: typeof data) => {
  const solver = pipe<typeof data>();

  let raw = solver(input);

  const result = raw.reduce((acc, curr) => acc + (isValid(curr) ? 0 : curr), 0);

  return result;
};

const part2 = (input: typeof data) => {
  const solver = pipe<typeof data>();

  let raw = solver(input);

  const result = raw.reduce((acc, curr) => acc + (isValid2(curr) ? 0 : curr), 0);

  return result;
};

// Base test - check that input is not empty
test(load((d) => d).data.length > 0, true, "Has input");
test(explode("10-12"), [10, 11, 12], "Explode ranges");
test(loadRaw("10-12,15-16"), [10, 11, 12, 15, 16], "Input parsing");
test(chunkString("abcd", 2), ["ab", "cd"], "Chunk string");
test(chunkString("abcde", 2), ["ab", "cd", "e"], "Chunk string irregular");
test(isValid(1242152512), true, "Valid number");
test(isValid(121212), true, "Invalid 2");
test(isValid(11), false, "Invalid 1");

// test(part1(loadRaw("11-22")), 2);
// test(part1(loadRaw("95-115")), 1);
// test(part1(loadRaw("998-1012")), 1);
// test(part1(loadRaw("1188511880-1188511890")), 1);
// test(part1(loadRaw("222220-222224")), 1);
// test(part1(loadRaw("1698522-1698528")), 0);
// test(part1(loadRaw("446443-446449")), 1);
// test(part1(loadRaw("38593856-38593862")), 1);

// // Time and log results
console.time("Part 1");
const resultA = part1(data);
console.timeEnd("Part 1");
console.log("First answer:", resultA);

console.time("Part 2");
const resultB = part2(data);
console.timeEnd("Part 2");
console.log("Second answer:", resultB);
