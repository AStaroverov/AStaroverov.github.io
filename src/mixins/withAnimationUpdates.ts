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
  Base extends TComponentConstructor
> (base: Base) {
  return class WithAnimationUpdates extends base {
    private animationId = getId();

    public startAnimation (): void {
      if (getContext(this).animatedIds.size === 0) {
        getContext(this).animated = true;
        scheduler.add(getContext(this).animationTask);
      }

      getContext(this).animatedIds.add(this.animationId);
    }

    public stopAnimation (): void {
      getContext(this).animatedIds.delete(this.animationId);

      if (getContext(this).animatedIds.size === 0) {
        getContext(this).animated = false;
        scheduler.remove(getContext(this).animationTask);
      }
    }

    protected connected (): void {
      super.connected();

      if (getContext(this).animatedIds === undefined) {
        getContext(this).animatedIds = new Set();
        getContext(this).animationTask = {
          run: () => {
            this.requestUpdate();
          }
        };
      }
    }
  };
}

function getContext (inst: BaseComponent): TAnimationUpdatesContext {
  return inst.context as TAnimationUpdatesContext;
}
