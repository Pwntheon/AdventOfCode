class IntCode {
    constructor () {
        this.code = [];
        this.mem = [];
        this.input = [];
        this.output = [];
        this.ptr = 0;
        this.fun = {
            1: (ptr, modes) => {
                let val = this.read(ptr++) + this.read(ptr++);
                this.write(this.read(ptr++, 1), val);
                return ptr;
            },
            2: (ptr, modes) => {
                let val = this.read(ptr++) * this.read(ptr++);
                this.write(this.read(ptr++, 1), val);
                return ptr;
            },
            99: () => {
                //console.log("Clean exit");
                return Number.MAX_SAFE_INTEGER;
            }
        };
    }

    parseCommand = () => {
        return {
            fun: this.read(this.ptr++, 1),
            modes: []
        };
    }

    read(index, mode = 0) {
        let value = (mode ? Number.parseInt(this.mem[index], 10) : Number.parseInt(this.mem[this.mem[index]], 10));
        //console.log(`Reading from ${(mode ? "position" : "value at position")} ${index}: ${value}`);
        return value;
    }

    write(index, value) {
        //console.log(`Writing ${value} to position ${index}`);
        this.mem[index] = value;
    }

    loadProgram(code) {
        if(Array.isArray(code)) this.code = code;
        else this.code = code.split(',').map(e => e.trim());
    }

    run (input) {
        this.mem = [...this.code];
        this.input = input || [];
        this.output = [];
        this.ptr = 0;
        while(this.ptr >= 0 && this.ptr < this.mem.length) {
            let {fun, modes} = this.parseCommand();
            this.ptr = this.fun[fun](this.ptr, modes);
        }
        return {
            output: this.output,
            firstLine: this.mem[0]
        };
    }
}

const tests = {
    run: (testFn) => {
        const c = new IntCode();
        c.loadProgram("1,9,10,3,2,3,11,0,99,30,40,50");
        testFn(c.run().firstLine, 3500);
        testFn(c.run().firstLine, 3500);
        c.loadProgram("1,0,0,0,99");
        testFn(c.run().firstLine, 2);
        c.loadProgram("1,1,1,4,99,5,6,0,99");
        testFn(c.run().firstLine, 30);
    }
}

module.exports = {
    Computer: IntCode,
    Tests: tests
};