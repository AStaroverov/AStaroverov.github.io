import { TaskQueue } from './TaskQueue';

let id = 0;

export class Task {
  public id = id++;
  public fn: (frameTime?: number) => void;
  public context: object | void;
  public once: boolean;

  public constructor (fn: () => boolean | void, context: object, once: boolean = false) {
    this.fn = fn;
    this.context = context;
    this.once = once;
  }

  public run (queue: TaskQueue): boolean | void {
    if (this.once) {
      queue.remove(this);
    }

    return this.fn.call(this.context);
  }
}
