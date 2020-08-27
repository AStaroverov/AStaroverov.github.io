import {PIXEL_RATIO} from "../../constants/layout";
import {Task, taskQueue} from "../Scheduler";

export class Layer<Ctx extends CanvasRenderingContext2D | WebGL2RenderingContext = CanvasRenderingContext2D> {
  private static createCanvas (): HTMLCanvasElement {
    return document.createElement('canvas');
  }

  private static setCanvasStyle ($canvas: HTMLCanvasElement) {
    $canvas.style.position = 'absolute';
    $canvas.style.top = '0';
    $canvas.style.left = '0';
    $canvas.style.bottom = '0';
    $canvas.style.right = '0';
    $canvas.style.zIndex = '1';
    $canvas.style.width = '100%';
    $canvas.style.height = '100%';

    ['userSelect', 'msUserSelect', 'mozUserSelect', 'webkitUserSelect'].forEach(prop => {
      $canvas.style[prop] = 'none';
    });
  }

  public name: string;
  public index: number;
  public isDirty: boolean = true;
  public willDirty: boolean = true;
  public canvas: HTMLCanvasElement;
  public ctx: Ctx;

  public size: {
    width: number,
    height: number,
  } = {width: 0, height: 0}

  constructor(
    name: string,
    index: number,
    optional?: {
      canvas?: HTMLCanvasElement,
      ctx?: '2d' | 'webgl2'
    }
  ) {
    this.name = name;
    this.index = index;

    this.canvas = optional?.canvas || Layer.createCanvas();
    this.ctx = this.canvas.getContext(optional?.ctx || '2d') as Ctx;

    Layer.setCanvasStyle(this.canvas);
  }

  public updateSize (size) {
    this.isDirty = true;
    this.willDirty = true;
    this.canvas.width = size.width * PIXEL_RATIO;
    this.canvas.height = size.height * PIXEL_RATIO;
  }
}

