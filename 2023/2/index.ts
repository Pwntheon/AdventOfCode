import { h, test, InputParser } from "#root/utils/index.ts";
import {
  InputParserString,
  InputParserNumber,
  InputParserNumbers,
  InputParserStrings,
  InputParserStringsArray
} from "#root/utils/input";
console.clear();

type reveal = {
  red: number;
  green: number;
  blue: number;
}

class game {
  id: number;
  reveals: reveal[];
  constructor(line: string) {
    const [game, details] = line.split(":");
    this.id = parseInt(game.match(/\d+/)![0], 10);
    const reveals = details.split(";");
    this.reveals = [];
    for(const reveal of reveals) {
      this.reveals.push({
        red: parseInt(reveal.match(/(\d+) red/)?.[1] ?? "0"),
        blue: parseInt(reveal.match(/(\d+) blue/)?.[1] ?? "0"),
        green: parseInt(reveal.match(/(\d+) green/)?.[1] ?? "0"),
      })
    }
  }

  min() {
    return this.reveals.reduce((acc, curr) => ({
      red: Math.max(acc.red, curr.red),
      blue: Math.max(acc.blue, curr.blue),
      green: Math.max(acc.green, curr.green)
    }), {red: 0, blue: 0, green: 0});
  }
}

const input = InputParser.load().splitOnNewline().finish().map(line => new game(line));

const solveA = (data: game[]) => {
  const limit = {red: 12, green: 13, blue: 14};
  let result = data.filter(e => 
    e.min().blue <= limit.blue &&
    e.min().green <= limit.green &&
    e.min().red <= limit.red);
  return result.reduce((acc, curr) => curr.id + acc, 0);
};

const solveB = (data: game[]) => {
  const powers = data.map(game => game.min().blue * game.min().red * game.min().green);
  return powers.reduce((acc, curr) => acc + curr, 0);
};

/* Tests */
// Base test - check that input is not empty
test(InputParser.load().finish().length > 0, true, "has input");

/* Results */

console.time("Part 1");
const resultA = solveA(input);
console.timeEnd("Part 1");
console.log("Solution to part 1:", resultA);
console.time("Part 2");
const resultB = solveB(input);
console.timeEnd("Part 2");
console.log("Solution to part 2:", resultB);