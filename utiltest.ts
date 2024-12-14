import { spawn } from "child_process";

const file = process.argv[2];
if (!file) throw Error("Provide library to test");

spawn("tsx.cmd", ["watch", `./utils/${file}.ts`, ], {
    stdio: "inherit",
    shell: true,
    env: {TEST: "true"}
  });