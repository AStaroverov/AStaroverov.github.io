import { TaskQueue } from "../Scheduler/TaskQueue";
import { CoreComponent } from "./CoreComponent";

export class ComponentQueue extends TaskQueue {
	public component: CoreComponent;

	public constructor(component: CoreComponent) {
		super();

		this.component = component;
	}

	public run (parent) {
		if (this.component.iterate()) {
			super.run(parent);
		}
	}
}

export class RootComponentQueue extends ComponentQueue {
	private sheduled: boolean = false;

	public run (parent) {
		if (this.sheduled) {
			this.sheduled = false;
			super.run(parent);
		}
	}

	schedule () {
		this.sheduled = true;
	}
}
