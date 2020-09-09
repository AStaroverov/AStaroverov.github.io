import { TaskQueue } from '../Scheduler/TaskQueue';

export class RootTaskQueue extends TaskQueue {
  private sheduled: boolean = false;

  public run (): void {
    if (this.sheduled) {
      this.sheduled = false;
      super.run();
    }
  }

  public schedule (): void {
    this.sheduled = true;
  }
}

export function createRootTaskQueue (): RootTaskQueue {
  return new RootTaskQueue();
}
