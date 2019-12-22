const { spawn } = require("child_process");
const { readdirSync } = require("fs");
const { cp } = require("shelljs");

const year = process.env.YEAR;
const day = process.argv[2];
const days = readdirSync(`./${year}`);

if(!days.includes(day)) {
    console.log(`New day! Creating template for day ${day}.`);
    cp("-r", "template", `./${year}/${day}`);
}

spawn('nodemon.cmd', [`./${year}/${day}/index.js`], {
    stdio: 'inherit'
});