import { PixelFont } from '../components/common/PixelFont';
import { Page } from '../components/common/Page';
import { GAP_BACKGROUND } from './defs';

export class Home extends Page {
  protected connected (): void {
    super.connected();

    this.attachToLayer(this.context.layers.main);

    this.appendChild(
      new PixelFont({
        layer: this.layer!,
        x: this.x + this.width / 2 - 510,
        y: this.y + this.height / 2 - 150,
        text: 'My name is Alexandr',
        color: 'white',
        size: 6,
        withAnimation: true,
        animationDelay: 1000
      })
    );
    this.appendChild(
      new PixelFont({
        layer: this.layer!,
        x: this.x + this.width / 2 - 510,
        y: this.y + this.height / 2 + 50,
        text: 'And I am Developer!',
        color: 'white',
        size: 6,
        withAnimation: true,
        animationDelay: 2000
      })
    );

    this.context.deferStartAnimation.promise.then(() => {
      this.appendUnderhood();
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
}
