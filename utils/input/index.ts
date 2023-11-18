import { readFileSync } from "fs";
import getCallerFile from "get-caller-file";

type DataType = string | string[] | string[][] | number | number[];

// Seems weirdly repetitive
export interface InputParserStringsArray {
  finish: () => string[][];
  do: (fn: (data: string[][]) => string[][]) => InputParserStringsArray;
  forEach: (fn: (data: string[]) => string[]) => InputParserStringsArray;
  filter: (fn: (data: string[]) => boolean) => InputParserStringsArray;
  length: () => number;
}

export interface InputParserString {
  finish: () => string;
  do: (fn: (data: string) => string) => InputParserString;
  splitOnNewline: () => InputParserStrings;
  toInt: (radix?: number) => InputParserNumber;
  toArray: (separator?: string) => InputParserStrings
}

export interface InputParserStrings {
  finish: () => string[];
  do: (fn: (data: string[]) => string[]) => InputParserStrings;
  forEach: (fn: (data: string) => string) => InputParserStrings;
  filter: (fn: (data: string) => boolean) => InputParserStrings;
  toInt: (radix?: number) => InputParserNumbers;
  splitOnEmpty: () => InputParserStringsArray;
  length: () => number;
}

export interface InputParserNumber {
  finish: () => number;
  do: (fn: (data: number) => number) => InputParserNumber;
}

export interface InputParserNumbers {
  finish: () => number[];
  do: (fn: (data: number[]) => number[]) => InputParserNumbers;
  forEach: (fn: (data: number) => number) => InputParserNumbers;
  filter: (fn: (data: number) => boolean) => InputParserNumbers;
  sum: () => InputParserNumber;
  length: () => number;
}

export default class InputParser<T extends DataType> {
  data: DataType;
  debug: boolean;

  // Have to make private to control return type
  private constructor(input: T, debug = false) {
    this.debug = debug;
    this.data = input;
  }

  static load(filename?: string, debug = true) {
    const folder = (getCallerFile() as string)
      .split("/")
      .slice(-3, -1)
      .join("/");
    return new InputParser(readFileFromFolder(folder, filename), debug) as InputParserString;
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

  length() {
    return (this.data as []).length;
  }

  sum() {
    const data = (this.data as number[])
      .reduce((acc, curr) => acc + curr, 0);
    if (this.debug) console.log(this.data);
    return new InputParser(data);
  }

  filter(fn) {
    const data = (this.data as [])
      .filter(fn);
    if (this.debug) console.log(this.data);
    return new InputParser(data);
  }

  forEach(fn) {
    const data = (this.data as any[]).map(d => fn(d));
    if (this.debug) console.log(this.data);
    return new InputParser(data);
  }

  splitOnNewline() {
    const data = (this.data as string).split(/\r?\n/);
    if (this.debug) console.log(this.data);
    return new InputParser(data);
  }

  toInt(radix = 10) {
    const data = deepConvert(this.data, d => parseInt(d, radix));
    if (this.debug) console.log(this.data);
    return new InputParser(data);
  }

  toArray(separator = ",") {
    const data = (this.data as string).split(separator);
    if (this.debug) console.log(this.data);
    return new InputParser(data);
  }

  splitOnEmpty() {
    const data: string[][] = [[]];
    for (const line of this.data as string[]) {
      if (line.length) data[data.length - 1].push(line);
      else data.push([]);
    }
    if (this.debug) console.log(this.data);
    return new InputParser(data);
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