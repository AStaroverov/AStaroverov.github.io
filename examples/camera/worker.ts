import { Layer } from '../../src/layers/Layer';
import { init } from '../commmon/init';
import { LayersManager } from '../../src/layers/LayersManager';
import { render } from '../../src/render';
import { CameraComponent } from '../../src/components/Camera';
import { GraphRoot, TContext, TLayers } from '../commmon/graph';

class Camera extends CameraComponent<TContext> {
  public render (): void {
    const c = this.camera;
    const dPR = this.context.devicePixelRatio;

    this.context.layersManager.list.forEach(layer => {
      layer.update();
      layer.ctx.setTransform(
        1, 0, 0,
        1, 0, 0
      );
      layer.ctx.clearRect(
        0, 0, layer.canvas.width, layer.canvas.height
      );
      // multiple scale to dPR for avoid use dPR for each sape coordinates
      layer.ctx.setTransform(
        c.scale * dPR, 0, 0,
        c.scale * dPR, c.x, c.y
      );
    });

    this.setGlobalTransformMatrix([
      c.scale * dPR, 0, 0, 0,
      0, c.scale * dPR, 0, 0,
      0, 0, 1, 0,
      -c.x * dPR, -c.y * dPR, 0, 1
    ]);
  }
}

class RootWithCamera extends GraphRoot {
  protected updateChildren (): void {
    const camera = new Camera({
      usableRect: this.context.size
    });

    this.appendChild(camera);

    this.createChildren().forEach(child => {
      camera.appendChild(child);
    });
  }

  protected render (): void {
    this.layersManager.prepareToFrame();
    this.context.layersManager.list.forEach(l => {
      l.ctx.textAlign = 'center';
      l.ctx.font = '24px serif';
    });
  }
}

async function main (): Promise<void> {
  const {
    workerScope,
    canvases,
    devicePixelRatio
  } = await init();

  const layersManager = new LayersManager<TLayers>({
    connections: new Layer(canvases[0], 0),
    nodes: new Layer(canvases[1], 1),
    dragging: new Layer(canvases[2], 2)
  });

  render(workerScope, new RootWithCamera(layersManager, devicePixelRatio));
}
main();
