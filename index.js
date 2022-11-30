const { spawn } = require("child_process");
const { readdirSync, readFile, writeFile, existsSync } = require("fs");
const { get } = require("https");
const { cp } = require("shelljs");

let cookies = null;
if(existsSync("./cookies.json")) {
    cookies = require("./cookies.json").map(c => `${c.name}=${c.value}`).join(";");
} else {
    console.log("No cookie file - downloading input file disabled.")
    console.log("To enable, create a cookies.json file in root with your session cookie formatted like this:")
    console.log(`[{"name":"session","value":"yoursessioncookie"}]`);
}

console.log(cookies);

const year = process.env.YEAR;
const day = process.argv[2];
const reloadInput = process.argv[3] === "i"

if(!day) throw Error("Specify day (e.g. npm start 1)");

const days = readdirSync(`./${year}`);

if(!days.includes(day)) {
    console.log(`New day! Creating template for day ${day}.`);
    cp("-r", "template", `./${year}/${day}`);
}

const inputFile = ["."]
    .concat(year)
    .concat(day)
    .concat("input.txt")
    .join("\\");

readFile(inputFile, 'utf8', (err, data) => {
    if(data.length > 0 && !reloadInput) console.log("Inputfile populated. To redownload, specify i as the third argument (after day).");
    
    else {
        fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
            headers: {
                cookie: cookies
            }
        }).then((response) => response.text())
        .then((text) => {
            writeFile(inputFile, text, () => 0 );
        });
    }
})


spawn('nodemon.cmd', [`./${year}/${day}/index.js`], {
    stdio: 'inherit'
});