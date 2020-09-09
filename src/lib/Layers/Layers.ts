import { Layer } from './Layer';

export interface TLayersCallbacks {
  onSortLayers?: (layers: Layer[]) => void
}

export class Layers {
  public list: Layer[];
  public map: Record<string, Layer> = {};
  protected callbacks?: TLayersCallbacks;

  public constructor (layers: Layer[], callbacks?: TLayersCallbacks) {
    this.list = [...layers];
    this.callbacks = callbacks;

    layers.forEach((layer) => {
      this.map[layer.name] = layer;
    });

    this.sortLayers();
  }

  public setLayerIndex (name: string, index: number): void {
    this.list[name].index = index;
    this.list[name].canvas.style.zIndex = index;

    this.sortLayers();
  }

  public update (): void {
    this.list.forEach(l => l.update());
  }

  protected sortLayers (): void {
    this.list.sort((a, b) => a.index - b.index);
    this.callbacks?.onSortLayers?.call(null, this.list);
  }
}
