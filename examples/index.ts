import { initRenderScript } from '../src/lib/Renderer/initRenderScript';

initRenderScript(
  document.getElementById('root')!,
  [
    { name: '1', index: 1 },
    { name: '2', index: 2 }
  ],
  '/dist/withEvents.js'
);
