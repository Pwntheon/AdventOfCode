import { test, load, pipe } from "@utils";
import Grid from "utils/grid";
import { lines, logProgress, logToFile, map } from "utils/helpers";
import Vec2i from "utils/vec2";

// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>()
  .then(lines)
  .then(map(l => {
    const [x, y] = l.split(",").map(n => parseInt(n, 10));
    return {x, y} as Coord;
  }));

type Distance = {a: number, b: number, size: number}

function getSize(a: Vec2i, b: Vec2i) {
  const {x, y} = a.sub(b);
  return (Math.abs(x) +1) * (Math.abs(y) +1);
}

function buildCache(nodes: Vec2i[]) {
  const xZip: Record<number, number> = {};
  const xUnzip: Record<number, number> = {};
  const yZip: Record<number, number> = {};
  const yUnzip: Record<number, number> = {};
  console.time(`Build cache for ${nodes.length} nodes`);
  nodes.toSorted((a, b) => b.x - a.x).forEach((e, i) => {
    xZip[e.x] = 1+i*2;
    xUnzip[1+i*2] = e.x;
  })
  nodes.toSorted((a, b) => b.y - a.y).forEach((e, i) => {
    yZip[e.y] = i*2;
    yUnzip[i*2] = e.y;
  })
  function zip(vec: Vec2i) {
    return new Vec2i(xZip[vec.x], yZip[vec.y]);
  }
  function unzip(vec: Vec2i) {
    return new Vec2i(xUnzip[vec.x], yUnzip[vec.y]);
  }

  const sizeCache: Distance[] = [];
  for(let a = 0; a < nodes.length; ++a) {
    for(let b = a; b < nodes.length; ++b) {
        if(a === b) continue;
        sizeCache.push({a, b, size: getSize(nodes[a], nodes[b])});
    }
  }
  sizeCache.sort((a, b) => b.size - a.size);
  console.timeEnd(`Build cache for ${nodes.length} nodes`);
  return {sizeCache, zip, unzip};
}

function buildGrid(nodes: Vec2i[]) {
  console.time("Build grid");
  const xSize = nodes.toSorted((a, b) => b.x - a.x)[0].x + 2;
  const ySize = nodes.toSorted((a, b) => b.y - a.y)[0].y + 2;
  const grid = Grid.makeBlank(xSize, ySize, ".");
  let previous = nodes[nodes.length-1];
  for(let i = 0; i < nodes.length; ++i) {
    const current = nodes[i];
    for(const step of grid.between(previous, current)) grid.write(step, "X");
    grid.write(current, "#")
    previous = current;
  }
  console.timeEnd("Build grid");
  return grid;
}

function isValid(grid: Grid, a: Vec2i, b: Vec2i) {
  for(const node of grid.square(a, b)) {
    if(grid.at(node) === "+") return false;
  }
  return true;
}

type Coord = {x: number, y: number};
// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const {data, loadRaw, loadFile} = load(parseInput);

const part1 = (input: typeof data) => {
  const points = input.map(i => new Vec2i(i.x, i.y));
  const {sizeCache} = buildCache(points);
  
  return sizeCache[0].size;
};

const part2 = (input: typeof data) => {
  
  const points = input.map(i => new Vec2i(i.x, i.y));
  const {sizeCache, zip, unzip} = buildCache(points);

  const zipped = points.map(zip);
  const map = buildGrid(zipped);
  console.time("Flood fill outside");
  map.floodFill(new Vec2i(0, 0), "+");
  console.timeEnd("Flood fill outside");

  for(let i = 0; i < sizeCache.length; ++i) {
    logProgress(`${i}`.padStart(6) + "/" + sizeCache.length);
    if(isValid(map, zipped[sizeCache[i].a], zipped[sizeCache[i].b])) {
      return sizeCache[i].size;
    }
  }
  return "Not solved";
};

// Base test - check that input is not empty
test(load(d => d).data.length > 0, true, "Has input");
test(typeof data[0].x, "number", "Input parsing x");
test(typeof data[0].y, "number", "Input parsing y");

test(getSize(new Vec2i(2,5), new Vec2i(9,7)), 24, "getSize 1")
test(getSize(new Vec2i(7,1), new Vec2i(11,7)), 35, "getSize 2")

const points = data.map(i => new Vec2i(i.x, i.y))
const {sizeCache, zip, unzip} = buildCache(points);
const testVec1 = points[0];
const testVec2 = points[45];
test(unzip(zip(testVec1)), testVec1, "Zip and unzip");
test(unzip(zip(testVec2)), testVec2, "Zip and unzip 2");
test(sizeCache[0].size > sizeCache[1].size, true, "Size cache order")

const example = loadFile("example.txt").map(i => new Vec2i(i.x, i.y));
const exampleGrid = buildGrid(example);
exampleGrid.floodFill(new Vec2i(0, 0), "+")
test(isValid(exampleGrid, new Vec2i(7,3), new Vec2i(11, 1)), true, "Valid square")
test(isValid(exampleGrid, new Vec2i(2,3), new Vec2i(11, 1)), false, "Invalid square")

// Time and log results
console.time("Part 1");
const resultA = part1(data);
console.timeEnd("Part 1");
console.log("First answer:", resultA);

console.time("Part 2");
const resultB = part2(data);
console.timeEnd("Part 2");
console.log("Second answer:", resultB);
