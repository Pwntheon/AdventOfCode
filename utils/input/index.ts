import { readFileSync } from "fs";
import getCallerFile from "get-caller-file";

type DataType = string | string[] | string[][] | number | number[];

// Seems weirdly repetitive

export interface InputParserString {
  finish: () => string;
  do: (fn: (data: string) => string) => InputParserString;
  splitOnNewline: () => InputParserStrings;
  toInt: (radix?: number) => InputParserNumber;
  clone: () => InputParserString;
}

export interface InputParserStrings {
  finish: () => string[];
  do: (fn: (data: string[]) => string[]) => InputParserStrings;
  forEach: (fn: (data: string) => string) => InputParserStrings;
  toInt: (radix?: number) => InputParserNumbers;
  splitOnEmpty: () => InputParserStringsArray;
  clone: () => InputParserStrings;
}

export interface InputParserStringsArray {
  finish: () => string[][];
  do: (fn: (data: string[][]) => string[][]) => InputParserStringsArray;
  forEach: (fn: (data: string[]) => string[]) => InputParserStringsArray;
  clone: () => InputParserStringsArray;
}

export interface InputParserNumber {
  finish: () => number;
  do: (fn: (data: number) => number) => InputParserNumber;
  clone: () => InputParserNumber;
}

export interface InputParserNumbers {
  finish: () => number[];
  do: (fn: (data: number[]) => number[]) => InputParserNumbers;
  forEach: (fn: (data: number) => number) => InputParserNumbers;
  sum: () => InputParserNumber;
  clone: () => InputParserNumbers;
}


export default class InputParser<T extends DataType> {
  data: DataType;

  // Have to make private to control return type
  private constructor(input: T) {
    this.data = input;
  }

  static load(filename?: string) {
    const folder = (getCallerFile() as string)
      .split("/")
      .slice(-3, -1)
      .join("/");
    return new InputParser(readFileFromFolder(folder, filename)) as InputParserString;
  }

  static fromLiteral(data: DataType) {
    return new InputParser(data);
  }

  finish() {
    return this.data;
  }

  do(fn) {
    return new InputParser(fn(this.data));
  }

  sum() {
    const data = (this.data as number[])
      .reduce((acc, curr) => acc + curr, 0);
    return new InputParser(data);
  }

  forEach(fn) {
    const data = (this.data as any[]).map(d => fn(d));
    return new InputParser(data);
  }

  splitOnNewline() {
    const data = (this.data as string).split(/\r?\n/);
    return new InputParser(data);
  }

  toInt(radix = 10) {
    const data = deepConvert(this.data, d => parseInt(d, radix));
    return new InputParser(data);
  }

  // Suddenly we have to support two dimensional arrays :(
  splitOnEmpty() {
    const data: string[][] = [[]];
    for (const line of this.data as string[]) {
      if (line.length) data[data.length - 1].push(line);
      else data.push([]);
    }
    return new InputParser(data);
  }

  clone() {
    return new InputParser(structuredClone(this.data));
  }
}

function readFileFromFolder(folder, filename = "input.txt") {
  const file = [folder]
    .concat(filename)
    .join("/");

  return readFileSync(file).toString();
}

function deepConvert(data, fn) {
  if (!Array.isArray(data)) return fn(data);
  else return data.map(d => deepConvert(d, fn));
}