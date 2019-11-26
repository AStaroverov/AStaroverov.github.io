import { Task } from './Task';

let id = 1;

export class TaskQueue {
  public id = id++;
  public once: boolean;
  public writeIndex: number = 0;
  public itemIds: Int32Array = new Int32Array(100);
  public mapIdToItem = new Map<number, Task | TaskQueue>();

  protected sheduledFilterItems: boolean = false;
  protected sheduledFilterItemsCount: number = 0;
  
  constructor(once: boolean = false) {
    this.once = once;
  }

  add (task: Task | TaskQueue) {
    this.itemIds[this.writeIndex++] = task.id;
    this.mapIdToItem.set(task.id, task);

    if (this.writeIndex === this.itemIds.length) {
      const tmp = this.itemIds;

      this.itemIds = new Int32Array(this.itemIds.length * 10);
      this.itemIds.set(tmp)
    }
  }

  remove (task: Task | TaskQueue) {
    const i = this.itemIds.indexOf(task.id);

    if (i > -1) {
      this.itemIds[i] = 0;
      this.mapIdToItem.delete(task.id)
      this.sheduledFilterItemsCount += 1;
      this.sheduledFilterItems = true;
    }
  }

  run (parent: TaskQueue) {
    let i = 0;
    let id;

    while (i < this.writeIndex) {
      id = this.itemIds[i++];

      if (id === 0) {
        continue;
      }

      this.mapIdToItem.get(id).run(this);
    }

    if (this.once) {
      parent.remove(this);
      return;
    }

    if (this.sheduledFilterItems && this.sheduledFilterItemsCount > 10) {
      this.removeZeros();
    }
  }

  clear () {
    this.writeIndex = 0;
    this.mapIdToItem.clear();
  }

  private removeZeros () {
    this.sheduledFilterItemsCount = 0;
    this.sheduledFilterItems = false;

    let writeIndex = 0;

    for (let i = 0; i < this.writeIndex; i++) {
      if (this.itemIds[i] !== 0) {
        this.itemIds[writeIndex++] = this.itemIds[i];
      }
    }

    this.writeIndex = writeIndex;
  }
}
