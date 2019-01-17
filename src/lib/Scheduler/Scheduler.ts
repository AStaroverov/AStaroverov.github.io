import { TaskQueue } from './TaskQueue';
import { Task } from './Task';

export class Scheduler {
  queues = [];

  private queuesUpdated = false;
  private cAF: number;
  private activeQueue: TaskQueue;
  private stopImmediately: boolean;

  add (queue: Task | TaskQueue) {
    this.queues.push(queue);
    this.queuesUpdated = true;
  }

  remove (queue: Task | TaskQueue) {
    const i = this.queues.indexOf(queue);

    if (i > -1) {
      this.queues.splice(i, 1);
    }
  }

  start () {
    this.stopImmediately = false;
    this.cAF = window.requestAnimationFrame(this.frame);
  }

  stopAfterFrame () {
    window.cancelAnimationFrame(this.cAF);
  }

  stop () {
    this.stopAfterFrame();

    if (this.activeQueue) {
      this.stopImmediately = true;
      this.activeQueue.stop();
    }
  }

  protected frame = (startTimestamp) => {
    if (this.queuesUpdated) {
      this.sortQueues();
      this.queuesUpdated = false;
    }

    for (var i = 0; i < this.queues.length; i += 1) {
      if (this.stopImmediately) { return; }
      (this.activeQueue = this.queues[ i ]).run(startTimestamp);
    }

    this.cAF = window.requestAnimationFrame(this.frame);
  }

  sortQueues () {
    this.queues = this.queues.sort((a, b) => a.order - b.order);
  }
}
