import { Task } from './Task';
import { noop } from './utils';

export type OptionsItems = {
  order?: number,
}
export class TaskQueue {
  public order: number;
  public items = [];

  protected stopImmediately: boolean = false;
  protected sheduledFilterItems: boolean = false;
  protected sheduledFilterItemsCount: number = 0;

  constructor (options?: OptionsItems) {
    this.order = options?.order || 0;
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
    const l = this.items.length;
    let i = 0;

    while (i < l) {
      if (this.items[ i++ ].run(this) === false) {
        break;
      }
    }

    if (this.sheduledFilterItems && this.sheduledFilterItemsCount > 10) {
      this.filterItems();
    }
  }

  sheduleFilterItems () {
    this.sheduledFilterItemsCount += 1;
    this.sheduledFilterItems = true;
  }

  filterItems () {
    this.sheduledFilterItemsCount = 0;
    this.sheduledFilterItems = false;
    this.items = this.items.filter((task) => task.run !== noop);
  }

  clearItems () {
    this.items = [];
  }
}
