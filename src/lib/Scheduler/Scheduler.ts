import { TaskQueue } from './TaskQueue';

export class Scheduler extends TaskQueue {
  private readonly cAF: number;

  public start (): void {
    this.stopImmediately = false;
  }

  public stopAfterEndFrame (): void {
    window.cancelAnimationFrame(this.cAF);
  }

  public stop (): void {
    this.stopAfterEndFrame();
  }
}
