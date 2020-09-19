export enum MessageType {
  INIT,
}

export interface TMesageTypeToPayload {
  [MessageType.INIT]: {
    canvases: OffscreenCanvas[] | HTMLCanvasElement[]
  }
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
