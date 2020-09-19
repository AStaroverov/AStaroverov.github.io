import { initRenderScript } from '../../src/lib/Worker/initRenderScript';

initRenderScript(
  [...document.getElementById('root')!.querySelectorAll('canvas')],
  '/dist/triangles/worker.js'
);
