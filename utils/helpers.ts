function lines(i: string) {
    return i.split(/\r?\n/)
}

function map<T, O>(Fn: (i: T) => O) {
    return (a: T[]) => a.map(Fn)
}

function sum(i: number[]) {
    return i.reduce((acc,curr) => acc+curr, 0);
}

function rotate<T extends any[][]>(i: T): T {
    let result = [] as unknown[][];
    i.forEach((col, y) => col.forEach((e, x) => {
        result[x] ??= [];
        result[x][y] = e;
    }))
    return result as T;
}

function split(token: string | null) {
    const splitter = typeof token === "string" 
        ? (i: string) => i.trim().split(token)
        : (i: string) => i.trim().split(/\s+/);
    return (i: string[]) => {
        return i.map(splitter);
    }
}

/*
For some reason this doesn't work with pipe, it misreads the result type :\
Thus, we make it internal and export explicit versions.
*/
function _toInt(i: string[]): number[];
function _toInt(i: string): number;
function _toInt(i: string | string[]): number | number[] {
    if(Array.isArray(i)) return i.map(e => _toInt(e));
    return parseInt(i, 10);
}

function toInt(i: string[]): number [] {
    return _toInt(i);
}

function toIntS(i: string): number{
    return _toInt(i);
}


export {
    lines,
    map,
    sum,
    split,
    rotate,
    toInt, // plural
    toIntS // singular
};