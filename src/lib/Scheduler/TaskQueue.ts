import { Task } from './Task';
import { noop } from '../utils';

export interface OptionsItems {
  order?: number
}
export class TaskQueue {
  public order: number;
  public items: Array<Task | TaskQueue> = [];

  protected stopImmediately: boolean = false;
  protected sheduledFilterItems: boolean = false;
  protected sheduledFilterItemsCount: number = 0;

  constructor (options?: OptionsItems) {
    this.order = options?.order || 0;
  }

  public add (task: Task | TaskQueue): void {
    this.items.push(task);
  }

  public remove (task: Task | TaskQueue): void {
    const i = this.items.indexOf(task);

    if (i > -1) {
      this.items.splice(i, 1);
    }
  }

  public run (): void {
    const l = this.items.length;
    let i = 0;

    while (i < l) {
      if (this.items[i++].run(this) === false) {
        break;
      }
    }

    if (this.sheduledFilterItems && this.sheduledFilterItemsCount > 10) {
      this.filterItems();
    }
  }

  public scheduleFilterItems (): void {
    this.sheduledFilterItemsCount += 1;
    this.sheduledFilterItems = true;
  }

  public clearItems (): void {
    this.items = [];
  }

  protected filterItems (): void {
    this.sheduledFilterItemsCount = 0;
    this.sheduledFilterItems = false;
    this.items = this.items.filter((task) => task.run !== noop);
  }
}
