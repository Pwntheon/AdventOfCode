type handler = () => boolean;

export default class Computer {
  memory!: number[];
  _pointer!: number;
  debug!: boolean;
  cycle!: number;
  oDebug!: string;

  constructor(program: number[] = []) {
    this.load(program);
  }

  setDebug(debug: boolean) {
    this.debug = debug;
  }

  load(program: number[]) {
    this.memory = program;
    this._pointer = 0;
    this.debug = false;
    this.cycle = 0;
    this.oDebug = "";
  }

  run() {
    while(!this.tick()){}
  }

  tick() {
    ++this.cycle;
    this.oDebug += this.cycle.toString().padStart(5, "0") + ": ";
    const done = this.handlers[this.next]();
    if(this.debug) console.log(this.oDebug);
    this.oDebug = "";
    return done;
  }

  write(pos: number, val) {
    if(pos < 0 || pos > this.memory.length -1 ) throw Error("Write pointer out of bounds: " + pos);
    this.memory[pos] = val;
  }

  read(pos: number)  {
    if(pos < 0 || pos > this.memory.length -1 ) throw Error("Write pointer out of bounds: " + pos);
    return this.memory[pos];
  }

  get pointer() {
    if (this._pointer < 0 || this._pointer > this.memory.length - 1) throw Error("Pointer out of bounds: " + this._pointer);
    return this.memory[this._pointer];
  }

  get next() {
    const result = this.pointer;
    ++this._pointer;
    return result;
  }

  private handlers: Record<number, handler> = {
    [1]: () => {
      const apos = this.next;
      const bpos = this.next;
      const a = this.read(apos);
      const b = this.read(bpos);
      const c = this.next;
      this.oDebug += `Storing [${apos}]:${a} + [${bpos}]:${b} = ${a+b} in [${c}]`;
      this.write(c, a+b);
      return false;
    },
    [2]: () => {
      const apos = this.next;
      const bpos = this.next;
      const a = this.read(apos);
      const b = this.read(bpos);
      const c = this.next;
      this.oDebug += `Storing [${apos}]:${a} * [${bpos}]:${b} = ${a+b} in [${c}]`;
      this.write(c, a * b);
      return false;
    },
    [99]: () => {
      this.oDebug += `Read exit instruction at [${this._pointer}].`;
      return true;
    }
  }
}