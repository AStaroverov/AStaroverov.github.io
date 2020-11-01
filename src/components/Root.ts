import { BaseComponent } from '../../lib/Renderer/src/BaseComponent';
import { LayersManager } from '../../lib/Renderer/src/layers/LayersManager';
import { TContext, TLayers } from '../types';
import { Camera } from './Camera';
import { Home } from './Home';
import { Deferred } from 'ts-deferred';

export class Root extends BaseComponent<TContext> {
  constructor (
    private layersManager: LayersManager<TLayers>,
    private devicePixelRatio: number
  ) {
    super();

    this.setContext({
      root: this,
      size: {
        x: 0,
        y: 0,
        width: this.layersManager.layers.main.canvas.width / devicePixelRatio,
        height: this.layersManager.layers.main.canvas.height / devicePixelRatio
      },
      layersManager,
      devicePixelRatio,
      deferStartAnimation: new Deferred()
    });
  }

  protected connected (): void {
    super.connected();

    const camera = new Camera({
      ...this.context.size,
      scaleMin: 0.1,
      scaleMax: 4
    });

    this.appendChild(camera);

    camera.appendChild(new Home({
      x: 0,
      y: 0,
      width: this.context.size.width,
      height: this.context.size.height
    }));
  }

  protected render (): void {
    this.layersManager.prepareToFrame();
  }
}
