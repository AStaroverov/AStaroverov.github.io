import { Task } from './Task';

let id = 1;
export class TaskQueue {
  public id = id++;

  protected items: Int32Array = new Int32Array(100);

  private writeIndex: number = 0;

  protected stopImmediately: boolean = false;
  protected sheduledFilterItems: boolean = false;
  protected sheduledFilterItemsCount: number = 0;
  
  private mapIndexToTask = new Map<number, Task | TaskQueue>();

  add (task: Task | TaskQueue) {
    this.items[this.writeIndex++] = task.id;
    this.mapIndexToTask.set(task.id, task);

    if (this.writeIndex === this.items.length) {
      const tmp = this.items;

      this.items = new Int32Array(this.items.length * 10);
      this.items.set(tmp)
    }
  }

  remove (task: Task | TaskQueue) {
    const i = this.items.indexOf(task.id);

    if (i > -1) {
      this.items[i] = 0;
      this.mapIndexToTask.delete(task.id)
      this.sheduledFilterItemsCount += 1;
      this.sheduledFilterItems = true;
    }
  }

  run () {
    let i = 0;
    let id;

    while (i < this.writeIndex) {
      id = this.items[i++];

      if (id === 0) {
        continue;
      }

      if (this.mapIndexToTask.get(id).run(this) === false) {
        break;
      }
    }

    if (this.sheduledFilterItems && this.sheduledFilterItemsCount > 10) {
      this.filterItems();
    }
  }

  filterItems () {
    this.sheduledFilterItemsCount = 0;
    this.sheduledFilterItems = false;

    let writeIndex = 0;

    for (let i = 0; i < this.writeIndex; i++) {
      if (this.items[i] !== 0) {
        this.items[writeIndex++] = this.items[i];
      }
    }

    this.writeIndex = writeIndex;
  }

  clearItems () {
    this.writeIndex = 0;
    this.mapIndexToTask.clear();
  }
}
