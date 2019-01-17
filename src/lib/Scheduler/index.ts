import { Scheduler } from './Scheduler';
import { TaskQueue } from './TaskQueue';

export * from './Scheduler';
export * from './TaskQueue';
export * from './Task';

export const scheduler = new Scheduler();
export const taskQueue = new TaskQueue();

scheduler.addQueue(taskQueue);
