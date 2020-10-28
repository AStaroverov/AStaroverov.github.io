import { BaseComponent } from '../BaseComponent';
import { TComponentConstructor } from '../types';
import { Layer } from '../layers/Layer';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function withLayers<
  Base extends TComponentConstructor<BaseComponent>
> (base: Base) {
  return class WithLayers extends base {
    protected currentLayer?: Layer;

    public run (): void {
      if (this.currentLayer?.isDirty === true) {
        super.run();
      }
    }

    public requestUpdate (): void {
      super.requestUpdate();
      this.currentLayer?.update();
    }

    public attachToLayer (layer: Layer): Layer {
      if (layer === this.currentLayer) {
        return layer;
      }

      this.currentLayer?.update();
      this.currentLayer = layer;
      this.requestUpdate();

      return layer;
    }

    public disconnected (): void {
      super.disconnected();

      this.currentLayer = undefined;
    }
  };
}
