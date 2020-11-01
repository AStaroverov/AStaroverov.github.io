import { ImageRenderer } from '../utils/createImage';

// w 120, h 96
const path = new Path2D('M 120 24 H 24 c -6.6 0 -11.94 5.4 -11.94 12 L 12 108 c 0 6.6 5.4 12 12 12 h 96 c 6.6 0 12 -5.4 12 -12 V 36 c 0 -6.6 -5.4 -12 -12 -12 z m 0 24 l -48 30 l -48 -30 V 36 l 48 30 l 48 -30 v 12 z');

export const mailIcon = new ImageRenderer(
  144, 144, (ctx) => {
    ctx.fillStyle = 'white';
    ctx.fill(path);
  }
);
