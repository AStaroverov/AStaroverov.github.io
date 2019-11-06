export * from './Scheduler';
export * from './TaskQueue';
export * from './Task';

import { Scheduler } from './Scheduler';
import { TaskQueue } from './TaskQueue';

const scheduler = new Scheduler();
const taskQueue = new TaskQueue();

scheduler.add(taskQueue);

export { scheduler, taskQueue }
