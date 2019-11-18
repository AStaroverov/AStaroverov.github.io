import { Task } from './Task';
import { noop } from './utils';

export type OptionsItems = {
  order?: number,
}
export class TaskQueue {
  public order: number;
  public items = [];

  protected stopImmediately: boolean = false;
  protected requestClearItems: number | undefined;

  constructor (options?: OptionsItems) {
    this.order = (options && options.order) || 0;
  }

  add (task: Task | TaskQueue) {
    this.items.push(task);
  }

  remove (task: Task | TaskQueue) {
    const i = this.items.indexOf(task);

    if (i > -1) {
      this.items.splice(i, 1);
    }
  }

  run () {
    if (this.items.length === 0) { return; }

    this.stopImmediately = false;

    for (var i = 0; i < this.items.length; i += 1) {
      if (this.stopImmediately) { return; }
      
      this.items[ i ].run(this);
    }
  }

  stop () {
    this.stopImmediately = true;
  }

  filterItems () {
    if (this.requestClearItems !== undefined) { return; }
    // @ts-ignore
    this.requestClearItems = window.requestIdleCallback(() => {
      this.requestClearItems = undefined;
      this.items = this.items.filter((task) => task.run !== noop);
    });
  }

  clearItems () {
    this.items = [];
  }
}
