import { Page } from '../components/common/Page';
import { GAP_BACKGROUND, GAP_CONTENT } from './defs';

const textLines = [
  'I have been working in the IT industry for about 7 years',
  '',
  'I have rich experience with git, unix CLI, Typescript, React, Redux,',
  'Vue, Vuex, WebComponents, Gulp, Webpack, Rollup and CI & CD platforms.',
  'All of it I successfully use for production solutions.',
  '',
  'I developed big apps from scratch to production.',
  'I like when work give me challenges!'
];

export class Experience extends Page {
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
