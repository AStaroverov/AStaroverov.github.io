import {TLayerProps} from "../Layers/Layer";
import {scheduler} from "../Scheduler";
import {rootTaskQueue} from "./TaskQueue";
import {workerMessages} from "./workerMessages";
import {Canvases} from "../Layers/Canvases";

export function renderWorker(
  container: HTMLElement,
  layersProps: TLayerProps[],
  worker: Worker,
): void {
  const layers = new Canvases(
    container,
    layersProps,
  );

  scheduler.add(rootTaskQueue);

  const offscreenCanvases = layers.list.map(canvas => canvas.transferControlToOffscreen());

  worker.postMessage({
    type: workerMessages.INIT,
    payload: {
      layersProps,
      canvases: offscreenCanvases,
    }
  }, offscreenCanvases);
}
