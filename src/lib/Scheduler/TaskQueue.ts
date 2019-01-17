import { Task } from './Task';
import { noop } from './utils';

export type OptionsTaskQueue = {
  order?: number,
}
export class TaskQueue {
  order: number;
  queue = [];

  private queueUpdated = false;
  private stopImmediately: boolean = false;
  private requestClearQueue: number | undefined;

  constructor (options?: OptionsTaskQueue) {
    this.order = (options && options.order) || 0;
  }

  addTask (task: Task) {
    this.queue.push(task);
    this.queueUpdated = true;
  }

  scheduleTask (task: Task) {
    task.once = true;
    this.queue.push(task);
    this.queueUpdated = true;
  }

  removeTask (task: Task) {
    const i = this.queue.indexOf(task);

    if (i > -1) {
      this.queue.splice(i, 1);
    }
  }

  start (startTimestamp) {
    if (this.queueUpdated) {
      this.queueUpdated = false;
      this.sortQueue();
    }
    this.stopImmediately = false;

    for (var i = 0; i < this.queue.length; i += 1) {
      if (this.stopImmediately) { return; }
      this.queue[ i ].run(performance.now() - startTimestamp, this);
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
