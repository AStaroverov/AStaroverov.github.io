import { BaseComponent, PRIVATE_CONTEXT } from './BaseComponent';
import { scheduler } from '../../Scheduler';
import { updateRenderId } from './prototypes/helpers/renderId';
import { zeroizeRenderIndex } from './prototypes/helpers/renderIndex';
import { workerEventRedispatcher } from './worker/events/workerEventRedispatcher';
import { HitBoxService } from './prototypes/helpers/hitBoxServerice';
import { mat4 } from 'gl-matrix';

const EMPTY_ARRAY = Object.freeze([]) as unknown as any[];

export function render<Component extends BaseComponent> (
  workerScope: DedicatedWorkerGlobalScope,
  rootComponent: Component
): void {
  const onlyRoot = [rootComponent];

  let scheduled = true;
  // eslint-disable-next-line new-cap
  rootComponent.context = rootComponent.context || {};
  rootComponent[PRIVATE_CONTEXT] = {
    root: rootComponent,
    hitBoxService: new HitBoxService(),
    globalTransformMatrix: mat4.create(),
    scheduleUpdate: (): void => {
      scheduled = true;
    }
  };
  // @ts-expect-error
  rootComponent.connected();

  scheduler.add({
    run () {},
    next (): Component[] {
      if (scheduled) {
        scheduled = false;

        zeroizeRenderIndex();
        updateRenderId();

        return onlyRoot;
      }

      return EMPTY_ARRAY;
    }
  });

  workerEventRedispatcher(workerScope, rootComponent[PRIVATE_CONTEXT]);
}
