const { readFileSync } = require("fs");
const getCallerFile = require("get-caller-file");

function read() {
    console.log(getCallerFile());
    const file = getCallerFile()
        .split("\\")
        .slice(0, -1)
        .concat("input.txt") 
        .join("\\");

    return readFileSync(file).toString();
}

function fromLines(rawInput) {
    return rawInput.split("\n");
}

function splitOnEmpty(inputArray) {
    const result = [[]];
    for(const line of inputArray) {
        if(line.length) result[result.length-1].push(line);
        else result.push([]);
    }
    return result;
}

function toInt(radix = 10) {
    return (toParse) => parseInt(toParse, radix);
}

function sum(array) {
    return array.reduce((acc, curr) => acc + curr, 0);
}

module.exports = {
    read,
    fromLines,
    splitOnEmpty,
    toInt,
    sum
};