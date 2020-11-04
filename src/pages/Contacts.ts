import { Page } from '../components/common/Page';
import { mailIcon } from '../assets/mail';
import { phoneIcon } from '../assets/phone';
import { GAP_BACKGROUND, GAP_CONTENT } from './defs';

export class Contacts extends Page {
  protected async connected (): Promise<void> {
    super.connected();

    this.attachToLayer(this.context.layers.main);
    this.appendUnderhood();
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

    phoneIcon.render(ctx, this.x + GAP_CONTENT * 1.5, this.y + GAP_CONTENT * 1.5 - 10, 72, 72);
    mailIcon.render(ctx, this.x + GAP_CONTENT * 1.5, this.y + GAP_CONTENT * 3 - 10, 72, 72);

    ctx.textBaseline = 'top';
    ctx.fillStyle = 'white';
    ctx.font = '64px Roboto';
    ctx.textAlign = 'left';
    ctx.fillText('+7 931 22 40 849', this.x + GAP_CONTENT * 2.7, this.y + GAP_CONTENT * 1.5);
    ctx.fillText('hellbeast92@gmail.com', this.x + GAP_CONTENT * 2.7, this.y + GAP_CONTENT * 3);
  }
}
