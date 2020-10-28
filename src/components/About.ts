import { BaseComponent } from '../../lib/Renderer/src/BaseComponent';
import { TContext } from '../types';
import { withLayers } from '../../lib/Renderer/src/mixins/withLayers';

export class About extends withLayers(BaseComponent)<TContext> {
  protected connected (): void {
    super.connected();

    const s = this.context.visualSize;

    this.setHitBox(s.x + 100, s.y + 100, s.width - 100, s.height - 100);
    this.attachToLayer(this.context.layersManager.layers.main);
  }

  protected render (): void {
    const ctx = this.currentLayer!.ctx;
    const s = this.context.visualSize;
    const cx = s.width / 2;
    const ch = s.height / 2;

    ctx.fillStyle = 'black';
    ctx.fillRect(s.x + 100, s.y + 100, s.width - 200, s.height - 200);

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.font = '64px serif';
    ctx.fillText('HELLO WORLD', cx, ch);
  }
}
