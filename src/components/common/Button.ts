import { BaseComponent } from '../../../lib/Renderer/src/BaseComponent';
import { withLayers } from '../../../lib/Renderer/src/mixins/withLayers';
import { TContext } from '../../types';
import { Layer } from '../../../lib/Renderer/src/layers/Layer';
import { CanvasMouseEvent } from '../../../lib/Renderer/src/worker/events/consts';

export type TProps = {
  layer: Layer
  x: number
  y: number
  width: number
  height: number
  text: string
  textSize: number
  color?: string
  colorHover?: string
  background?: string
  backgroundHover?: string
  onClick: (event: CanvasMouseEvent) => void
};

const COLOR = '#fff';
const BACKGROUND = '#000';

export class Button extends withLayers(BaseComponent)<TContext> {
  public isHovered: boolean = false;

  constructor (public props: TProps) {
    super();
  }

  protected connected (): void {
    super.connected();

    const p = this.props;

    this.setHitBox(p.x, p.y, p.x + p.width, p.y + p.height);
    this.attachToLayer(p.layer);

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
    const ctx = this.currentLayer!.ctx;
    const props = this.props;

    ctx.fillStyle = (this.isHovered
      ? (this.props.backgroundHover || this.props.background)
      : this.props.background) || BACKGROUND;

    ctx.fillRect(props.x, props.y, props.width, props.height);

    ctx.font = `${props.textSize}px Roboto`;
    ctx.fillStyle = (this.isHovered
      ? (this.props.colorHover || this.props.color)
      : this.props.color) || COLOR;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(props.text, props.x + props.width / 2, props.y + props.height / 2);
  }
}
