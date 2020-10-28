import { BaseComponent } from '../../lib/Renderer/src/BaseComponent';
import { TContext } from '../types';
import { withLayers } from '../../lib/Renderer/src/mixins/withLayers';
import { Pxxl } from '../lib/Pxxl/dist/pxxl';
import { TPoint } from '../../lib/Renderer/src/types';

type TTextToPixels = { getPixels: (text: string) => TPoint[] };

async function generatePixels (text: string): Promise<TPoint[]> {
  const textToPixels = await new Promise<TTextToPixels>((resolve) => {
    Pxxl.LoadFont('/dist/fonts/c64.bdf', resolve);
  });

  return textToPixels.getPixels(text);
}

export class About extends withLayers(BaseComponent)<TContext> {
  private pixels: TPoint[];

  protected async connected (): Promise<void> {
    super.connected();

    const s = this.context.visualSize;

    this.setHitBox(s.x + 100, s.y + 100, s.width - 100, s.height - 100);
    this.attachToLayer(this.context.layersManager.layers.main);

    this.pixels = await generatePixels('HelloWorld');

    this.requestUpdate();
  }

  protected render (): void {
    const ctx = this.currentLayer!.ctx;
    const s = this.context.visualSize;
    const cx = s.width / 2;
    const ch = s.height / 2;

    ctx.fillStyle = 'black';
    ctx.fillRect(s.x + 100, s.y + 100, s.width - 200, s.height - 200);

    if (this.pixels !== undefined) {
      const dX = this.pixels[this.pixels.length - 1].x * 5 / 2;

      ctx.fillStyle = 'white';

      this.pixels.forEach(point => {
        ctx.fillRect(cx - dX + point.x * 5, ch + point.y * 5, 4, 4);
      });
    }
  }
}
