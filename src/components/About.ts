import { BaseComponent } from '../../lib/Renderer/src/BaseComponent';
import { TContext } from '../types';
import { withLayers } from '../../lib/Renderer/src/mixins/withLayers';
import { PixelFont } from './common/PixelFont';

export class About extends withLayers(BaseComponent)<TContext> {
  constructor (
    protected x: number,
    protected y: number,
    protected width: number,
    protected height: number
  ) {
    super();
  }

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
        text: 'Yeah Bitch!',
        color: 'white',
        withAnimation: true,
        animationDelay: 10000
      })
    );
  }

  protected render (): void {
    const ctx = this.currentLayer!.ctx;

    ctx.fillStyle = 'black';
    ctx.fillRect(this.x + 100, this.y + 100, this.width - 200, this.height - 200);
  }
}
