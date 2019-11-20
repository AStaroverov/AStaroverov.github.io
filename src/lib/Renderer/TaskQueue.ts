import { TaskQueue } from "../Scheduler/TaskQueue";

export class RootTaskQueue extends TaskQueue {
	private sheduled: boolean = false;

	public run () {
		if (this.sheduled) {
			this.sheduled = false;
			super.run();
		}
	}

	schedule () {
		this.sheduled = true;
	}
}

export const rootTaskQueue: RootTaskQueue = new RootTaskQueue();
