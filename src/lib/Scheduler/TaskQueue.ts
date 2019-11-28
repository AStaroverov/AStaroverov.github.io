import { Task } from './Task';
import { noop } from './utils';

const emptyTask = new Task(noop, undefined);

export class TaskQueue {
  public once: boolean;
  public writeIndex: number = 0;
  public items: (Task | TaskQueue)[] = new Array(100);

  protected sheduledFilterItems: boolean = false;
  protected sheduledFilterItemsCount: number = 0;

  constructor(once: boolean = false) {
    this.once = once;
  }

  add (task: Task | TaskQueue) {
    this.items[this.writeIndex++] = task;

    if (this.writeIndex === this.items.length) {
      this.items.length = this.items.length * 10;
    }
  }

  remove (task: Task | TaskQueue) {
    const i = this.items.indexOf(task);

    if (i !== -1) {
      this.items[i] = emptyTask;
      this.sheduledFilterItemsCount += 1;
      this.sheduledFilterItems = true;
    }
  }

  run (parent: TaskQueue) {
    for (let i = 0; i < this.writeIndex; i++) {
      this.items[i].run(this);
    }

    if (this.once) {
      parent.remove(this);
    } else if (this.sheduledFilterItems && this.sheduledFilterItemsCount > 10) {
      this.removeEmptyItems()
    }
  }

  clear () {
    this.writeIndex = 0;
    this.items.length = 0;
  }

  private removeEmptyItems () {
    this.sheduledFilterItemsCount = 0;
    this.sheduledFilterItems = false;

    let writeIndex = 0;

    for (let i = 0; i < this.writeIndex; i++) {
      if (this.items[i] !== emptyTask) {
        this.items[writeIndex++] = this.items[i];
      }
    }

    this.writeIndex = writeIndex;
  }
}
