import { typedListenMessage, MessageType, TMessageTypeToPayload } from './messageType';

export async function getInitData (
  workerScope: DedicatedWorkerGlobalScope
): Promise<TMessageTypeToPayload[MessageType.INIT]> {
  return await new Promise(resolve => {
    typedListenMessage(workerScope, MessageType.INIT, ({ data }) => {
      resolve(data.payload);
    });
  });
}
