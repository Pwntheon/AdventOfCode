import { spawn } from "child_process";

const file = process.argv[2];
if (!file) throw Error("Provide library to test");

const filename =  `./utils/${file}.ts`
console.log("Running tests for " + filename);

spawn("tsx.cmd", ["watch", filename ], {
    stdio: "inherit",
    shell: true,
    env: {TEST: "true"}
  });