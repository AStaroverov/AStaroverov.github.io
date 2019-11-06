import { TaskQueue } from './TaskQueue';
import { Task } from './Task';

export class Scheduler extends TaskQueue {
  private cAF: number;
  private activeItem: Task | TaskQueue;

  start () {
    this.stopImmediately = false;
    this.cAF = window.requestAnimationFrame(this.frame);
  }

  stopAfterEndFrame () {
    window.cancelAnimationFrame(this.cAF);
  }

  stop () {
    this.stopAfterEndFrame();

    if (this.activeItem) {
      this.stopImmediately = true;

      if (this.activeItem instanceof TaskQueue) {
        this.activeItem.stop();
      }
    }
  }

  protected frame = () => {
    this.run();
    this.cAF = window.requestAnimationFrame(this.frame);
  }
}
