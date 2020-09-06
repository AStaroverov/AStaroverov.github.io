import { TLayerProps } from './Layer';
import { PIXEL_RATIO } from '../../constants/layout';

export class Canvases {
  public list: HTMLCanvasElement[];
  public map: Record<string, HTMLCanvasElement> = {};
  public container: HTMLElement;

  public constructor (container: HTMLElement, props: TLayerProps[]) {
    const size = container.getBoundingClientRect();

    this.container = container;
    this.list = props.map(() => document.createElement('canvas'));
    this.list.forEach((canvas, i) => {
      const name = props[i].name;

      this.map[name] = canvas;

      this.setCanvasStyle(name);
      this.setCanvasSize(name, size);
      this.setCanvasZIndex(name, props[i].index);

      container.appendChild(canvas);
    });
  }

  public setCanvasZIndex (name: string, index: number): void {
    this.map[name].style.zIndex = String(index);
  }

  protected setCanvasSize (name: string, size: DOMRect): void {
    this.map[name].width = size.width * PIXEL_RATIO;
    this.map[name].height = size.height * PIXEL_RATIO;
  }

  protected setCanvasStyle (name: string): void {
    const canvas = this.map[name];

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
