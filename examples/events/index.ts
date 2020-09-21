import { initRenderScript } from '../../src/lib/Worker/initRenderScript';

initRenderScript(
  document.getElementById('root')!,
  '/dist/events/worker.js'
);
