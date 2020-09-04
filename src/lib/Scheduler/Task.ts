import { TaskQueue } from './TaskQueue';
import { noop } from './utils';

export type OptionsTask = {
  order?: number,
  once?: true,
  context?: object,
}

export class Task {
  fn: (frameTime?: number) => void;
  context: object | void;
  once: boolean;
  order: number;

  constructor (fn: () => boolean | void, context: object, options?: OptionsTask) {
    this.fn = fn;
    this.context = context;

    this.once = options && options.once;
    this.order = (options && options.order) || 0;
  }

  run (queue: TaskQueue): boolean | void {
    const result = this.fn.call(this.context);

    if (this.once) {
      this.run = noop;
      queue.sheduleFilterItems();
    }

    return result;
  }
}
