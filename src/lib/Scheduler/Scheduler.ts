import { TaskQueue } from './TaskQueue';

export class Scheduler extends TaskQueue {
  private cAF: number;

  start () {
    this.stopImmediately = false;
  }

  stopAfterEndFrame () {
    window.cancelAnimationFrame(this.cAF);
  }

  stop () {
    this.stopAfterEndFrame();
  }
}
