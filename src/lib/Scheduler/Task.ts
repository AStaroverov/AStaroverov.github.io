import { TaskQueue } from './TaskQueue';
import { noop } from '../utils';

export interface OptionsTask {
  order?: number
  once?: true
  context?: object
}

export class Task {
  fn: (frameTime?: number) => void;
  context: object | null;
  once: boolean;
  order: number;

  constructor (fn: () => (boolean | void), context: object | null, options?: OptionsTask) {
    this.fn = fn;
    this.context = context;

    this.once = Boolean(options?.once);
    this.order = options?.order ?? 0;
  }

  public run (queue: TaskQueue): boolean | void {
    const result = this.fn.call(this.context);

    if (this.once) {
      this.run = noop;
      queue.scheduleFilterItems();
    }

    return result;
  }
}
