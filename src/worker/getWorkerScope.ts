import { MessageType, typedPostMessage } from './messageType';

export function getWorkerScope (): DedicatedWorkerGlobalScope {
  let scope: DedicatedWorkerGlobalScope;

  if (globalThis.document === undefined) {
    scope = globalThis as unknown as DedicatedWorkerGlobalScope;
  } else {
    scope = globalThis.__workerContext__;
    globalThis.__workerContext__ = undefined;
  }

  if (scope === undefined) {
    throw new Error('worker scope is undefined');
  }

  typedPostMessage(scope, MessageType.WORKER_INIT);

  return scope;
}
