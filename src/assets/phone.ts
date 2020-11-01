import { ImageRenderer } from '../utils/createImage';

// w 120, h 96
const path = new Path2D('M 39.72 64.74 c 8.64 16.98 22.56 30.84 39.54 39.54 l 13.2 -13.2 c 1.62 -1.62 4.02 -2.16 6.12 -1.44 c 6.72 2.22 13.98 3.42 21.42 3.42 c 3.3 0 6 2.7 6 6 V 120 c 0 3.3 -2.7 6 -6 6 c -56.34 0 -102 -45.66 -102 -102 c 0 -3.3 2.7 -6 6 -6 h 21 c 3.3 0 6 2.7 6 6 c 0 7.5 1.2 14.7 3.42 21.42 c 0.66 2.1 0.18 4.44 -1.5 6.12 l -13.2 13.2 z');

export const phoneIcon = new ImageRenderer(
  144, 144, (ctx) => {
    ctx.fillStyle = 'white';
    ctx.fill(path);
  }
);
