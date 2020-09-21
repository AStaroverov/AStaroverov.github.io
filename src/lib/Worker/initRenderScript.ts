import { MessageType, typedPostMessage } from './messageType';
import { PseudoWorker } from '.';
import { PIXEL_RATIO } from '../utils';
import { dispatcherEventToWorker } from '../utils/events/dispatcherEventToWorker';

const offscreenCanvasesSupported = HTMLCanvasElement.prototype.transferControlToOffscreen !== undefined;

export function initRenderScript (
  root: HTMLElement,
  pathToScript: string
): Worker {
  const canvases = Array.from(root.querySelectorAll('canvas'));
  const WorkerConstructor = offscreenCanvasesSupported ? Worker : PseudoWorker;
  const worker = (new WorkerConstructor(pathToScript)) as Worker;

  canvases.forEach(updateCanvasSize);

  if (offscreenCanvasesSupported) {
    const offscreenCanvases = canvases.map(canvas => canvas.transferControlToOffscreen());

    typedPostMessage(
      worker,
      MessageType.INIT,
      { devicePixelRatio: PIXEL_RATIO, canvases: offscreenCanvases },
      offscreenCanvasesSupported ? offscreenCanvases : []
    );
  } else {
    typedPostMessage(worker, MessageType.INIT, {
      devicePixelRatio: PIXEL_RATIO,
      canvases: canvases as unknown as OffscreenCanvas[]
    });
  }

  const removeEventDispatcher = dispatcherEventToWorker(worker, root);
  const nativeTerminate = worker.terminate;

  worker.terminate = () => {
    nativeTerminate.call(worker);
    removeEventDispatcher();
  };

  return worker;
}

function updateCanvasSize (canvas: HTMLCanvasElement): void {
  const size = canvas.getBoundingClientRect();

  canvas.width = size.width * PIXEL_RATIO;
  canvas.height = size.height * PIXEL_RATIO;
}
