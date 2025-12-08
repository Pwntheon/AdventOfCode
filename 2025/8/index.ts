import { test, load, pipe } from "@utils";
import { lines, map, split } from "utils/helpers";
import Vec3 from "utils/vec3";

// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>()
  .then(lines);

const distanceCache: Record<string, number> = {};
function getCachedDistance(a: Vec3, b: Vec3) {
  const key = `${a.toString()}-${b.toString()}`;
  const result = distanceCache[key];
  if(result) return result;
  const calculated = a.distance(b);
  distanceCache[key] = calculated;
  return calculated;
}

function lineToVec3(input: string) {
  const coords = input.split(",");
  if(coords.length !== 3 || coords.some(c => c.length <= 0)) throw "Invalid coordinate";

  const [x, y, z] = coords.map(c => parseInt(c, 10));
  return new Vec3(x, y, z);  
}

function getClosest(boxes: Vec3[], junctions: number[][]) {
  let a = 0;
  let b = 0;
  let distance = Number.MAX_SAFE_INTEGER;
  for(let self = 0; self < boxes.length; ++self) {
    for(let other = 0; other < boxes.length; ++other) {
      // Cannot link to self
      if(self === other) continue;
      // There is already a junction between
      if(junctions.some(j => j.includes(self) && j.includes(other))) {
        continue;
      }
      const currentDistance = getCachedDistance(boxes[self], boxes[other]);
      if(currentDistance < distance) {
        a = self;
        b = other;
        distance = currentDistance
      }
    }
  }
  return [a, b];
}

function mergeJunctions(junctions: number[][], toAdd: number[]) {
  if(toAdd.length !== 2) throw "cannot add new junction of size != 2";
  for(let i = 0; i < junctions.length; ++i) {
    if(junctions[i].includes(toAdd[0])) {
      junctions[i].push(toAdd[1]);
      junctions.sort((a, b) => b.length - a.length);
      return;
    }
    if(junctions[i].includes(toAdd[1])) {
      junctions[i].push(toAdd[0]);
      junctions.sort((a, b) => b.length - a.length);
      return;
    }
  }
  junctions.push([...toAdd]);
  junctions.sort((a, b) => b.length - a.length);
}

function makeConnections(boxes: Vec3[], junctions: number[][], iterations: number) {
  for(let i = 0; i < iterations; ++i) {
    console.time("Iteration " + i);
    const shortestJunction = getClosest(boxes, junctions);
    mergeJunctions(junctions, shortestJunction);
    console.timeEnd("Iteration " + i);
  }
}

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const {data, loadRaw, loadFile} = load(parseInput);

const part1 = (input: typeof data) => {
  const nodes = input.map(lineToVec3);
  const junctions: number[][] = nodes.map((_, i) => [i]);

  makeConnections(nodes, junctions, 1000);


  let result = junctions[0].length * junctions[1].length * junctions[2].length;
  return result;
};

const part2 = (input: typeof data) => {
  const solver = pipe<typeof data>()

  let result = solver(input);

  return "Not solved";
};

// Base test - check that input is not empty
test(load(d => d).data.length > 0, true, "Has input");
test(lineToVec3("1,2,3").toString(), "[1,2,3]", "Vec3 parsing")


const testBoxes = loadFile("example.txt").map(lineToVec3);
test(getClosest(testBoxes, []), [0, 19], "GetClosest")
test(getClosest(testBoxes, [[0, 19]]), [0, 7], "GetClosest")

let testJunctions = [[1, 2, 3], [7, 8], [100]];
mergeJunctions(testJunctions, [2, 19])
mergeJunctions(testJunctions, [100, 98])
mergeJunctions(testJunctions, [98, 105])
test(testJunctions, [[1, 2, 3, 19], [100, 98, 105], [7, 8] ], "Merge junctions")

const example = loadFile("example.txt").map(lineToVec3);
const junctions: number[][] = example.map((_, i) => [i]);
makeConnections(example, junctions, 10);
test(junctions[0].length * junctions[1].length * junctions[2].length, 40, "Example answer")


// Time and log results
console.time("Part 1");
const resultA = part1(data);
console.timeEnd("Part 1");
console.log("First answer:", resultA);

console.time("Part 2");
const resultB = part2(data);
console.timeEnd("Part 2");
console.log("Second answer:", resultB);
