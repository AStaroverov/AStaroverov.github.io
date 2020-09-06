import { scheduler, TaskQueue, Task } from './lib/Scheduler';
import { Component } from './lib/Renderer/Component';
import { render } from './lib/Renderer/render';
import { createElement } from './lib/Renderer/createElement';
import { TComponentData } from './lib/Renderer/types';

const queue = new TaskQueue();

(function tick () {
  scheduler.run();
  requestAnimationFrame(tick);
})();

class Coube extends Component {
  public props: { x: number, y: number, s: number};
  public state: { dx: number, dy: number } = { dx: 0, dy: 0 };

  protected v = Math.random();
  protected r = 0;
  protected count = 0;
  protected delta = 0;

  constructor (a, b) {
    super(a, b);

    if (this.v > 0.5) {
      this.attachToLayer(this.layers.map['1']);
      queue.add(new Task(this.changeCoordinat, this));
    } else {
      this.attachToLayer(this.layers.map['2']);
    }
  }

  protected render (): void {
    this.layer!.ctx.fillRect(this.props.x + this.state.dx, this.props.y + this.state.dy, this.props.s, this.props.s);
  }

  protected shouldUpdateChildren (): boolean {
    return false;
  }

  protected changeCoordinat (): void {
    this.v = Math.random() - 1;

    this.r = Math.random();
    this.delta += 0.01 * (this.r > 0.5 ? 1 : -1);
    this.count += this.delta;

    this.state.dx = Math.sin(this.count) * 10;
    this.state.dy = Math.cos(this.count) * 10;

    this.performRender();
  }
}

class Root extends Component {
  size = 50;
  rows = this.layers.list[0].canvas.width / this.size | 0;

  protected render (): void {
    this.layers.list.forEach(l => {
      if (l.isDirty) {
        l.ctx.fillStyle = 'black';
        l.ctx.clearRect(0, 0, l.canvas.width, l.canvas.height);
      }
    });
  }

  protected shouldUpdateChildren (): boolean {
    return this.firstUpdateChildren || false;
  }

  protected updateChildren (): TComponentData[] {
    const child: TComponentData[] = [];

    for (var i = 0; i < 1000; i += 1) {
      child.push(createElement(Coube, {
        x: (i % this.rows) * this.size,
        y: (i / this.rows | 0) * this.size,
        s: this.size
      }));
    }

    return child;
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
