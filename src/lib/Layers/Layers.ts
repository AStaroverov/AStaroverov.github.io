import {Layer} from "./Layer";
import {Task, taskQueue} from "../Scheduler";

export class Layers {
  public list: Layer[];
  public map: Record<string, Layer> = {};
  public container: HTMLElement;

  private prevSize: { width: number; height: number } = { width: 0, height: 0 };

  public constructor(container: HTMLElement, layers: Layer[]) {
    this.container = container;
    this.list = [...layers];

    layers.forEach((layer) => {
      this.map[layer.name] = layer;
    });

    this.sortLayers();
    taskQueue.add(new Task(this.performUpdate, this));
  }

  public setLayerIndex(name: string, index: number) {
    this.list[name].index = index;
    this.list[name].canvas.style.zIndex = index;

    this.sortLayers();
  }

  protected sortLayers() {
    this.list.sort((a, b) => a.index - b.index);
  }

  protected getRootSize (): { width: number, height: number } {
    return {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
  }

  protected performUpdate() {
    const size = this.getRootSize();

    if (this.prevSize.width !== size.width || this.prevSize.height !== size.height) {
      this.prevSize = size;

      this.list.forEach((l) => {
        l.updateSize(size);
      });
    }
  }
}
