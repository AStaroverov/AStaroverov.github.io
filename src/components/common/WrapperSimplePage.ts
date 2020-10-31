import { BaseComponent } from '../../../lib/Renderer/src/BaseComponent';
import { withLayers } from '../../../lib/Renderer/src/mixins/withLayers';
import { TContext } from '../../types';
import { Layer } from '../../../lib/Renderer/src/layers/Layer';
import { withAnimationUpdates } from '../../mixins/withAnimationUpdates';

export type TWrapperSimplePageProps<Component extends BaseComponent = BaseComponent> = {
  layer: Layer
  x: number
  y: number
  width: number
  height: number
  background?: string
  text: string
  color?: string
  childs?: Component[]
};

export class WrapperSimplePage extends withAnimationUpdates(withLayers(BaseComponent))<TContext> {
  protected layer: Layer;
  protected x: number;
  protected y: number;
  protected width: number;
  protected height: number;
  protected background: string = 'black';
  protected text: string;
  protected color: string = 'white';
  protected childs: BaseComponent[];

  private shouldRenderChildren = false;

  constructor (props: TWrapperSimplePageProps) {
    super();

    Object.assign(this, props);
    props.childs?.forEach(comp => this.appendChild(comp));
    this.attachToLayer(props.layer);
  }

  protected render (): void {
    const cam = this.context.camera;

    this.shouldRenderChildren = false;

    console.log('------------', cam);
    console.log(
      cam.x, this.x
    );
    console.log(
      cam.x, this.x + this.width
    );
    console.log(
      cam.y, this.y
    );
    console.log(
      cam.y, this.y + this.height
    );
    if (
      cam.x >= this.x &&
      cam.x <= this.x + this.width &&
      cam.y >= this.y &&
      cam.y <= this.y + this.height
    ) {
      if (cam.scale > 0.75) {
        this.shouldRenderChildren = true;
      } else {
        this.renderSimplePage();
      }
    }
  }

  protected renderSimplePage (): void {
    const ctx = this.currentLayer!.ctx;

    ctx.fillStyle = this.background;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.textAlign = 'center';
    ctx.fillText(this.text, this.x + this.width / 2 | 0, this.y + this.height / 2 | 0);
  }

  protected getChildren <T extends this> (): T[] | void {
    return this.shouldRenderChildren ? (this.children as T[]) : undefined;
  }
}
