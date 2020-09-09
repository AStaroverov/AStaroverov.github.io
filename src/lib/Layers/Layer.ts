export interface TLayerProps {
  name: string
  index: number
}

export class Layer<Ctx extends CanvasRenderingContext2D | WebGL2RenderingContext = CanvasRenderingContext2D> {
  public name: string;
  public index: number;

  public canvas: OffscreenCanvas | HTMLCanvasElement;
  public ctx: Ctx;

  public isDirty: boolean = true;
  public willDirty: boolean = true;

  constructor (
    props: TLayerProps,
    canvas: OffscreenCanvas | HTMLCanvasElement,
    ctxName: OffscreenRenderingContextId = '2d'
  ) {
    this.name = props.name;
    this.index = props.index;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext(ctxName) as Ctx;
  }

  public update (): void {
    this.willDirty = true;
  }
}
