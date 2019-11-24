import { TaskQueue } from './TaskQueue';

export class Scheduler extends TaskQueue {
  private cAF: number;

  start () {
    this.stopImmediately = false;
    this.cAF = window.requestAnimationFrame(this.frame);
  }

  stopAfterEndFrame () {
    window.cancelAnimationFrame(this.cAF);
  }

  stop () {
    this.stopAfterEndFrame();
  }

  protected frame = () => {
    this.run();
    this.cAF = window.requestAnimationFrame(this.frame);
  }
}
