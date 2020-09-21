import { scheduler, TaskQueue, Task } from '../../src/lib/Scheduler';
import { BaseComponent } from '../../src/lib/BaseClasses/BaseComponent';
import { render } from '../../src/lib/Renderer/render';
import { getWorkerScope } from '../../src/lib/Worker/getWorkerScope';
import { Layer } from '../../src/lib/Layers/Layer';
import { LayersManager } from '../../src/lib/Layers/LayersManager';
import { getInitData } from '../../src/lib/Worker/getInitData';
import { withLayers } from '../../src/lib/mixins/withLayers';

main();

async function main (): Promise<void> {
  const workerScope = await getWorkerScope();
  const { canvases } = await getInitData(workerScope);
  const layersManager = new LayersManager({
    first: new Layer(canvases[0], 0),
    second: new Layer(canvases[1], 1)
  });

  const queue = new TaskQueue();

  scheduler.add(queue);

  (function tick () {
    scheduler.run();
    requestAnimationFrame(tick);
  })();

  class Coube extends
    withLayers(layersManager)(BaseComponent) {
    public props: { x: number, y: number, s: number};
    public state: { dx: number, dy: number } = { dx: 0, dy: 0 };

    protected layer: typeof layersManager.layers[keyof typeof layersManager.layers];
    protected r = 0;
    protected count = 0;
    protected delta = 0;

    constructor (props: Coube['props']) {
      super();

      this.props = props;

      if (Math.random() > 0.5) {
        this.layer = this.attachToLayer('first');
        queue.add(new Task(this.changeCoordinat, this));
      } else {
        this.layer = this.attachToLayer('second');
      }
    }

    protected render (): void {
      this.layer.ctx.fillRect(this.props.x + this.state.dx, this.props.y + this.state.dy, this.props.s, this.props.s);
    }

    protected changeCoordinat (): void {
      this.r = Math.random();
      this.delta += 0.01 * (this.r > 0.5 ? 1 : -1);
      this.count += this.delta;

      this.state.dx = Math.sin(this.count) * 10;
      this.state.dy = Math.cos(this.count) * 10;

      this.performRender();
    }
  }

  class Root extends BaseComponent {
    size = 50;
    rows = layersManager.list[0].canvas.width / this.size | 0;

    protected render (): void {
      layersManager.prepareToFrame();
      layersManager.list.forEach(l => {
        if (l.isDirty) {
          l.ctx.fillStyle = 'black';
          l.ctx.clearRect(0, 0, l.canvas.width, l.canvas.height);
        }
      });
    }

    protected connected (): void {
      super.connected();

      for (let i = 0; i < 1000; i += 1) {
        this.appendChild(
          new Coube(
            {
              x: (i % this.rows) * this.size,
              y: (i / this.rows | 0) * this.size,
              s: this.size
            }
          )
        );
      }
    }
  }

  render(workerScope, new Root());
}
