import { initRenderScript } from '../../src/lib/Worker/initRenderScript';

initRenderScript(
  document.getElementById('root')!,
  '/dist/squares/worker.js'
);
