import { gsap } from 'gsap';
import { BaseComponent } from '../../../../lib/Renderer/src/BaseComponent';
import { withLayers } from '../../../../lib/Renderer/src/mixins/withLayers';
import { TContext } from '../../../types';
import { withAnimationUpdates } from '../../../mixins/withAnimationUpdates';
import { Layer } from '../../../../lib/Renderer/src/layers/Layer';

export type TUnderhoodProps = {
  layer: Layer
  x: number
  y: number
  width: number
  height: number
  background?: string
  text?: string
  color?: string
};

export class Underhood extends withAnimationUpdates(withLayers(BaseComponent))<TContext> {
  public isShowed = false;
  public isAnimating = false;

  protected x: number;
  protected y: number;
  protected width: number;
  protected height: number;
  protected background: string = '#000';
  protected text: string;
  protected color: string = '#fff';

  private colorRGB: string;
  private backgroundRGB: string;
  private opacity: number = 0;
  private timeline;

  constructor (props: TUnderhoodProps) {
    super();

    this.attachToLayer(props.layer);

    Object.assign(this, props);

    this.colorRGB = hexToRgb(this.color).join(',');
    this.backgroundRGB = hexToRgb(this.background).join(',');
  }

  protected render (): void {
    if (this.isShowed) {
      const ctx = this.currentLayer!.ctx;

      ctx.fillStyle = `rgba(${this.backgroundRGB}, ${this.opacity})`;
      ctx.fillRect(this.x, this.y, this.width, this.height);

      ctx.font = '128px Roboto';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(${this.colorRGB}, ${this.opacity})`;
      ctx.fillText(this.text, this.x + this.width / 2 | 0, this.y + this.height / 2 | 0);
    }
  }

  public show (): Promise<void> {
    this.startAnimation();
    this.timeline?.kill();
    this.isShowed = true;
    this.isAnimating = true;

    return new Promise((resolve) => {
      this.timeline = gsap.to(this, {
        opacity: 1,
        duration: 0.6,
        onComplete: () => {
          this.isAnimating = false;
          this.stopAnimation();
          resolve();
        }
      });
    });
  }

  public hide (): Promise<void> {
    this.timeline?.kill();
    this.startAnimation();
    this.isAnimating = true;

    return new Promise((resolve) => {
      this.timeline = gsap.to(this, {
        opacity: 0,
        duration: 0.6,
        onComplete: () => {
          this.isAnimating = false;
          this.isShowed = false;
          this.stopAnimation();
          resolve();
        }
      });
    });
  }
}

function hexToRgb (hex: string): [
  number,
  number,
  number
] {
  if (hex.length === 4) {
    const r = hex[1];
    const g = hex[2];
    const b = hex[3];

    hex = `#${r}${r}${g}${g}${b}${b}`;
  }
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}
