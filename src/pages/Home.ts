import { PixelFont } from '../components/common/PixelFont';
import { Page } from '../components/common/Page';
import { gsap } from 'gsap';
import { GAP_BACKGROUND, GAP_CONTENT } from './defs';

export class Home extends Page {
  protected connected (): void {
    super.connected();

    this.attachToLayer(this.context.layers.main);

    this.appendChild(
      new PixelFont({
        layer: this.layer!,
        x: this.x + GAP_CONTENT,
        y: this.y + GAP_CONTENT,
        text: 'Hi,My name is Alexandr',
        color: 'white',
        withAnimation: true,
        animationDelay: 1000
      })
    );
    this.appendChild(
      new PixelFont({
        layer: this.layer!,
        x: this.x + GAP_CONTENT,
        y: this.y + GAP_CONTENT + 100,
        text: 'And I am Developer!',
        color: 'white',
        withAnimation: true,
        animationDelay: 2000
      })
    );
    this.appendChild(
      new PixelFont({
        layer: this.layer!,
        x: this.x + GAP_CONTENT,
        y: this.y + GAP_CONTENT + 200,
        text: 'Yeah Boy!',
        color: 'white',
        withAnimation: true,
        animationDelay: 10000
      })
    );

    this.context.deferStartAnimation.promise.then(() => {
      this.appendUnderhood();
      //
      // this.appendChild(
      //   new Button({
      //     layer: this.layer!,
      //     x: this.x + this.width - GAP_CONTENT - 150 - 10,
      //     y: this.y + this.height - GAP_CONTENT - 20 - 10,
      //     width: 250,
      //     height: 80,
      //     text: 'CONTACTS',
      //     textSize: 32,
      //     color: 'black',
      //     background: 'white',
      //     onClick: this.moveCameraToContacts
      //   })
      // );
    });
  }

  protected renderFullPage (): void {
    const ctx = this.layer!.ctx;

    ctx.fillStyle = 'black';
    ctx.fillRect(
      this.x + GAP_BACKGROUND,
      this.y + GAP_BACKGROUND,
      this.width - GAP_BACKGROUND * 2,
      this.height - GAP_BACKGROUND * 2
    );
  }

  protected moveCameraToContacts = (): void => {
    this.startAnimation();

    const camera = this.context.camera;
    const endX = camera.x - camera.width - 250;
    const endScale = camera.scale;
    const tmp = { scale: camera.scale, x: camera.x };
    const timeline = gsap.timeline();

    timeline.to(tmp, {
      x: camera.x - 250,
      scale: camera.scale / 1.5,
      duration: 1,
      ease: 'Power1.easeIn',
      onUpdate: (): void => {
        camera.set(tmp);
      }
    });
    timeline.to(tmp, {
      x: endX,
      scale: endScale,
      duration: 1.5,
      ease: 'Power1.easeOut',
      onUpdate: (): void => {
        camera.set(tmp);
      },
      onComplete: (): void => {
        this.stopAnimation();
      }
    });
  };
}
