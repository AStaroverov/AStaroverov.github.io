import { typedListenMessage, MessageType } from "./messageType";

export function getOffscreenCanvases (
  workerScope: DedicatedWorkerGlobalScope
): Promise<OffscreenCanvas[]> {
  return new Promise(resolve => {
    typedListenMessage(workerScope, MessageType.INIT, ({ data }) => {
      resolve(data.payload.canvases as OffscreenCanvas[]);
    });
  });
}
