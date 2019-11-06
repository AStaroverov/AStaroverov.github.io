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
  context: object | void;
  once: boolean;
  order: number;
  passive: boolean;

  constructor (fn: () => boolean | void, context: object, options?: OptionsTask) {
    this.fn = fn;
    this.context = context;

    this.once = options && options.once;
    this.order = (options && options.order) || 0;
    this.passive = (options && options.passive) || false;
  }

  run (queue: TaskQueue) {
    if (this.fn.call(this.context) === false) {
      queue.stop();
    }
    
    if (this.once) {
      this.run = noop;
      queue.filterItems();
    }
  }
}
