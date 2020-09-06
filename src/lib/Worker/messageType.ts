import { TLayerProps } from '../Layers/Layer';

export enum MessageType {
  INIT,
  SORT_LAYERS,
}

export interface TMesageTypeToPayload {
  [MessageType.INIT]: {
    layersProps: TLayerProps[]
    canvases: OffscreenCanvas[] | HTMLCanvasElement[]
  }
  [MessageType.SORT_LAYERS]: TLayerProps[]
}

export function typedPostMessage<Type extends MessageType, Payload extends TMesageTypeToPayload[Type]> (
  ctx: Worker | DedicatedWorkerGlobalScope, type: Type, payload: Payload, transfer: Transferable[] = []
): void {
  ctx.postMessage({ type, payload }, transfer);
}

export function typedListenMessage<Type extends MessageType, Payload extends TMesageTypeToPayload[Type]> (
  ctx: Worker | DedicatedWorkerGlobalScope,
  type: Type,
  listener: (event: MessageEvent<{ type: Type, payload: Payload}>) => void
): VoidFunction {
  const cb = (event): void => {
    if (event.data.type === type) {
      listener(event);
    }
  };
  ctx.addEventListener('message', cb);

  return () => ctx.removeEventListener('message', cb);
}
