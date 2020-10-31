import { promiseFont } from '../utils/loadFont';
import { scheduler } from '../../lib/Scheduler';
import { getWorkerScope } from '../../lib/Renderer/src/worker/getWorkerScope';
import { getInitData } from '../../lib/Renderer/src/worker/getInitData';

export async function init (): Promise<{
  workerScope: DedicatedWorkerGlobalScope
  canvases: OffscreenCanvas[]
  devicePixelRatio: number
}> {
  const workerScope = await getWorkerScope();
  const { canvases, devicePixelRatio } = await getInitData(workerScope);

  const a = await promiseFont;

  console.log(a);

  (function tick () {
    scheduler.traverse();
    requestAnimationFrame(tick);
  })();

  return {
    workerScope,
    canvases,
    devicePixelRatio
  };
}
