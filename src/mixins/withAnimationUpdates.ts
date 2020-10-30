import { ITask, TComponentConstructor } from '../../lib/Renderer/src/types';
import { BaseComponent } from '../../lib/Renderer/src/BaseComponent';
import { scheduler } from '../../lib/Scheduler';

export type TAnimationUpdatesContext = {
  animated: boolean
  animatedIds: Set<number>
  animationTask: ITask
};

let animationId = 0;
function getId (): number {
  return animationId++;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function withAnimationUpdates<
  Base extends TComponentConstructor<BaseComponent>
> (base: Base) {
  return class WithAnimationUpdates extends base {
    public context: TAnimationUpdatesContext;
    private animationId = getId();

    public startAnimation (): void {
      if (this.context.animatedIds.size === 0) {
        this.context.animated = true;
        scheduler.add(this.context.animationTask);
      }

      this.context.animatedIds.add(this.animationId);
    }

    public stopAnimation (): void {
      this.context.animatedIds.delete(this.animationId);

      if (this.context.animatedIds.size === 0) {
        this.context.animated = false;
        scheduler.remove(this.context.animationTask);
      }
    }

    protected connected (): void {
      super.connected();

      if (this.context.animatedIds === undefined) {
        this.context.animatedIds = new Set();
        this.context.animationTask = {
          run: () => {
            this.requestUpdate();
          }
        };
      }
    }
  };
}
