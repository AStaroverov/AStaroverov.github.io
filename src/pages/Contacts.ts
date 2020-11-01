import { Page } from '../components/common/Page';
import { mailIcon } from '../assets/mail';
import { phoneIcon } from '../assets/phone';

export class Contacts extends Page {
  protected text = 'Contacts';

  protected async connected (): Promise<void> {
    super.connected();

    this.attachToLayer(this.context.layersManager.layers.main);
    this.appendUnderhood();
  }

  protected renderFullPage (): void {
    const ctx = this.currentLayer!.ctx;

    ctx.fillStyle = 'black';
    ctx.fillRect(this.x + 100, this.y + 100, this.width - 200, this.height - 200);

    phoneIcon.render(ctx, this.x + 200, this.y + 190, 72, 72);
    mailIcon.render(ctx, this.x + 200, this.y + 390, 72, 72);

    ctx.textBaseline = 'top';
    ctx.fillStyle = 'white';
    ctx.font = '64px Roboto';
    ctx.textAlign = 'left';
    ctx.fillText('+7 (931) 22 40 849', this.x + 300, this.y + 200);
    ctx.fillText('hellbeast92@gmail.com', this.x + 300, this.y + 400);
  }
}
