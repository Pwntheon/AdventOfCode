import { test, load, pipe } from "@utils";
import Grid from "utils/grid";

// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>();

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const {data, loadRaw, loadFile} = load(parseInput);

function search(reader: Generator, word: string) {
  for(let i = 0; i < word.length; ++i) {
    const val = reader.next();
    if(val.done || typeof val.value !== "string") return false;
    if(val.value !== word.charAt(i)) return false;
  }
  return true;
}

const part1 = (input: typeof data) => {
  const grid = new Grid(input, {diagonal: true});
  const word = "XMAS";
  let count = 0;
  for(const node of grid.nodes()) {
    if(node.data() !== "X") continue; // Optimization, skip searching if we're not starting with X
    for(const edge of node.edges()) {
      const reader = grid.getReader(node.pos(), edge.pos());
      if(search(reader, word)) ++count;
    }
  }

  return count;
};

const part2 = (input: typeof data) => {
  const grid = new Grid(input, {diagonal: true});
  let count = 0;
  for(const node of grid.nodes()) {
    if(node.data() !== "A") continue; // No A in the middle
    const edges = Array.from(node.edges());
    if(edges.length < 8) continue; // Edge of grid
    const NW = edges[0].data();
    const NE = edges[2].data();
    const SW = edges[5].data();
    const SE = edges[7].data();
    if(NW + SE !== "MS" && NW + SE !== "SM") continue; // Missing \
    if(NE + SW !== "MS" && NE + SW !== "SM") continue; // Missing /
    ++count; // X-MAS :)
  }
  return count;
};

// Base test - check that input is not empty
test(load(d => d).data.length > 0, true, "Has input");

let testGrid =`aaba
aaaa
abaa
aaaa`;
const grid = new Grid(testGrid, {diagonal: true});

test(Array.from(grid.nodes(), n => n.data).length, 16, "nodes()"); 
test(Array.from(grid.node(1,1).edges(), n => n.data()).join(""), "aabaaaba")
test(Array.from(grid.node(0,0).edges(), n => n.data()).join(""), "aaa")

grid.diagonal = false;
test(Array.from(grid.node(0,0).edges(), n => n.data()).join(""), "aa")
test(Array.from(grid.node(1,1).edges(), n => n.data()).join(""), "aaab")

grid.wrap = true;
test(Array.from(grid.node(0,0).edges(), n => n.data()).join(""), "aaaa");

grid.diagonal = true;
test(Array.from(grid.node(1,3).edges(), n => n.data()).join(""), "abaaaaab");

grid.wrap = false;
const reader = grid.getReader(grid.node(1, 3).pos(), grid.node(1, 2).pos());
test(Array.from(reader).join(""), "abaa");
const reader2 = grid.getReader(grid.node(1, 3).pos(), grid.node(1, 2).pos());
test(search(reader2, "abaa"), true);

// Time and log results
console.time("Part 1");
const resultA = part1(data);
console.timeEnd("Part 1");
console.log("First answer:", resultA);

console.time("Part 2");
const resultB = part2(data);
console.timeEnd("Part 2");
console.log("Second answer:", resultB);
