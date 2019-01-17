import { Task } from './Task';
import { noop } from './utils';

export type OptionsTaskQueue = {
  order?: number,
}
export class TaskQueue {
  once: boolean;
  order: number;
  queue = [];

  private queueUpdated = false;
  private stopImmediately: boolean = false;
  private requestClearQueue: number | undefined;

  constructor (options?: OptionsTaskQueue) {
    this.order = (options && options.order) || 0;
  }

  add (task: Task | TaskQueue) {
    this.queue.push(task);
    this.queueUpdated = true;
  }

  schedule (task: Task | TaskQueue) {
    task.once = true;
    this.queue.push(task);
    this.queueUpdated = true;
  }

  remove (task: Task | TaskQueue) {
    const i = this.queue.indexOf(task);

    if (i > -1) {
      this.queue.splice(i, 1);
    }
  }

  run (startTimestamp) {
    if (this.queueUpdated) {
      this.queueUpdated = false;
      this.sortQueue();
    }

    this.stopImmediately = false;

    for (var i = 0; i < this.queue.length; i += 1) {
      if (this.stopImmediately) { return; }
      this.queue[ i ].run(startTimestamp, this);
    }
  }

  stop () {
    this.stopImmediately = true;
  }

  sortQueue () {
    this.queue = this.queue.sort((a, b) => a.order - b.order);
  }

  clearQueue () {
    if (this.requestClearQueue !== undefined) { return; }
    // @ts-ignore
    this.requestClearQueue = window.requestIdleCallback(() => {
      this.requestClearQueue = undefined;
      this.queue = this.queue.filter((task) => task.run !== noop);
    });
  }
}


