import { isWorker } from './isWorker';

export class ImageRenderer {
  public canvas: HTMLCanvasElement | OffscreenCanvas;
  public ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

  constructor (
    public width: number,
    public height: number,
    public renderer: (ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) => void
  ) {
    this.canvas = isWorker
      ? new OffscreenCanvas(width, height)
      : globalThis.document.createElement('canvas');

    if (!isWorker) {
      this.canvas.width = width;
      this.canvas.height = height;
    }

    this.ctx = this.canvas.getContext('2d')!;

    renderer(this.ctx);
  }

  public render (
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ): void {
    ctx.drawImage(
      this.canvas,
      0, 0, this.width, this.height,
      x, y, w, h
    );
  }
}
