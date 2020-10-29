import { TComponentConstructor } from '../../lib/Renderer/src/types';
import { BaseComponent } from '../../lib/Renderer/src/BaseComponent';
import { scheduler } from '../../lib/Scheduler';

export type TAnimationUpdatesContext = {
  animated: boolean
  animatedIds: Set<number>
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

    private task = {
      run: () => {
        this.requestUpdate();
      }
    };

    public startAnimation (): void {
      if (this.context.animatedIds.size === 0) {
        this.context.animated = true;
        scheduler.add(this.task);
      }

      this.context.animatedIds.add(this.animationId);
    }

    public stopAnimation (): void {
      this.context.animatedIds.delete(this.animationId);

      if (this.context.animatedIds.size === 0) {
        this.context.animated = false;
        scheduler.remove(this.task);
      }
    }

    protected connected (): void {
      super.connected();

      if (!this.context.animatedIds) {
        this.context.animatedIds = new Set();
      }
    }
  };
}
