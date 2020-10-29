import { BaseComponent } from '../../../lib/Renderer/src/BaseComponent';
import { withLayers } from '../../../lib/Renderer/src/mixins/withLayers';
import { TContext } from '../../types';
import { textToPixels, TWordPoint } from '../../utils/textToPixels';
import { Layer } from '../../../lib/Renderer/src/layers/Layer';
import { gsap } from 'gsap';
import { withAnimationUpdates } from '../../mixins/withAnimationUpdates';

const SIZE_WORD_POINT = 5;
const SIZE_WORD_GAP = 1;

export type TProps = {
  layer: Layer
  x: number
  y: number
  text: string
  color?: string
  size?: number
  gap?: number
  withAnimation?: boolean
  animationDelay?: number
};

export class PixelFont extends withAnimationUpdates(withLayers(BaseComponent))<TContext> {
  public layer: Layer;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public row: TWordPoint[];
  public text: string;
  public color: string = 'black';
  public size: number = SIZE_WORD_POINT;
  public gap: number = SIZE_WORD_GAP;
  public withAnimation: boolean = false;
  public animationDelay: number = 0;

  private maxSize: number;
  private canRender: boolean = true;

  constructor (props: TProps) {
    super();

    this.maxSize = props.size || this.size;
    this.canRender = !props.withAnimation;

    Object.assign(this, props);
  }

  protected async connected (): Promise<void> {
    super.connected();

    this.attachToLayer(this.layer);

    this.row = await textToPixels(this.text);
    this.width = this.row[this.row.length - 1].column * (this.size + this.gap);
    this.height = this.row[this.row.length - 1].row * (this.size + this.gap);

    if (this.withAnimation) {
      setTimeout(() => {
        this.canRender = true;
        this.startAnimation();

        this.row.forEach((point, i) => {
          gsap.to(point, {
            x: point.x,
            y: point.y,
            duration: 3,
            ease: 'power4.out'
          });

          point.x += randomSign() * Math.random() * 20 | 0;
          point.y += randomSign() * Math.random() * 20 | 0;
        });

        gsap.to(this, {
          size: this.size,
          duration: 3,
          ease: 'power4.out'
        });

        this.size = 0;

        setTimeout(() => this.stopAnimation(), 5000);
      }, this.animationDelay);
    }
  }

  protected render (): void {
    if (this.canRender) {
      const ctx = this.currentLayer!.ctx;

      ctx.fillStyle = this.color;
      if (this.row !== undefined) {
        ctx.beginPath();

        this.row.forEach(point => {
          ctx.rect(
            this.x + (point.x - 1) * (this.maxSize + this.gap),
            this.y + (point.y - 1) * (this.maxSize + this.gap),
            this.size,
            this.size
          );
        });

        ctx.closePath();
        ctx.fill();
      }
    }
  }
}

// 0 < value < 1
function randomSign (value: number = Math.random()): number {
  return value > 0.5 ? 1 : -1;
}
