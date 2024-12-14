import { test, load, pipe } from "@utils";
import Grid from "utils/grid";
import Vec2i from "utils/vec2";

const EMPTY = ".";

// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>()

function getAntennaeNames(grid: Grid) {
  return [...new Set(grid.data)].filter(a => a !== EMPTY);
}

function getAntinodes(grid: Grid, antennaeName: string) {
  const positions = Array.from(grid.findAll(antennaeName));
  const result: Vec2i[] = [];
  for(let i = 0; i < positions.length; ++i) {
    const origin = positions[i];
    positions.forEach(p => {
      if(origin.equals(p)) return;
      const delta = p.sub(origin).rot(180);
      const antinode = grid.getRelativePos(origin, delta);
      if(antinode) result.push(antinode);
    })
  }
  return result;
}

function getHarmonicAntinodes(grid: Grid, antennaeName: string) {
  const positions = Array.from(grid.findAll(antennaeName));
  const result: Vec2i[] = [];
  for(let i = 0; i < positions.length; ++i) {
    const origin = positions[i];
    positions.forEach(p => {
      if(origin.equals(p)) return;
      const delta = p.sub(origin).rot(180);
      let antinode: Vec2i | null = origin;
      while(antinode) {
        result.push(antinode);
        antinode = grid.getRelativePos(antinode, delta);
      }
    })
  }
  return result;
}

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const {data, loadRaw, loadFile} = load(parseInput);

const part1 = (input: typeof data) => {
  const grid = new Grid(input);
  const antennae = [...new Set(grid.data)].filter(a => a !== EMPTY);
  const antinodes = antennae.flatMap(a => getAntinodes(grid, a));
  return (new Set(antinodes.map(n => n.toString()))).size
};

const part2 = (input: typeof data) => {
  const grid = new Grid(input);
  const antennae = [...new Set(grid.data)].filter(a => a !== EMPTY);
  const antinodes = antennae.flatMap(a => getHarmonicAntinodes(grid, a));
  return (new Set(antinodes.map(n => n.toString()))).size
};

// Base test - check that input is not empty
test(load(d => d).data.length > 0, true, "Has input");

const testGrid = new Grid(loadFile("example.txt"));
test(getAntennaeNames(testGrid), ["0", "A"], "Get antennae names");

const harmonicAntinodes = getAntennaeNames(testGrid).flatMap(n => getHarmonicAntinodes(testGrid, n));
const count = new Set(harmonicAntinodes.map(n => n.toString())).size
test(count, 34, "Count antinodes");

// Time and log results
console.time("Part 1");
const resultA = part1(data);
console.timeEnd("Part 1");
console.log("First answer:", resultA);

console.time("Part 2");
const resultB = part2(data);
console.timeEnd("Part 2");
console.log("Second answer:", resultB);
