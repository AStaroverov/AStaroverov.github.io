import { initRenderScript } from '../../src/lib/Worker/initRenderScript';

initRenderScript(
  document.getElementById('root')!,
  '/dist/triangles/worker.js'
);
