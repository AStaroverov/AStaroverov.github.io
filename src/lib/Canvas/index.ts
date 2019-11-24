export interface CanvasSnapshot extends CanvasFillStrokeStyles, CanvasRect, CanvasDrawPath, CanvasText, CanvasTextDrawingStyles, CanvasPath {}

enum EAction {
  method,
  property,
}

const strings = ["fillRect", "clearRect", "fillStyle"];

export class CanvasSnapshot {
  private snapshot: Uint32Array = new Uint32Array(100);

  private writeIndex = 0;
  private argsIndex = 0;

  mapArgs = new Map<number, unknown | unknown[]>();
  mapProp = new Map<number, unknown>();

  private doMethod(method: string, args: (string | number)[]): void {
    this.snapshot[this.writeIndex++] = EAction.method;
    this.snapshot[this.writeIndex++] = strings.indexOf(method);
    this.snapshot[this.writeIndex++] = args.length;

    this.mapArgs.set(this.argsIndex++, args);
  }

  private doSetter(prop: string, value: (string | number)): void {
    this.snapshot[this.writeIndex++] = EAction.property;
    this.snapshot[this.writeIndex++] = strings.indexOf(prop);

    this.mapArgs.set(this.argsIndex++, value);
  }

  public begin() {
    this.writeIndex = 0;   
    this.argsIndex = 0;   
  }

  public end() {}

  public render(ctx: CanvasRenderingContext2D) {
    let i = 0;
    let j = 0;
    let actionIndex: number;
    let methodIndex: number;

    while (i !== this.writeIndex) {
      actionIndex = this.snapshot[i++];
      methodIndex = this.snapshot[i++];
      
      if (actionIndex === EAction.property) {
        ctx[strings[methodIndex]] = this.mapArgs.get(j++);
      } else {
        fastCall(ctx, strings[methodIndex], this.snapshot[i++], this.mapArgs.get(j++) as unknown[]);
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
  CanvasSnapshot.prototype[method] = function() {
    this.doMethod(method, arguments);
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
      this.mapProp.set(prop, value);
    },
    get() {
      return this.mapProp.get(prop);
    }
  });
})

function fastCall (ctx, method: string, length: number, arr: unknown[]) {
  switch (length) {
    case 0: return ctx[method]();
    case 1: return ctx[method](arr[0]);
    case 2: return ctx[method](arr[0], arr[1]);
    case 3: return ctx[method](arr[0], arr[1], arr[2]);
    case 4: return ctx[method](arr[0], arr[1], arr[2], arr[3]);
    case 5: return ctx[method](arr[0], arr[1], arr[2], arr[3], arr[4]);
    case 6: return ctx[method](arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]);
  }
}

