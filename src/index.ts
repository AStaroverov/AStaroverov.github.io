import {scheduler} from "./lib/Scheduler";
import {renderWorker} from "./lib/Renderer/renderWorker";
import {render} from "./lib/Renderer/render";

(function tick() {
  scheduler.run();
  globalThis.requestAnimationFrame(tick);
})();

render(
  document.getElementById('root'),
  [
    { name: '1', index: 1 },
    { name: '2', index: 2 },
  ],
  '/dist/worker.js'
);


