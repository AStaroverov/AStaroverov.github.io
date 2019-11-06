import { scheduler } from './lib/Scheduler';
import { Component } from './lib/Renderer/Component';
import { layers } from './service/layers';

scheduler.start();

layers.appendTo(document.getElementById('root'));

class Coube extends Component {
  count = 0;
  delta = 0;
  props: { x: number, y: number, s: number};
  state: { dx: number, dy: number } = { dx: 0, dy: 0 };

  render () {
    this.context.ctx.fillRect(this.props.x + this.state.dx, this.props.y + this.state.dy, this.props.s, this.props.s);
  }

  didIterate () {
    super.didIterate();

    this.delta += 0.01 * (Math.random() > 0.5 ? 1 : -1);
    this.count += this.delta;

    this.state.dx = Math.sin(this.count) * 10;
    this.state.dy = Math.cos(this.count) * 10;
  }
}

class Root extends Component {
  size = 12;
  rows = layers.$canvas.width / this.size | 0;

  constructor (...args) {
    super(...args);

    this.context.canvas = layers.$canvas;
    this.context.ctx = layers.$canvas.getContext('2d');
  }

  render () {
    const ctx = this.context.ctx;

    ctx.fillStyle = 'black';
    ctx.clearRect(0, 0, layers.$canvas.width, layers.$canvas.height);
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

  didIterate () {
    this.performRender();
  }
}

Component.mount(Root);
