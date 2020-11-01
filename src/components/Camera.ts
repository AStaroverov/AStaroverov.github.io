import { gsap } from 'gsap';
import { CameraComponent } from '../../lib/Renderer/src/components/Camera';
import { TContext } from '../types';
import { withAnimationUpdates } from '../mixins/withAnimationUpdates';

export class Camera extends withAnimationUpdates(CameraComponent)<TContext> {
  private scale = 0.3;
  private animated = false;

  protected connected (): void {
    super.connected();

    this.context.camera = this.camera;

    if (process.env.NODE_ENV === 'development') {
      console.log('CameraService', this.camera);
    }

    const s = this.context.size;
    const x = s.width / 2 | 0;
    const y = s.height / 2 | 0;

    this.camera.set({
      scale: this.scale,
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
          this.context.deferStartAnimation.resolve();
          this.stopAnimation();
        }
      });
    }, 300);
  }

  protected render (): void {
    const c = this.camera;
    const dPR = this.context.devicePixelRatio;
    const size = this.context.size;

    this.setGlobalTransformMatrix([
      1 / c.scale, 0, 0, 0,
      0, 1 / c.scale, 0, 0,
      0, 0, 1, 0,
      -(c.x - size.width * c.scale / 2) / c.scale, (c.y - size.height * c.scale / 2) / c.scale, 0, 1
    ]);

    this.context.layersManager.list.forEach(layer => {
      layer.update();
      layer.ctx.setTransform(
        1, 0, 0,
        1, 0, 0
      );
      layer.ctx.clearRect(
        0, 0, size.width * dPR, size.height * dPR
      );
      layer.ctx.setTransform(
        c.scale * dPR, 0, 0,
        c.scale * dPR, (c.x - size.width * c.scale / 2) * dPR, (c.y - size.height * c.scale / 2) * dPR
      );
    });
  }

  public handleEvent (event): void {
    if (!this.animated) {
      super.handleEvent(event);
    }
  }
}
