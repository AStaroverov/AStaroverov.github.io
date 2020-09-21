import { BaseComponent } from '../BaseClasses/BaseComponent';
import { scheduler } from '../Scheduler';
import { updateRenderId } from './renderId';
import { zeroizeRenderIndex } from './renderIndex';
import { workerEventRedispatcher } from '../utils/events/workerEventRedispatcher';
import { hitBoxService } from '../Services/hitBoxServerice';
import { CanvasElement } from '../BaseClasses/CanvasElement';

const EMPTY_ARRAY = Object.freeze([]) as unknown as any[];

export function render<Component extends BaseComponent> (
  workerScope: DedicatedWorkerGlobalScope,
  rootComponent: Component
): void {
  const onlyRoot = [rootComponent];
  let scheduled = true;
  // eslint-disable-next-line new-cap
  rootComponent.context = {};
  // @ts-expect-error
  rootComponent.privateContext = {
    scheduleUpdate: (): void => {
      scheduled = true;
    }
  };
  hitBoxService.setRoot(rootComponent as CanvasElement);
  // @ts-expect-error
  rootComponent.connected();

  scheduler.add({
    run () {
      zeroizeRenderIndex();
      updateRenderId();
    },
    next (): Component[] {
      if (scheduled) {
        scheduled = false;

        return onlyRoot;
      }

      return EMPTY_ARRAY;
    }
  });

  workerEventRedispatcher(workerScope);
}
