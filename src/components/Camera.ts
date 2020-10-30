import { gsap } from 'gsap';
import { CameraComponent } from '../../lib/Renderer/src/components/Camera';
import { TContext } from '../types';
import { withAnimationUpdates } from '../mixins/withAnimationUpdates';

export class Camera extends withAnimationUpdates(CameraComponent)<TContext> {
  private scale = 0.3;
  private animated = false;

  protected connected (): void {
    super.connected();

    const os = this.context.originalSize;
    const x = os.width / 2 | 0;
    const y = os.height / 2 | 0;

    this.camera.setScale(this.scale);
    this.camera.set({
      x,
      y
    });

    setTimeout(() => {
      this.startAnimation();
      this.animated = true;
      gsap.to(this, {
        scale: 1,
        duration: 3,
        onUpdate: (): void => {
          this.camera.zoom(
            x,
            y,
            this.camera.scale - this.scale
          );
        },
        onComplete: (): void => {
          this.animated = false;
          this.stopAnimation();
        }
      });
    }, 300);
  }

  protected render (): void {
    const c = this.camera;
    const dPR = this.context.devicePixelRatio;
    const size = this.context.originalSize;
    const scale = c.scale * dPR;

    this.setGlobalTransformMatrix([
      1 / scale, 0, 0, 0,
      0, 1 / scale, 0, 0,
      0, 0, 1, 0,
      -c.x / scale, -c.y / scale, 0, 1
    ]);

    this.context.layersManager.list.forEach(layer => {
      layer.update();
      layer.ctx.setTransform(
        1, 0, 0,
        1, 0, 0
      );
      layer.ctx.clearRect(
        0, 0, size.width, size.height
      );
      layer.ctx.setTransform(
        scale, 0, 0,
        scale, c.x, c.y
      );
    });
  }

  public handleEvent (event): void {
    if (!this.animated) {
      super.handleEvent(event);
    }
  }
}
