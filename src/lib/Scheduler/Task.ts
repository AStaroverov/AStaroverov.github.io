import { TaskQueue } from './TaskQueue';
import { noop } from './utils';

export type OptionsTask = {
  order?: number,
  once?: true,
  context?: any,
  passive?: boolean,
}
export class Task {
  static PASSIVE_EDGE = 15;

  fn: (frameTime?: number) => void;
  once: boolean;
  order: number;
  context: any;
  passive: boolean;

  constructor (fn, options?: OptionsTask) {
    this.fn = fn;
    this.once = options && options.once;
    this.order = (options && options.order) || 0;
    this.context = (options && options.context) || null;
    this.passive = (options && options.passive) || false;
  }

  run (frameDuration: number, queue: TaskQueue) {
    if (frameDuration < Task.PASSIVE_EDGE) {
      this.fn.call(this.context, frameDuration);

      if (this.once) {
        this.run = noop;
        queue.clearQueue();
      }
    }
  }
}
