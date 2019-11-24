import { scheduler, TaskQueue, Task } from './lib/Scheduler';
import { Component } from './lib/Renderer/Component';
import { layers } from './service/layers';

const queue = new TaskQueue();

scheduler.start();

layers.appendTo(document.getElementById('root'));

class Coube extends Component {
  count = 0;
  delta = 0;
  props: { x: number, y: number, s: number};
  state: { dx: number, dy: number } = { dx: 0, dy: 0 };

  constructor(a, b) {
    super(a, b);

    queue.add(new Task(this.changeCoordinat, this));
  }

  render () {
    this.canvas.begin();
    this.canvas.fillRect(this.props.x + this.state.dx, this.props.y + this.state.dy, this.props.s, this.props.s);
    this.canvas.end();
  }

  shouldUpdateChildren() {
    return false;
  }

  changeCoordinat() {
    if (Math.random() > 0.9) {
      this.delta += 0.1;
      this.count += this.delta;

      this.state.dx = Math.sin(this.count) * 10;
      this.state.dy = Math.cos(this.count) * 10;

      this.performRender();
    }
  }
}

class Root extends Component {
  size = 6;
  rows = layers.$canvas.width / this.size | 0;

  constructor (...args) {
    super(...args);

    this.context.canvas = layers.$canvas;
    this.context.ctx = layers.$canvas.getContext('2d');
  }

  render () {
    this.canvas.begin();
    this.canvas.fillStyle = 'black';
    this.canvas.clearRect(0, 0, layers.$canvas.width, layers.$canvas.height);
    this.canvas.end();
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

Component.mount(Root);
scheduler.add(queue);
