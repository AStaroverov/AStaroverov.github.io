import { initRenderScript } from '../lib/Renderer/src/initRenderScript';

initRenderScript(
  document.getElementById('root')!,
  '/dist/worker.js'
);
