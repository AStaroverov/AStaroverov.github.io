import { BaseComponent } from '../../../lib/Renderer/src/BaseComponent';
import { TContext } from '../../types';
import { Layer } from '../../../lib/Renderer/src/layers/Layer';
import { CanvasMouseEvent } from '../../../lib/Renderer/src/worker/events/defs';

export type TProps = {
  layer: Layer
  x: number
  y: number
  width: number
  height: number
  strokeWidth?: number
  strokeStyle?: string
  strokeStyleHover?: string
  background?: string
  backgroundHover?: string
  text: string
  color?: string
  colorHover?: string
  textSize: number
  onClick: (event: CanvasMouseEvent) => void
};

const COLOR = '#fff';
const BACKGROUND = '#000';
const STROKE_STYLE = '#fff';

export class Button extends BaseComponent<TContext> {
  public isHovered: boolean = false;

  constructor (public props: TProps) {
    super();
  }

  protected connected (): void {
    super.connected();

    const p = this.props;

    this.attachToLayer(p.layer);
    this.setHitBox(p.x, p.y, p.x + p.width, p.y + p.height);

    this.addEventListener('mouseenter', () => {
      this.isHovered = true;
      this.requestUpdate();
    });
    this.addEventListener('mouseleave', () => {
      this.isHovered = false;
      this.requestUpdate();
    });
    this.addEventListener('click', this.props.onClick);
  }

  protected disconnected (): void {
    super.disconnected();

    this.removeEventListeners();
  }

  protected render (): void {
    const ctx = this.layer!.ctx;
    const props = this.props;

    ctx.fillStyle = (this.isHovered
      ? (this.props.backgroundHover || this.props.background)
      : this.props.background) || BACKGROUND;

    ctx.fillRect(props.x, props.y, props.width, props.height);

    if (props.strokeWidth !== undefined) {
      ctx.strokeStyle = (this.isHovered
        ? (this.props.strokeStyleHover || this.props.strokeStyle)
        : this.props.strokeStyle) || STROKE_STYLE;
      ctx.strokeRect(props.x, props.y, props.width, props.height);
    }

    ctx.font = `${props.textSize}px Roboto`;
    ctx.fillStyle = (this.isHovered
      ? (this.props.colorHover || this.props.color)
      : this.props.color) || COLOR;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(props.text, props.x + props.width / 2, props.y + props.height / 2);
  }
}
