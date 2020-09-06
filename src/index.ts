import { scheduler } from './lib/Scheduler';
import { initRenderScript } from './lib/Renderer/initRenderScript';

(function tick () {
  scheduler.run();
  globalThis.requestAnimationFrame(tick);
})();

initRenderScript(
  document.getElementById('root')!,
  [
    { name: '1', index: 1 },
    { name: '2', index: 2 }
  ],
  '/dist/worker.js'
);
