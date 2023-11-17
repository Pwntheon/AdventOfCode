export function sum(array: number[]) {
    return array.reduce((acc, curr) => acc + curr, 0);
}