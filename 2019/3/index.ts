import { h, test, InputParser } from "#root/utils/index.ts";
import {
  InputParserString,
  InputParserNumber,
  InputParserNumbers,
  InputParserStrings,
  InputParserStringsArray
} from "#root/utils/input";
console.clear();

// A wire visited a node
type visit = {
  next: link | null,
  prev: link | null,
  color: string
};

// "pointer" to another visit - should probably just use references :')
type link = { pos: string, i: number };

// If we notice another wire at a position, we save it as a collision
type collision = {
  x: number,
  y: number,
  visits: Record<string, visit[]>
}

type direction = [0, -1] | [0, 1] | [-1, 0] | [1, 0];
const directions: Record<string, direction> = {
  D: [0, -1],
  U: [0, 1],
  L: [-1, 0],
  R: [1, 0]
};

const colors = ["blue", "red"];

const input = InputParser.load().splitOnNewline().split();

let grid: Record<string, Record<string, visit[]>>;

// Let all the wires traverse the grid.
function traverse(moves: string[][]): collision[] {

  // Initialization
  grid = {};
  grid["0,0"] = {};
  const collisions: collision[] = [];

  // Move a wire one step
  function processMove(color: string, x: number, y: number, dir: direction) {

    // Previous and current positions
    const prev = `${x},${y}`;
    x += dir[0];
    y += dir[1];
    const curr = `${x},${y}`;

    // If position is new, initialize structure
    grid[curr] = grid[curr] ?? {};
    grid[curr][color] = grid[curr][color] ?? [];

    let previousNode = grid[prev][color];
    
    // Since a wire can visit a node many times, we need the index
    // that corresponds to our previous wire segment. It's always the last index.
    let prevNodeLink = { pos: prev, i: previousNode.length - 1 };

    let currentNode = { prev: prevNodeLink, next: null, color: color }
    
    // Set next of the previous node to our current one.
    previousNode[previousNode.length - 1].next = { pos: curr, i: grid[curr][color].length };

    // Put our visit into the grid
    grid[curr][color].push(currentNode);

    // Return updated position, as well as the current node.
    return { x, y, node: grid[curr] };
  }

  // for each line in the input
  for (let i = 0; i < moves.length; ++i) {
    // Select a unique color for our wire
    const color = colors[i];

    // Start at origin
    let x = 0;
    let y = 0;

    // Push initial position
    grid[`${x},${y}`][color] = [{ prev: null, next: null, color }];

    // For each moveset (direction and # of moves)
    for (const move of moves[i]) {

      // Parse moveset
      const direction = move.slice(0, 1);
      let num = parseInt(move.slice(1), 10);

      // Move the whole moveset
      while (num-- > 0) {
        const newPos = processMove(color, x, y, directions[direction]);
        x = newPos.x;
        y = newPos.y;

        // If we have more than one color at this position, we have a collision
        const isCollision = Object.keys(newPos.node).length > 1;
        if (isCollision) {
          collisions.push({
            x, y, visits: newPos.node
          });
        }
      }
    }
  }
  return collisions;
}

function shortestManhattanDistance(collisions: collision[]) {
  let result = Number.MAX_SAFE_INTEGER;
  for (const collision of collisions) {
    const distance = Math.abs(collision.x) + Math.abs(collision.y);
    result = Math.min(result, distance);
  }
  return result;
}

function shortestSignalDistance(collisions: collision[], grid: Record<string, Record<string, visit[]>>) {
  let minDistance = Number.MAX_SAFE_INTEGER;
  for(const collision of collisions) {
    let distance = 0;
    // Take the first visit of each wire, as that's always the one with the
    // shortest path home to the origin.
    for(const wire of [collision.visits["red"][0], collision.visits["blue"][0]]) {
      let current = wire;

      // Walk backwards and count the steps
      while(current.prev !== null) {
        ++distance;
        current = grid[current.prev.pos][current.color][current.prev.i];
      }
    }
    // Record the shortest total distance so far.
    minDistance = Math.min(minDistance, distance);
  }
  return minDistance;
}

/* Tests */
// Base test - check that input is not empty
test(InputParser.load().finish().length > 0, true, "has input");

// From problem description
const test1Input = (InputParser.fromLiteral(`R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`) as InputParserString).splitOnNewline().split();
const test1Collisions = traverse(test1Input.finish());
test(shortestManhattanDistance(test1Collisions), 159);

// From problem description
const test2Input = (InputParser.fromLiteral(`R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`) as InputParserString).splitOnNewline().split();
const test2Collisions = traverse(test2Input.finish());
test(shortestManhattanDistance(test2Collisions), 135);


/* Results */
console.time("Traverse");
const collisions = traverse(input.finish());
console.timeEnd("Traverse");


const solveA = (collisions: collision[]) => {
  return shortestManhattanDistance(collisions);
};

const solveB = (grid: Record<string, Record<string, visit[]>>) => {
  return shortestSignalDistance(collisions, grid);
};

console.time("Part 1");
const resultA = solveA(collisions);
console.timeEnd("Part 1");
console.log("Solution to part 1:", resultA);
console.time("Part 2");
const resultB = solveB(grid!);
console.timeEnd("Part 2");
console.log("Solution to part 2:", resultB);
