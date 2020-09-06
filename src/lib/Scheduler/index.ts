import { Scheduler } from './Scheduler';
import { TaskQueue } from './TaskQueue';

export * from './Scheduler';
export * from './TaskQueue';
export * from './Task';

const scheduler = new Scheduler();
const taskQueue = new TaskQueue();

scheduler.add(taskQueue);

export { scheduler, taskQueue };
