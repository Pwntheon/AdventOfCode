import { writeFileSync } from "fs";
import { test } from "./test";

function lines(i: string) {
  return i.split(/\r?\n/);
}

function map<T, O>(Fn: (i: T) => O) {
  return (a: T[]) => a.map(Fn);
}

function sum(i: number[]) {
  return i.reduce((acc, curr) => acc + curr, 0);
}

function mul(i: number[]) {
  return i.reduce((acc, curr) => acc * curr, 1);
}

function match(exp: RegExp) {
  return (i: string) => Array.from(i.matchAll(exp), (e) => e[0]);
}

function rotate<T extends any[][]>(i: T): T {
  let result = [] as unknown[][];
  i.forEach((col, y) =>
    col.forEach((e, x) => {
      result[x] ??= [];
      result[x][y] = e;
    })
  );
  return result as T;
}

function split(token?: string) {
  const splitter =
    typeof token === "string"
      ? (i: string) => i.trim().split(token)
      : (i: string) => i.trim().split(/\s+/);
  return (i: string[]) => {
    return i.map(splitter);
  };
}

export function flat<T>(input: T[][]): T[] {
  return input.flat();
}

/*
For some reason this doesn't work with pipe, it misreads the result type :\
Thus, we make it internal and export explicit versions.
*/
function _toInt(i: string[]): number[];
function _toInt(i: string): number;
function _toInt(i: string | string[]): number | number[] {
  if (Array.isArray(i)) return i.map((e) => _toInt(e));
  return parseInt(i, 10);
}

function toInt(i: string[]): number[] {
  return _toInt(i);
}

function toIntS(i: string): number {
  return _toInt(i);
}

function logToFile(data: string) {
  writeFileSync("log.txt", data);
}

function logProgress(data: string) {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(data);
}

// [button, button, button]
// 0
// 1
// 2
// 0 1
// 0 2
// 1 2
// 0 1 2

// For a given array length, return all groups of indices with length 1 up to array length
// e.g. for length 3, [[0], [1], [2], [0,1], [0,2], [1,2], [0,1,2]]
function getAllSubsets(length: number) {
  const allIndices = Array.from({ length }, (_, i) => i);
  return allIndices.reduce(
    (subsets, value): number[][] =>
      subsets.concat(subsets.map((set) => [value, ...set])),
    [[]]
  );
}

function *allSubsetsOf<T>(iterable: T[]) {
    const subsets = getAllSubsets(iterable.length).sort((a, b) => a.length - b.length);
    for(let i = 0; i < subsets.length; ++i) {
        yield subsets[i].map(index => iterable[index])
    }
}

if(process.env.TEST === "true") {
    test(JSON.stringify(getAllSubsets(3)), JSON.stringify([[], [0], [1], [1,0], [2], [2,0], [2,1], [2,1,0]]), "Get all subsets of indices from array length");
    const testSubsets: string[][] = [];
    for(const subset of allSubsetsOf(["a", "b", "c"])) testSubsets.push(subset);
    test(JSON.stringify(testSubsets),JSON.stringify([[], ["a"], ["b"], ["c"], ["b", "a"], ["c","a"], ["c","b"], ["c","b","a"]]), "Get all subsets of an array");
}

export {
  lines,
  map,
  sum,
  mul,
  split,
  rotate,
  match,
  logToFile,
  logProgress,
  getAllSubsets,
  allSubsetsOf,
  toInt, // plural
  toIntS, // singular
};
