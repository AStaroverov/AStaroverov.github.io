import { gsap } from 'gsap';
import { CameraComponent } from '../../lib/Renderer/src/components/Camera';
import { TContext } from '../types';
import { withAnimationUpdates } from '../mixins/withAnimationUpdates';
import { mapPageToRect, EPageName } from '../pages/defs';
import { CanvasMouseEvent } from '../../lib/Renderer/src/worker/events/defs';
import { ILayer } from '../../lib/Renderer/src/layers/Layer';
import { vec2 } from 'gl-matrix';

export class Camera extends withAnimationUpdates(CameraComponent)<TContext> {
  private cameraLayer: ILayer;
  private scale = 0.3;
  private animated = false;
  private cameraUpdated = true;

  protected connected (): void {
    super.connected();

    this.cameraLayer = this.context.layers.main;
    this.context.camera = this.camera;

    this.camera.on('updated', () => {
      this.cameraUpdated = true;
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('CameraService', this.camera);
    }

    const rect = mapPageToRect[EPageName.HOME];
    const x = rect.x + rect.width / 2 | 0;
    const y = rect.y + rect.height / 2 | 0;

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

  public run (): void {
    const c = this.camera;
    const dPR = this.context.devicePixelRatio;
    const size = this.context.size;
    const dx = size.width / 2 - c.x * c.scale;
    const dy = size.height / 2 - c.y * c.scale;

    this.context.layers.keys.forEach((key, index: number) => {
      const layer = this.context.layers[key];

      if (this.cameraUpdated) {
        layer.updateImmediate();
      }

      if (layer.isDirty) {
        layer.ctx.setTransform(
          1, 0, 0,
          1, 0, 0
        );

        layer.ctx.clearRect(
          0, 0, size.width * dPR, size.height * dPR
        );

        if (key === 'static') {
          layer.ctx.setTransform(
            dPR, 0, 0,
            dPR, 0, 0
          );
        } else {
          layer.setTransformMatrix([
            1 / c.scale, 0, 0, 0,
            0, 1 / c.scale, 0, 0,
            0, 0, 1, 0,
            -dx, -dy, 0, 1
          ]);
          layer.ctx.setTransform(
            c.scale * dPR, 0, 0,
            c.scale * dPR, dx * dPR, dy * dPR
          );
        }
      }
      // layer.ctx.fillStyle = 'red';
      // layer.ctx.fillRect(c.x - 10, c.y - 10, 20, 20);
    });

    this.cameraUpdated = false;
  }

  public handleEvent (event): void {
    if (!this.animated) {
      super.handleEvent(event);
    }
  }

  protected getPointFromEvent (event: CanvasMouseEvent): vec2 {
    return this.cameraLayer.getTransformedVec2([event.x, event.y]);
  }
}
