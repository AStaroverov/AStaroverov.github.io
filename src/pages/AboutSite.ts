import { Page } from '../components/common/Page';
import { GAP_BACKGROUND, GAP_CONTENT } from './defs';

const textLines = [
  'This site was creating as proof of concept.',
  'For this site i developed own library for rendering.',
  'I will try make library that give you experience like React only for Canvas.',
  '',
  'Also I use libraries GSAP for animation and Webpack for build.'
];

export class AboutSite extends Page {
  protected connected (): void {
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

    ctx.font = '36px Roboto';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    textLines.forEach((text, index) => {
      if (text !== '') {
        ctx.fillText(text, this.x + GAP_CONTENT, this.y + GAP_CONTENT + index * 48);
      }
    });
  }
}
