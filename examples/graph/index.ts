import { initRenderScript } from '../../src/lib/Worker/initRenderScript';

initRenderScript(
  document.getElementById('root')!,
  '/dist/graph/worker.js'
);
