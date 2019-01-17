import { TaskQueue } from '../Scheduler';

export class RootTaskQueue extends TaskQueue {
  scheduled: boolean = false;

  run (timestamp) {
    if (this.scheduled) {
      this.scheduled = false;

      super.run(timestamp)
    }
  }
}

export class ChildTaskQueue extends TaskQueue {
  scheduled: boolean = true;

  run (timestamp) {
    if (this.scheduled) {
      super.run(timestamp)
    }
  }
}
