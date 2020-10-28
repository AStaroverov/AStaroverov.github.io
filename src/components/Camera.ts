import { CameraComponent } from '../../lib/Renderer/src/components/Camera';
import { TContext } from '../types';

export class Camera extends CameraComponent<TContext> {
  public render (): void {
    const c = this.camera;
    const dPR = this.context.devicePixelRatio;
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
        0, 0, layer.canvas.width, layer.canvas.height
      );
      layer.ctx.setTransform(
        scale, 0, 0,
        scale, c.x, c.y
      );
    });
  }
}
