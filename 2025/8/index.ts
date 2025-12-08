import { test, load, pipe } from "@utils";
import { lines, map, split } from "utils/helpers";
import Vec3 from "utils/vec3";

// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>()
  .then(lines);

type Connection = {a: number, b: number, dist: number};

function buildCache(nodes: Vec3[]) {
  console.time("Building cache over distance between node map of size " + nodes.length)
  const cache: Connection[] = [];
  for(let a = 0; a < nodes.length; ++a) {
    // if a < b, we have already calculated the distance for
    // that pair, so b's initial value is set to a. This saves
    // us for looking for reverse duplicates (e.g. [1, 2] [2, 1])
    for(let b = a; b < nodes.length; ++b) {
      if(a === b) continue;
      cache.push({ a, b, dist: nodes[a].distance(nodes[b])});
    }
  }
  cache.sort((a, b) => a.dist - b.dist);
  console.timeEnd("Building cache over distance between node map of size " + nodes.length)
  console.log(`${nodes.length} nodes resulted in ${cache.length} connections`)
  return cache;
}

function lineToVec3(input: string) {
  const coords = input.split(",");
  if(coords.length !== 3 || coords.some(c => c.length <= 0)) throw "Invalid coordinate";

  const [x, y, z] = coords.map(c => parseInt(c, 10));
  return new Vec3(x, y, z);  
}

function getCircuits(connections: Connection[]) {
  let result: number[][] = []
  connections.forEach((connection) => {
    result.push([connection.a, connection.b]);
  });

 return mergeAll(result)
}

function mergeAll(circuits: number[][]) {
  let lengthBefore: number;
  do{
    lengthBefore = circuits.length;
    circuits = mergeOnce(circuits);
  } while (circuits.length !== lengthBefore)
    return circuits;
}


function mergeOnce(circuits: number[][]) {
  let result: number[][] = [];
  while(circuits.length) {
    let candidate = circuits.pop()!;
    let mergeIndex = result.findIndex(circuit => circuit.some(n => candidate.includes(n)));
    if(mergeIndex >= 0) {
      // console.log(`Merging ${candidate} and ${result[mergeIndex]}`)
      result[mergeIndex] = Array.from(new Set([...(result[mergeIndex]), ...candidate]));
      
      // console.log(`Result: ${result[mergeIndex]}`)
    } else {
      result.push(candidate);
    }
  }
  return result.sort((a, b) => b.length - a.length);
}

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const {data, loadRaw, loadFile} = load(parseInput);

const cache = buildCache(data.map(lineToVec3));

const part1 = (input: typeof cache) => {
  const shortestThousand = input.slice(0, 1000);
  const circuits = getCircuits(shortestThousand);
  return circuits[0].length * circuits[1].length * circuits[2].length;
};

const part2 = (input: typeof cache) => {
  let circuits: number[][] = getCircuits(input.slice(0, 1000));
  let finalNode: Connection | null = null;
  for(let i = 1000; i < input.length; ++i) {
    const newCircuit = [input[i].a, input[i].b];
    circuits.push(newCircuit);
    circuits = mergeAll(circuits);
    if(circuits[0].length === data.length) {
      finalNode = input[i];
      break;
    }
  }
  const firstCoord = lineToVec3(data[finalNode!.a]).x;
  const secondCoord = lineToVec3(data[finalNode!.b]).x;
  
  return firstCoord * secondCoord;
};

// Base test - check that input is not empty
test(load(d => d).data.length > 0, true, "Has input");
test(lineToVec3("1,2,3").toString(), "[1,2,3]", "Vec3 parsing")



const example = loadFile("example.txt").map(lineToVec3);
const exampleCache = buildCache(example);
const tenShortest = exampleCache.slice(0, 10);
const circuits = getCircuits(tenShortest);
test(circuits[0].length * circuits[1].length * circuits[2].length, 40, "Example count")



// Time and log results
console.time("Part 1");
const resultA = part1(cache);
console.timeEnd("Part 1");
console.log("First answer:", resultA);

console.time("Part 2");
const resultB = part2(cache);
console.timeEnd("Part 2");
console.log("Second answer:", resultB);
