export class Layer<
  Canvas extends OffscreenCanvas | HTMLCanvasElement = OffscreenCanvas,
  Ctx = Canvas extends OffscreenCanvas ? OffscreenCanvasRenderingContext2D : CanvasRenderingContext2D
> {
  public ctx: Ctx;

  public isDirty: boolean = true;
  public willDirty: boolean = true;

  constructor (
    public canvas: Canvas,
    createRenderContext?: (canas: Canvas) => Ctx
  ) {
    this.ctx = createRenderContext !== undefined
      ? createRenderContext(this.canvas)
      : createDefaultRenderContext<Canvas, Ctx>(this.canvas);
  }

  public update (): void {
    this.willDirty = true;
  }
}

function createDefaultRenderContext<
  Canvas extends OffscreenCanvas | HTMLCanvasElement,
  Ctx = Canvas extends OffscreenCanvas ? OffscreenCanvasRenderingContext2D : CanvasRenderingContext2D
> (canvas: Canvas): Ctx {
  return canvas.getContext('2d') as unknown as Ctx;
}
