import { TaskQueue } from './TaskQueue';

let id = 0;

export class Task {
  static PASSIVE_EDGE = 15;

  id = id++;
  fn: (frameTime?: number) => void;
  context: object | void;
  once: boolean;

  constructor (fn: () => boolean | void, context: object, once: boolean = false) {
    this.fn = fn;
    this.context = context;
    this.once = once;
  }

  run (queue: TaskQueue): boolean | void {
    if (this.once) {
      queue.remove(this);
    }

    return this.fn.call(this.context);
  }
}
