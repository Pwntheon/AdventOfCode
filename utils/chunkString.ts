export function chunkString(input: string, chunkSize: number) {
    return input.match(new RegExp('.{1,' + chunkSize + '}', 'g'));
}