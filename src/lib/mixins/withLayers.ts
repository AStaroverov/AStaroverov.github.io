import { BaseComponent } from "../BaseClasses/BaseComponent";
import { LayersManager } from "../Layers/LayersManager";
import { TComponentConstructor } from "../types";

export function withLayers<
  LM extends LayersManager,
  Map extends LM["layers"],
>(layersManger: LM) {
  return function withLayersMixin<Base extends TComponentConstructor<BaseComponent>>(base: Base) {
    return class WithLayers extends base {
      protected currentLayer?: Map[keyof Map];

      public run(): this[] | void {
        if (this.currentLayer?.isDirty === true) {
          return super.run();
        }
      }

      public performRender(): void {
        super.performRender();
        this.currentLayer?.update();
      }

      public attachToLayer<K extends keyof Map>(key: K): Map[K] {
        const layer = (layersManger.layers as Map)[key];

        if (layer === this.currentLayer) {
          return layer;
        }
    
        if (this.currentLayer !== undefined) {
          this.currentLayer.update();
        }
    
        this.currentLayer = layer;
        this.currentLayer!.update();
    
        return layer;
      }

      public disconnected() {
        super.disconnected();

        this.currentLayer = undefined;
      }
    }
  }
}
