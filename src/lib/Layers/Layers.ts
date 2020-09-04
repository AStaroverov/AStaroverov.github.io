import {Layer} from "./Layer";

export class Layers {
  public list: Layer[];
  public map: Record<string, Layer> = {};

  public constructor(layers: Layer[]) {
    this.list = [...layers];

    layers.forEach((layer) => {
      this.map[layer.name] = layer;
    });

    this.sortLayers();
  }

  public setLayerIndex(name: string, index: number) {
    this.list[name].index = index;
    this.list[name].canvas.style.zIndex = index;

    this.sortLayers();
  }

  protected sortLayers() {
    this.list.sort((a, b) => a.index - b.index);
  }
}
