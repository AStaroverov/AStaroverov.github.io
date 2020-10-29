import { BaseComponent } from '../../lib/Renderer/src/BaseComponent';
import { TContext } from '../types';
import { withLayers } from '../../lib/Renderer/src/mixins/withLayers';
import { PixelFont } from './common/PixelFont';

export class About extends withLayers(BaseComponent)<TContext> {
  protected async connected (): Promise<void> {
    super.connected();

    const s = this.context.visualSize;

    this.setHitBox(-s.width / 2 + 100, -s.height / 2 + 100, s.width - 200, s.height - 200);
    this.attachToLayer(this.context.layersManager.layers.main);

    this.appendChild(
      new PixelFont({
        layer: this.currentLayer!,
        x: -s.width / 2 + 200,
        y: -s.height / 2 + 200,
        text: 'Hi,My name is Alexandr',
        color: 'white',
        withAnimation: true,
        animationDelay: 1000
      })
    );
    this.appendChild(
      new PixelFont({
        layer: this.currentLayer!,
        x: -s.width / 2 + 200,
        y: -s.height / 2 + 300,
        text: 'And I am Developer!',
        color: 'white',
        withAnimation: true,
        animationDelay: 2000
      })
    );
    this.appendChild(
      new PixelFont({
        layer: this.currentLayer!,
        x: -s.width / 2 + 200,
        y: -s.height / 2 + 400,
        text: 'Yeah Bitch!',
        color: 'white',
        withAnimation: true,
        animationDelay: 10000
      })
    );
  }

  protected render (): void {
    const ctx = this.currentLayer!.ctx;
    const s = this.context.visualSize;

    ctx.fillStyle = 'black';
    ctx.fillRect(-s.width / 2 + 100, -s.height / 2 + 100, s.width - 200, s.height - 200);
  }
}
