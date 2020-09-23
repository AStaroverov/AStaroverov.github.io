export enum MessageType {
  INIT,
  SEND_EVENT
}

export interface TMessageTypeToPayload {
  [MessageType.INIT]: {
    devicePixelRatio: number
    canvases: OffscreenCanvas[]
  }
  [MessageType.SEND_EVENT]: {
    event: MouseEvent
  }
}

export function typedPostMessage<Type extends MessageType, Payload extends TMessageTypeToPayload[Type]> (
  ctx: Worker | DedicatedWorkerGlobalScope, type: Type, payload: Payload, transfer: Transferable[] = []
): void {
  try {
    ctx.postMessage({ type, payload }, transfer);
  } catch (err: unknown) {
    throw new Error(`Can't send message to worker - ${(err as Error).message}`);
  }
}

export function typedListenMessage<Type extends MessageType, Payload extends TMessageTypeToPayload[Type]> (
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
