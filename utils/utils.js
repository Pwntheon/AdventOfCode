function sum(array) {
    return array.reduce((acc, curr) => acc + curr, 0);
}

module.exports = {
    sum
}