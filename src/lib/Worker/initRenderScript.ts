import { MessageType, typedPostMessage } from './messageType';
import { PseudoWorker } from '.';
import { PIXEL_RATIO } from '../utils';

const offscreenCanvasesSupported = HTMLCanvasElement.prototype.transferControlToOffscreen !== undefined;

export function initRenderScript (
  canvases: HTMLCanvasElement[],
  pathToScript: string
): Worker {
  const WorkerConstructor = offscreenCanvasesSupported ? Worker : PseudoWorker;
  const worker = (new WorkerConstructor(pathToScript)) as Worker;

  canvases.forEach(updateCanvasSize);

  if (offscreenCanvasesSupported) {
    const offscreenCanvases = canvases.map(canvas => canvas.transferControlToOffscreen());

    typedPostMessage(
      worker,
      MessageType.INIT, {
        canvases: offscreenCanvases
      },
      offscreenCanvasesSupported ? offscreenCanvases : []
    );
  } else {
    typedPostMessage(
      worker,
      MessageType.INIT, {
        canvases: canvases
      }
    );
  }

  return worker;
}

function updateCanvasSize (canvas: HTMLCanvasElement): void {
  const size = canvas.getBoundingClientRect();

  canvas.width = size.width * PIXEL_RATIO;
  canvas.height = size.height * PIXEL_RATIO;
}
