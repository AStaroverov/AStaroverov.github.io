import {Layer, TLayerProps} from "./Layer";
import {PIXEL_RATIO} from "../../constants/layout";

export class Canvases {
  public list: HTMLCanvasElement[];
  public container: HTMLElement;

  public constructor(container: HTMLElement, props: TLayerProps[]) {
    const size = container.getBoundingClientRect();

    this.container = container;
    this.list = props.map(() => document.createElement('canvas'));
    this.list.forEach((canvas, i) => {
      this.setLayerStyle(canvas);
      this.setLayerSize(canvas, size);
      this.setLayerZIndex(canvas, props[i].index);

      container.appendChild(canvas);
    });
  }

  protected setLayerZIndex(canvas: HTMLCanvasElement, index: number) {
    canvas.style.zIndex = String(index);
  }

  protected setLayerSize (canvas: HTMLCanvasElement, size: DOMRect) {
    canvas.width = size.width * PIXEL_RATIO;
    canvas.height = size.height * PIXEL_RATIO;
  }

  protected setLayerStyle (canvas: HTMLCanvasElement) {
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.bottom = '0';
    canvas.style.right = '0';
    canvas.style.zIndex = '1';
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    ['userSelect', 'msUserSelect', 'mozUserSelect', 'webkitUserSelect'].forEach(prop => {
      canvas.style[prop] = 'none';
    });
  }
}
