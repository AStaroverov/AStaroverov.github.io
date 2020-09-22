import { scheduler, TaskQueue } from '../../src/lib/Scheduler';
import { render } from '../../src/lib/Renderer/render';
import { BaseComponent } from '../../src/lib/BaseClasses/BaseComponent';
import { getInitData } from '../../src/lib/Worker/getInitData';
import { getWorkerScope } from '../../src/lib/Worker/getWorkerScope';
import { CanvasEvent } from '../../src/lib/utils/events/consts';
import { LayersManager } from '../../src/lib/Layers/LayersManager';
import { Layer } from '../../src/lib/Layers/Layer';
import { withLayers } from '../../src/lib/mixins/withLayers';

main();

async function main (): Promise<void> {
  const workerScope = await getWorkerScope();
  const { canvases } = await getInitData(workerScope);
  const canvas = canvases[0];
  const layersManager = new LayersManager({
    connections: new Layer(canvases[0], 0),
    nodes: new Layer(canvases[1], 1),
    dragging: new Layer(canvases[2], 2)
  });
  const queue = new TaskQueue();

  scheduler.add(queue);

  (function tick () {
    scheduler.traverse();
    requestAnimationFrame(tick);
  })();

  const colors = [
    'red', 'purple', 'green', 'grey', 'blue'
  ];

  type TNodProps = { id: number, x: number, y: number, size: number, color: string };

  class Nod extends withLayers(layersManager)(BaseComponent) {
    public dragging = false;
    private layer: Layer;

    constructor (
      public props: TNodProps
    ) {
      super();

      this.setHitBox(this.props.x, this.props.y, this.props.size + this.props.x, this.props.size + this.props.y);
      this.addEventListener('mousedown', this.onDragStart);
      root.addEventListener('mousemove', this.onMove);
      root.addEventListener('mouseup', this.onDragEnd);
      root.addEventListener('mouseleave', this.onDragEnd);
    }

    protected connected (): void {
      super.connected();

      this.layer = this.attachToLayer('nodes');
    }

    protected render (): void {
      const ctx = this.layer.ctx;

      ctx.fillStyle = this.props.color;
      ctx.fillRect(this.props.x, this.props.y, this.props.size, this.props.size);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = this.dragging ? 4 : 1;
      ctx.strokeRect(this.props.x, this.props.y, this.props.size, this.props.size);
      ctx.fillStyle = 'black';
      ctx.fillText(String(this.props.id), this.props.x + this.props.size / 2, this.props.y + this.props.size / 2);
    }

    private onMove = (event: CanvasEvent<MouseEvent>): void => {
      if (this.dragging) {
        this.props.x += event.movementX;
        this.props.y += event.movementY;
        this.performRender();
      }
    };

    private onDragStart = (event: CanvasEvent<MouseEvent>): void => {
      this.dragging = true;
      this.layer = this.attachToLayer('dragging');
      this.zIndex = 1;
      this.performRender();
    };

    private onDragEnd = (event: CanvasEvent<MouseEvent>): void => {
      if (this.dragging) {
        this.dragging = false;
        this.layer = this.attachToLayer('nodes');
        this.zIndex = 0;
        this.setHitBox(this.props.x, this.props.y, this.props.size + this.props.x, this.props.size + this.props.y);
        this.performRender();
      }
    };
  }

  type TConProps = {
    id: number
    node1: Nod
    node2: Nod
    color: string
  };
  class Con extends withLayers(layersManager)(BaseComponent) {
    private layer: Layer;

    constructor (
      public props: TConProps
    ) {
      super();
    }

    protected connected (): void {
      super.connected();

      this.layer = this.attachToLayer('connections');
    }

    public run (): void {
      if (this.props.node1.dragging || this.props.node2.dragging) {
        this.layer = this.attachToLayer('dragging');
      } else {
        this.layer = this.attachToLayer('connections');
      }

      super.run();
    }

    protected render (): void {
      const ctx = this.layer.ctx;

      ctx.beginPath();
      ctx.moveTo(
        this.props.node1.props.x,
        this.props.node1.props.y
      );
      ctx.lineTo(
        this.props.node2.props.x,
        this.props.node2.props.y
      );
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  class Root extends BaseComponent {
    private nodes = [...Array(100)].map((_, i) => {
      return {
        id: i,
        x: Math.floor(Math.random() * 1800),
        y: Math.floor(Math.random() * 1700),
        size: 50 + Math.floor(Math.random() * 50),
        color: colors[Math.floor(Math.random() * 5)]
      };
    });

    protected connected (): void {
      super.connected();

      this.setHitBox(0, 0, canvas.width, canvas.height);
      this.updateChildren();
    }

    protected render (): void {
      layersManager.prepareToFrame();
      layersManager.list.forEach(l => {
        if (l.isDirty) {
          l.ctx.clearRect(0, 0, canvas.width, canvas.height);
          l.ctx.textAlign = 'center';
          l.ctx.font = '24px serif';
        }
      });
    }

    protected updateChildren (): void {
      this.nodes.forEach((node, i) => {
        this.appendChild(new Nod(node));
      });

      this.nodes.forEach((node, i) => {
        for (let j = 0; j < 5; j++) {
          const node1 = this.children[Math.floor(Math.random() * this.nodes.length)] as Nod;
          const node2 = this.children[Math.floor(Math.random() * this.nodes.length)] as Nod;

          this.appendChild(new Con({
            id: i,
            color: colors[Math.floor(Math.random() * 5)],
            node1,
            node2
          }));
        }
      });
    }
  }

  const root = new Root();

  render(workerScope, root);
}
