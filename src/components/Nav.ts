import { gsap } from 'gsap';
import { TContext } from '../types';
import { BaseComponent } from '../../lib/Renderer/src/BaseComponent';
import { Button } from './common/Button';
import { mapPageToRect, EPage } from '../pages/defs';
import { withAnimationUpdates } from '../mixins/withAnimationUpdates';

const BUTTON_HEIGHT: number = 60;

export class Nav extends withAnimationUpdates(BaseComponent)<TContext> {
  protected connected (): void {
    super.connected();

    this.layer = this.context.layers.static;

    const s = this.context.size;

    this.appendChild(
      new Button({
        layer: this.layer,
        x: s.width / 2 - 80,
        y: s.height - BUTTON_HEIGHT - 10,
        width: 160,
        height: BUTTON_HEIGHT,
        background: 'black',
        strokeWidth: 2,
        strokeStyle: 'white',
        text: EPage.HOME,
        color: 'white',
        textSize: 24,
        onClick: () => this.moveCameraTo(EPage.HOME)
      })
    );
    this.appendChild(
      new Button({
        layer: this.layer,
        x: s.width / 2 + 80 + 50,
        y: s.height - BUTTON_HEIGHT - 10,
        width: 200,
        height: BUTTON_HEIGHT,
        background: 'black',
        strokeWidth: 2,
        strokeStyle: 'white',
        text: EPage.CONTACTS,
        color: 'white',
        textSize: 24,
        onClick: () => this.moveCameraTo(EPage.CONTACTS)
      })
    );
    this.appendChild(
      new Button({
        layer: this.layer,
        x: s.width / 2 - 80 - 250,
        y: s.height - BUTTON_HEIGHT - 10,
        width: 200,
        height: BUTTON_HEIGHT,
        background: 'black',
        strokeWidth: 2,
        strokeStyle: 'white',
        text: EPage.EXPERIENCE,
        color: 'white',
        textSize: 24,
        onClick: () => this.moveCameraTo(EPage.EXPERIENCE)
      })
    );
  }

  protected moveCameraTo = (pageName: EPage): void => {
    this.startAnimation();

    const camera = this.context.camera;
    const rect = mapPageToRect[pageName];
    const endX = rect.x + rect.width / 2;
    const endY = rect.y + rect.height / 2;
    const tmp = { scale: camera.scale, x: camera.x, y: camera.y };

    gsap.to(tmp, {
      scale: 1,
      duration: 1,
      ease: 'Power1.easeInOut'
    });
    gsap.to(tmp, {
      x: endX,
      y: endY,
      duration: 1.4,
      ease: 'Power4.easeInOut',
      onUpdate: (): void => {
        camera.set(tmp);
      }
    });
  };
}
