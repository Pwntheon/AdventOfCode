import { spawn, exec } from "child_process";
import { readdirSync, writeFile, existsSync, mkdirSync } from "fs";
import { readFile } from "fs/promises";
import shelljs from "shelljs";
import open from "open";

const { cp } = shelljs;

if (!existsSync("./cookies.json")) {
  console.log("No cookie file - downloading input file disabled.")
  console.log("To enable, create a cookies.json file in root with your session cookie formatted like this:")
  console.log(`[{"name":"session","value":"yoursessioncookie"}]`);
  process.exit();
}

const year = process.env.YEAR;
if (!year) throw Error("env var YEAR not found.");

const day = process.argv[2];
if (!day) throw Error("Specify day (e.g. npm start 1)");

const reloadInput = process.argv[3] === "r"

let init = process.argv[3] === "i";

if (!existsSync(`./${year}`)) {
  mkdirSync(`./${year}`);
}
const days = readdirSync(`./${year}`);

if (!days.includes(day)) {
  console.log(`New day! Creating template for day ${day}.`);
  cp("-r", "template", `./${year}/${day}`);
  init = true;
}

const inputFile = ["."]
  .concat(year)
  .concat(day)
  .concat("input.txt")
  .join("\\");



readFile(inputFile, "utf8")
  .then(inputData => {
    if (inputData.length > 0 && !reloadInput) {
      console.log("Inputfile populated. To redownload, specify r as the third argument (after day).");
    } else {
      readFile("./cookies.json", "utf8").then(cookieFile => {
        const cookies = JSON.parse(cookieFile).map(c => `${c.name}=${c.value}`).join(";");
        fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
          headers: {
            cookie: cookies
          }
        }).then((response) => response.text())
          .then((text) => {
            // Remove trailing newline(s) to simplify input parsing
            while (text.charCodeAt(text.length - 1) === 10) text = text.slice(0, -1);
            writeFile(inputFile, text, () => 0);
          });
      });
    }
  });

if (!init) {
  console.log("Not reinitializing. To reinitialize, use i as the third argument (after day).")
} else {
  exec(`code ./${year}/${day}/index.ts`);
  open(`https://adventofcode.com/${year}/day/${day}`);
}

spawn('nodemon.cmd', ["--exec", "node", "--loader", "ts-node/esm", `./${year}/${day}/index.ts`], {
  stdio: 'inherit'
});

