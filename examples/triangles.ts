import { scheduler, TaskQueue, Task } from '../src/lib/Scheduler';
import { Component } from '../src/lib/Renderer/Component';
import { render } from '../src/lib/Renderer/render';
import { createElement } from '../src/lib/Renderer/createElement';
import { TComponentData } from '../src/lib/Renderer/types';
import { CoreComponent } from '../src/lib/Renderer/CoreComponent';

const queue = new TaskQueue();

(function tick () {
  scheduler.run();
  requestAnimationFrame(tick);
})();

const targetSize = 24;

class Dot extends Component {
  props: {
    x: number
    y: number
    s: number
  };

  p1: { x: number, y: number } = { x: 0, y: 0 };
  p2: { x: number, y: number } = { x: 0, y: 0 };
  p3: { x: number, y: number } = { x: 0, y: 0 };

  constructor (a, b) {
    super(a, b);

    this.attachToLayer(this.layers.map['1']);
  }

  render (): void {
    const props = this.props;
    const ctx = this.layer!.ctx;
    const halfS = props.s / 2;
    const x = props.x + halfS;
    const y = props.y + halfS;

    this.p1.x = x;
    this.p1.y = y;

    this.p2.x = x - halfS;
    this.p2.y = y + halfS;

    this.p3.x = x + halfS;
    this.p3.y = y + halfS;

    rotatePoint(this.p1, this.context, this.context.angle);
    rotatePoint(this.p2, this.context, this.context.angle);
    rotatePoint(this.p3, this.context, this.context.angle);

    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.lineTo(this.p3.x, this.p3.y);
    ctx.lineTo(this.p1.x, this.p1.y);
  }
}

class Triangle extends Component {
  props: {
    x: number
    y: number
    s: number
    children: TComponentData<Triangle> | TComponentData<Dot>
  };

  protected shouldUpdateChildren (nextProps): boolean {
    const o = this.props;
    const n = nextProps;

    return !(
      o.x === n.x &&
      o.y === n.y &&
      o.s === n.s
    );
  };

  updateChildren (): Array<TComponentData<Triangle> | TComponentData<Dot>> {
    let { s, x, y } = this.props;

    if (s <= targetSize) {
      return [
        createElement(Dot, {
          x: x - (targetSize / 2),
          y: y - (targetSize / 2),
          s: targetSize
        })
      ];
    }

    s /= 2;

    return [
      createElement(
        Triangle,
        {
          x,
          y: y - (s / 2),
          s
        }
      ),
      createElement(
        Triangle,
        {
          x: x - s,
          y: y + (s / 2),
          s
        }
      ),
      createElement(
        Triangle,
        {
          x: x + s,
          y: y + (s / 2),
          s
        }
      )
    ];
  }
}

class Fill extends CoreComponent {
  protected render (): void {
    this.layers.list.forEach(l => {
      if (l.isDirty) {
        l.ctx.closePath();
        l.ctx.fill();
      }
    });
  }
}

class Root extends Component {
  constructor (a, b) {
    super(a, b);

    this.context = {
      x: this.layers.list[0].canvas.width / 2,
      y: this.layers.list[0].canvas.height / 2,
      angle: 0
    };

    queue.add(new Task(() => {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      this.context.angle = this.context.angle + 0.01;
      this.layers.update();
      this.performRender();
    }));
  }

  protected render (): void {
    this.layers.list.forEach(l => {
      if (l.isDirty) {
        l.ctx.fillStyle = 'blue';
        l.ctx.clearRect(0, 0, l.canvas.width, l.canvas.height);
        l.ctx.beginPath();
      }
    });
  }

  protected shouldUpdateChildren (): boolean {
    return this.firstUpdateChildren || false;
  }

  protected updateChildren (): TComponentData[] {
    return [
      createElement(
        Triangle,
        {
          x: this.context.x,
          y: this.context.y,
          s: 800
        }
      ),
      createElement(Fill)
    ];
  }
}

async function main (): Promise<void> {
  await render(
    createElement(Root)
  );

  scheduler.add(queue);
}

// eslint-disable-next-line
main();

function rotatePoint<T extends { x: number, y: number }> (point: T, pivotPoint: T, angle: number): T {
  const s: number = Math.sin(angle);
  const c: number = Math.cos(angle);

  // translate point back to origin:
  point.x -= pivotPoint.x;
  point.y -= pivotPoint.y;

  // rotate point
  const newX: number = point.x * c - point.y * s;
  const newY: number = point.x * s + point.y * c;

  // translate point back:
  point.x = newX + pivotPoint.x;
  point.y = newY + pivotPoint.y;

  return point;
}
