export function getWorkerScope (): DedicatedWorkerGlobalScope {
  if (globalThis.document === undefined) {
    return globalThis as unknown as DedicatedWorkerGlobalScope;
  }

  const scope = globalThis.__workerContext__;

  if (scope === undefined) {
    throw new Error('worker scope is undefined');
  }

  globalThis.__workerContext__ = undefined;

  return scope;
}
