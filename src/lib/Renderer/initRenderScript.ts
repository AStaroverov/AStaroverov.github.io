import { TLayerProps } from '../Layers/Layer';
import { MessageType, typedListenMessage, typedPostMessage } from '../Worker/messageType';
import { Canvases } from '../Layers/Canvases';
import { PseudoWorker } from '../Worker';

const offscreenCanvasesSupported = HTMLCanvasElement.prototype.transferControlToOffscreen !== undefined;

export function initRenderScript (
  container: HTMLElement,
  layersProps: TLayerProps[],
  pathToScript: string
): Worker {
  const WorkerConstructor = offscreenCanvasesSupported ? Worker : PseudoWorker;
  const canvases = new Canvases(
    container,
    layersProps
  );

  const worker = (new WorkerConstructor(pathToScript)) as Worker;

  if (offscreenCanvasesSupported) {
    const offscreenCanvases = canvases.list.map(canvas => canvas.transferControlToOffscreen());

    typedPostMessage(
      worker,
      MessageType.INIT, {
        layersProps,
        canvases: offscreenCanvases
      },
      offscreenCanvasesSupported ? offscreenCanvases : []
    );
  } else {
    typedPostMessage(
      worker,
      MessageType.INIT, {
        layersProps,
        canvases: canvases.list
      }
    );
  }

  typedListenMessage(worker, MessageType.SORT_LAYERS, ({ data }) => {
    data.payload.forEach((layersProps: TLayerProps) => {
      canvases.setCanvasZIndex(layersProps.name, layersProps.index);
    });
  });

  return worker;
}
