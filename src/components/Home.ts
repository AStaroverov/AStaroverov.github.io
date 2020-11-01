import { PixelFont } from './common/PixelFont';
import { Page } from './common/Page';

export class Home extends Page {
  protected text = 'Home';

  protected async connected (): Promise<void> {
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
    });
  }

  protected renderFullPage (): void {
    const ctx = this.currentLayer!.ctx;

    ctx.fillStyle = 'black';
    ctx.fillRect(this.x + 100, this.y + 100, this.width - 200, this.height - 200);
  }
}
