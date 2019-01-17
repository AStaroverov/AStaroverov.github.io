import { TaskQueue } from './TaskQueue';
import { noop } from './utils';

export type OptionsTask = {
  order?: number,
  once?: true,
  context?: any,
}
export class Task {
  fn: (frameTime?: number) => void;
  once: boolean;
  order: number;
  context: any;

  constructor (fn, options?: OptionsTask) {
    this.fn = fn;
    this.once = options && options.once || false;
    this.order = (options && options.order) || 0;
    this.context = (options && options.context) || null;
  }

  run (frameDuration: number, queue: TaskQueue) {
    this.fn.call(this.context, frameDuration);

    if (this.once) {
      this.run = noop;
      queue.clearQueue();
    }
  }
}
