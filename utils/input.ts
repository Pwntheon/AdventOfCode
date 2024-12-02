import { readFileSync } from "fs";

const inputFile = "input.txt";

const year = process.env.YEAR;
if (!year) throw Error("env var YEAR not found.");

const day = process.env.DAY;
if (!day) throw Error("Specify day (e.g. npm start 1)");

const folder = ["."].concat(year).concat(day).join("\\");

export default function setLoadingStrategy<T>(loader: (input: string) => T) {
  const loadRaw = (data: string) => structuredClone(loader(data));
  const loadFile = (filename: string) => {
    const file = [folder].concat(filename).join("/");
    const contents = readFileSync(file).toString();
    return loadRaw(contents);
  };
  return { data: loadFile(inputFile), loadRaw, loadFile };
}