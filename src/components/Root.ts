import { BaseComponent } from '../../lib/Renderer/src/BaseComponent';
import { TContext, TLayers } from '../types';
import { Camera } from './Camera';
import { Home } from '../pages/Home';
import { Deferred } from 'ts-deferred';
import { Contacts } from '../pages/Contacts';
import { mapPageToRect, EPage, mapPageToName } from '../pages/defs';
import { Nav } from './Nav';
import { Experience } from '../pages/Experience';
import { AboutSite } from '../pages/AboutSite';

export class Root extends BaseComponent<TContext> {
  constructor (
    private devicePixelRatio: number,
    private layers: TLayers
  ) {
    super();

    this.setContext({
      root: this,
      layers,
      size: {
        x: 0,
        y: 0,
        width: layers.main.canvas.width / devicePixelRatio,
        height: layers.main.canvas.height / devicePixelRatio
      },
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

    camera.appendChild(
      new Home({
        text: mapPageToName[EPage.HOME],
        ...mapPageToRect[EPage.HOME]
      })
    );

    this.context.deferStartAnimation.promise.then(() => {
      camera.appendChild(
        new Contacts({
          text: mapPageToName[EPage.CONTACTS],
          ...mapPageToRect[EPage.CONTACTS]
        })
      );
      camera.appendChild(new Experience({
        text: mapPageToName[EPage.EXPERIENCE],
        ...mapPageToRect[EPage.EXPERIENCE]
      }));
      camera.appendChild(new AboutSite({
        text: mapPageToName[EPage.ABOUT_SITE],
        ...mapPageToRect[EPage.ABOUT_SITE]
      }));
      camera.appendChild(new Nav());
    });
  }

  protected render (): void {
    this.layers.keys.forEach((k) => {
      this.layers[k].nextFrame();
    });
  }
}
