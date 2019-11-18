const stopNumber = 2147483647;

export interface CanvasSnapshot extends CanvasFillStrokeStyles, CanvasRect, CanvasDrawPath, CanvasText, CanvasTextDrawingStyles, CanvasPath {}

export class CanvasSnapshot {
  private snapshot: (string | number)[] = [stopNumber];

  private writeIndex = 0;
  private stopIndex = 0;

  private fields = Object.create(null);

  private doMethod(method: string, args: (string | number)[]): void {
    this.snapshot[this.writeIndex++] = method;
    this.snapshot[this.writeIndex++] = args.length;

    for (let i = 0; i < args.length; i++) {
      this.snapshot[this.writeIndex++] = args[i];
    }
  }

  private doSetter(prop: string, value: (string | number)): void {
    this.snapshot[this.writeIndex++] = "setter";
    this.snapshot[this.writeIndex++] = prop;
    this.snapshot[this.writeIndex++] = value;
  }

  public begin() {
    this.stopIndex = 0;
    this.writeIndex = 0;   
  }

  public end() {
    this.stopIndex = this.writeIndex;
  }

  public render(ctx: CanvasRenderingContext2D) {
    const l = this.snapshot.length
    let i = 0;
    let method: string;
    let argsCount: number;

    while (i < l) {
      if (i === this.stopIndex) {
        break;
      }

      method = this.snapshot[i] as string;
      
      if (method === "setter") {
        ctx[this.snapshot[i + 1]] = this.snapshot[i + 2];
        i += 3;
      } else {
        argsCount = this.snapshot[i + 1] as number;
        ctx[method].apply(ctx, this.snapshot.slice(i + 2, i + 2 + argsCount));
        i += 2 + argsCount;
      }
    }
  }
}

[
  "clearRect", 
  "fillRect", 
  "strokeRect", 
  "beginPath", 
  "arc", 
  "arcTo", 
  "bezierCurveTo", 
  "closePath", 
  "ellipse", 
  "lineTo", 
  "moveTo", 
  "quadraticCurveTo", 
  "rect", 
  "createLinearGradient", 
  "createPattern", 
  "createRadialGradient", 
].forEach((method) => {
  CanvasSnapshot.prototype[method] = function(...args: unknown[]) {
    this.doMethod(method, args);
  }
});

[
  "direction",
  "font",
  "textAlign",
  "textBaseline",
  "fillStyle",
  "strokeStyle",
].forEach((prop) => {
  Object.defineProperty(CanvasSnapshot.prototype, prop, {
    set(value) {
      this.doSetter(prop, value);
      this.fields[prop] = value;
    },
    get() {
      return this.fields[prop];
    }
  });
})
/*
const mapCommandToCode = new Map<string, number>();
const mapCodeToCommand = new Map<number, string>();
let index = 0;
const getCodeByCommand = (command: string): number => {
  if (!mapCommandToCode.has(command)) {
    mapCommandToCode.set(command, index++);
    mapCodeToCommand.set(index, command);
  }

  return index;
};
const getCommandByCode = (code: number) => {
  return mapCodeToCommand.get(code);
};*/