import {TLayerProps} from "../Layers/Layer";
import {scheduler} from "../Scheduler";
import {rootTaskQueue} from "./TaskQueue";
import {workerMessages} from "./workerMessages";
import {Canvases} from "../Layers/Canvases";

const offscreenCanvasesSupported = HTMLCanvasElement.prototype.transferControlToOffscreen !== undefined;

export function render(
  container: HTMLElement,
  layersProps: TLayerProps[],
  pathToScript: string,
): Worker {
  const WorkerConstructor = offscreenCanvasesSupported ? Worker : require('../Worker').Worker;
  const layers = new Canvases(
    container,
    layersProps,
  );

  scheduler.add(rootTaskQueue);

  const worker = new WorkerConstructor(pathToScript);
  const offscreenCanvases = offscreenCanvasesSupported
    ? layers.list.map(canvas => canvas.transferControlToOffscreen())
    : layers.list;

  worker.postMessage({
    type: workerMessages.INIT,
    payload: {
      layersProps,
      canvases: offscreenCanvases,
    }
  }, offscreenCanvases);

  return worker;
}
