import { test, load, pipe } from "@utils";
import Grid from "utils/grid";
import Vec2i, { Unit } from "utils/vec2";

// Create pipe. Add input parsing steps with .then()
const parseInput = pipe<string>();

const FLOOR = ".";
const START = "S";
const SPLITTER = "^";

function move(board: Grid, beam: Vec2i) {
  const south = board.getRelativePos(beam, Unit.S);
  if(!south) return [null];
  if(board.at(south) === SPLITTER ) {
    // We have not considered what happens if a splitter makes a beam oob
    return [board.getRelativePos(south, Unit.W), board.getRelativePos(south, Unit.E)]
  }
  return [south];
}

function moveToEnd(board: Grid, start: Vec2i) {
  const result: Vec2i[] = [];
  const beams = [start];
  let splits = 0;
  while(beams.length) {
    const current = beams.shift();
    if(!current) throw "null/undefined beam?";

    const afterMove = move(board, current);
    if(afterMove.length > 1) {
      ++splits;
    }

    afterMove.forEach(v => {
      if(v === null) {
        // Out of bounds, we reached the bottom. 
        // NOTE: splitter at edge of grid will make this bug out
        result.push(current);
      } else {
        // In bounds, take result of move and add back for processing
        // Unless beam exists already at this position
        if(!beams.some(b => b.toString() === v.toString())) beams.push(v);
      }
      
    });
  }
  return {splits, beams: result};
}

type MergedBeam = {
  pos: Vec2i,
  count: number
};

function moveToEndQuantum(board: Grid, start: Vec2i) {
  const result: MergedBeam[] = [];
  const beams: MergedBeam[] = [{pos: start, count: 1}];
  let timelines = 1;
  while(beams.length) {
    
    const current = beams.shift();
    if(!current) throw "null/undefined beam?";
    // console.log(`${current.count}: ${current.pos}`)
    const afterMove = move(board, current.pos);
    if(afterMove.length === 2) {
      // console.log(`Split after ${current.pos} for ${current.count} beams`);
      timelines += current.count;
    }

    afterMove.forEach(v => {
      if(v === null) {
        // Out of bounds, we reached the bottom. 
        // NOTE: splitter at edge of grid will make this bug out
        result.push(current);
      } else {
        // In bounds, take result of move and add back for processing
        const existing = beams.find(e => e.pos.equals(v));
        

        if(existing) {
          existing.count += current.count;
        }
        else beams.push({pos: v, count: current.count});
      }
      
    });
  }
  return timelines;
}

// Load data, and expose testing functions.
// data is loaded from ./input.txt
// loadRaw uses an inline string to load data, useful for short examples
// loadFile loads content of ./{filename} useful for more elaborate examples
const {data, loadRaw, loadFile} = load(parseInput);

const part1 = (input: typeof data) => {
  const board = new Grid(input);
  const start = board.find(START);
  if(!start) throw "No starting position found!";

  return moveToEnd(board, start).splits;
};

const part2 = (input: typeof data) => {
  const board = new Grid(input);
  const start = board.find(START);
  if(!start) throw "No starting position found!";

  return moveToEndQuantum(board, start);
};

// Base test - check that input is not empty
test(load(d => d).data.length > 0, true, "Has input");

const exampleGrid = new Grid(loadFile("example.txt"));
const beam = exampleGrid.find(START)!;
const afterOneMove = move(exampleGrid, beam);
test(afterOneMove.map(v => v!.toString()), ["[7,1]"], "Example after one move");
test(move(exampleGrid, afterOneMove[0]!).map(v => v!.toString()), ["[6,2]", "[8,2]"], "Example after split")
test(moveToEnd(exampleGrid, beam).splits, 21, "Number of beams match example text" );
test(moveToEndQuantum(exampleGrid, beam), 40, "Number of timelines in example text");

// Time and log results
console.time("Part 1");
const resultA = part1(data);
console.timeEnd("Part 1");
console.log("First answer:", resultA);

console.time("Part 2");
const resultB = part2(data);
console.timeEnd("Part 2");
console.log("Second answer:", resultB);
