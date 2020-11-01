import { BaseComponent } from '../../lib/Renderer/src/BaseComponent';
import { LayersManager } from '../../lib/Renderer/src/layers/LayersManager';
import { TContext, TLayers } from '../types';
import { Camera } from './Camera';
import { Home } from '../pages/Home';
import { Deferred } from 'ts-deferred';
import { Contacts } from '../pages/Contacts';

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

    const s = this.context.size;

    camera.appendChild(new Home({
      x: 0,
      y: 0,
      width: s.width,
      height: s.height
    }));

    this.context.deferStartAnimation.promise.then(() => {
      camera.appendChild(new Contacts({
        x: s.width + 300,
        y: 0,
        width: s.width,
        height: s.height
      }));
    });
  }

  protected render (): void {
    this.layersManager.prepareToFrame();
  }
}
