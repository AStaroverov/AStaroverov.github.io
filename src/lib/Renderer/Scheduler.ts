import { Node } from './Tree';
import { taskQueue, Task } from '../Scheduler';

export class Scheduler {
  private sheduled: boolean = false;
  private root: Node;
  private task = new Task(this.update, { context: this });

  constructor () {
    taskQueue.addTask(this.task);
  }

  destroy () {
    taskQueue.removeTask(this.task);
  }

  setRoot (root: Node) {
    this.root = root;
  }

  update () {
    this.sheduled = false;
    this.root && this.root.traverseDown(this.iterator);
  }

  iterator (node: Node) {
    return node.data.iterate();
  }

  scheduleUpdate () {
    if (this.sheduled) { return; }

    this.sheduled = true;
  }
}
