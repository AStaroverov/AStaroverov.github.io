import { BaseComponent } from '../BaseComponent';
import { LayersManager } from '../layers/LayersManager';
import { TComponentConstructor } from '../types';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function withLayers<
  LM extends LayersManager,
  Map extends LM['layers'],
  Base extends TComponentConstructor<BaseComponent>
> (base: Base) {
  return class WithLayers extends base {
    public static getLayersManger (comp: BaseComponent<{ layersManager?: LM }>): LM | void {
      return comp.context.layersManager;
    }

    protected currentLayer?: Map[keyof Map];

    public run (): void {
      if (this.currentLayer?.isDirty === true) {
        super.run();
      }
    }

    public performRender (): void {
      super.performRender();
      this.currentLayer?.update();
    }

    public attachToLayer<K extends keyof Map>(key: K): Map[K] {
      const lm = (this.constructor as typeof WithLayers).getLayersManger(this);

      if (lm === undefined) {
        throw new Error('Incorrect function for extract layersManager');
      }

      const layer = (lm.layers as Map)[key];

      if (layer === this.currentLayer) {
        return layer;
      }

      this.currentLayer?.update();
      this.currentLayer = layer;
      this.performRender();

      return layer;
    }

    public disconnected (): void {
      super.disconnected();

      this.currentLayer = undefined;
    }
  };
}
