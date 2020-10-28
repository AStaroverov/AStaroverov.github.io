import { Layer } from './Layer';

export class LayersManager<Map extends Record<string, Layer> = Record<string, Layer>> {
  public list: Layer[];

  public constructor (
    public layers: Map
  ) {
    this.list = Object.values(layers);
  }

  public update (): void {
    this.list.forEach(l => l.update());
  }

  public prepareToFrame (): void {
    this.list.forEach(l => {
      l.isDirty = l.willDirty;
      l.willDirty = false;
    });
  }
}
