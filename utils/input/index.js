const { readFileSync } = require("fs");
const getCallerFile = require("get-caller-file");

class InputParser {
    constructor(input) {
        this.folder = getCallerFile()
            .split("\\")
            .slice(0, -1)
            .join("\\");
        this.data = input || readFileFromFolder(this.folder);
    }

    static fromFile(filename) {
        return new InputParser(readFileFromFolder(filename));
    }

    finish() {
        return this.data;
    }

    do(fn) {
        this.data = fn(this.data);
        return this;
    }

    forEach(fn) {
        this.data = this.data.map(d => fn(d));
        return this;
    }

    splitOnNewline() {
        this.data = this.data.split(/\r?\n/);
        return this;
    }

    toInt(radix = 10) {
        this.data = deepConvert(this.data, d => parseInt(d, radix));
        return this;
    }

    splitOnEmpty() {
        const result = [[]];
        for (const line of this.data) {
            if (line.length) result[result.length - 1].push(line);
            else result.push([]);
        }
        this.data = result;
        return this;
    }
}

function readFileFromFolder(folder, filename = "input.txt") {
    const file = [folder]
        .concat(filename)
        .join("\\");

    return readFileSync(file).toString();
}

function deepConvert(data, fn) {
    if (!Array.isArray(data)) return fn(data);
    else return data.map(d => deepConvert(d, fn));
}

/*******************************
        Old methods
*******************************/

module.exports = InputParser;