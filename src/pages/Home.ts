import { PixelFont } from '../components/common/PixelFont';
import { Page } from '../components/common/Page';
import { Button } from '../components/common/Button';
import { gsap } from 'gsap';

export class Home extends Page {
  protected text = 'Home';

  protected connected (): void {
    super.connected();

    this.attachToLayer(this.context.layersManager.layers.main);

    this.appendChild(
      new PixelFont({
        layer: this.currentLayer!,
        x: this.x + 200,
        y: this.y + 200,
        text: 'Hi,My name is Alexandr',
        color: 'white',
        withAnimation: true,
        animationDelay: 1000
      })
    );
    this.appendChild(
      new PixelFont({
        layer: this.currentLayer!,
        x: this.x + 200,
        y: this.y + 300,
        text: 'And I am Developer!',
        color: 'white',
        withAnimation: true,
        animationDelay: 2000
      })
    );
    this.appendChild(
      new PixelFont({
        layer: this.currentLayer!,
        x: this.x + 200,
        y: this.y + 400,
        text: 'Yeah Boy!',
        color: 'white',
        withAnimation: true,
        animationDelay: 10000
      })
    );

    this.context.deferStartAnimation.promise.then(() => {
      this.appendUnderhood();

      this.appendChild(
        new Button({
          layer: this.currentLayer!,
          x: this.x + this.width - 350 - 10,
          y: this.y + this.height - 180 - 10,
          width: 250,
          height: 80,
          text: 'CONTACTS',
          textSize: 32,
          color: 'black',
          background: 'white',
          onClick: this.moveCameraToContacts
        })
      );
    });
  }

  protected renderFullPage (): void {
    const ctx = this.currentLayer!.ctx;

    ctx.fillStyle = 'black';
    ctx.fillRect(this.x + 100, this.y + 100, this.width - 200, this.height - 200);
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
