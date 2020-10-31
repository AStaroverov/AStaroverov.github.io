import { BaseComponent } from '../../../../lib/Renderer/src/BaseComponent';
import { withLayers } from '../../../../lib/Renderer/src/mixins/withLayers';
import { TContext } from '../../../types';
import { withAnimationUpdates } from '../../../mixins/withAnimationUpdates';
import { Underhood } from './Underhood';

export type TWrapperSimplePageProps = {
  x: number
  y: number
  width: number
  height: number
  background?: string
  text?: string
  color?: string
};

export class Page extends withAnimationUpdates(withLayers(BaseComponent))<TContext> {
  protected x: number;
  protected y: number;
  protected width: number;
  protected height: number;
  protected background: string = '#000';
  protected text: string;
  protected color: string = '#fff';

  protected simpleRender = false;

  private underhood: Underhood;

  constructor (props: TWrapperSimplePageProps) {
    super();

    Object.assign(this, props);
  }

  protected appendUnderhood (): void {
    this.appendChild(
      this.underhood = new Underhood({
        layer: this.context.layersManager.layers.above,
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        background: this.background,
        text: this.text,
        color: this.color
      })
    );

    this.context.camera.on('updated', (camera) => {
      const simpleRender = camera.scale < 0.5;

      if (this.simpleRender !== simpleRender) {
        if (simpleRender) {
          this.underhood.show();
        } else {
          this.underhood.hide();
        }

        this.simpleRender = simpleRender;
      }
    });
  }

  protected render (): void {
    const cam = this.context.camera;

    if (
      (cam.x >= this.x ||
          cam.x <= this.x + this.width) &&
        (cam.y >= this.y ||
          cam.y <= this.y + this.height)
    ) {
      if (!this.simpleRender || this.underhood?.isAnimating) {
        this.renderFullPage();
      }
    }
  }

  protected renderFullPage (): void {}

  protected getChildren <T extends this> (): T[] | void {
    console.log(this.simpleRender, !this.underhood?.isAnimating);
    return this.simpleRender && !this.underhood?.isAnimating
      ? [this.underhood as unknown as T]
      : (this.children as T[]);
  }
}
