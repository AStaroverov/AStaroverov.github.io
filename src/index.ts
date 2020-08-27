import { scheduler, TaskQueue, Task } from './lib/Scheduler';
import { Component } from './lib/Renderer/Component';
import {render} from "./lib/Renderer/render";
import {Layer} from "./lib/Layers/Layer";

const queue = new TaskQueue();
const container = document.getElementById('root');
const rect = container.getBoundingClientRect();

scheduler.add(queue);

(function tick() {
  scheduler.run();
  window.requestAnimationFrame(tick);
})();

class Coube extends Component {
  v = Math.random();
  r = 0;
  count = 0;
  delta = 0;
  props: { x: number, y: number, s: number};
  state: { dx: number, dy: number } = { dx: 0, dy: 0 };

  constructor(a, b) {
    super(a, b);

    if (this.v > 0.5) {
      this.attachToLayer(this.layers.map['1']);
      queue.add(new Task(this.changeCoordinat, this));
    } else {
      this.attachToLayer(this.layers.map['2']);
    }
  }

  render () {
    this.layer.ctx.fillRect(this.props.x + this.state.dx, this.props.y + this.state.dy, this.props.s, this.props.s);
  }

  shouldUpdateChildren() {
    return false;
  }

  changeCoordinat() {
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
  size = 10;
  rows = rect.width / this.size | 0;

  render () {
    this.layers.list.forEach(l => {
      if (l.isDirty) {
        l.ctx.fillStyle = 'black';
        l.ctx.clearRect(0, 0, rect.width, rect.height);
      }
    })
  }

  shouldUpdateChildren () {
    return this.firstUpdateChildren || false;
  }

  updateChildren () {
    const child = [];

    for (var i = 0; i < 10000; i += 1) {
      child.push(Coube.create({
        x: (i % this.rows) * this.size,
        y: (i / this.rows | 0) * this.size,
        s: this.size,
      }));
    }

    return child;
  }
}

render(
  container,
  Root.create(),
  [
    new Layer('1', 1),
    new Layer('2', 2),
  ]
);
