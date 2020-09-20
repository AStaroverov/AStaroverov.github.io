import { BaseComponent } from '../BaseClasses/BaseComponent';
import { scheduler } from '../Scheduler';
import { updateRenderId } from './renderId';
import { zeroizeRenderIndex } from './renderIndex';

const EMPTY_ARRAY = Object.freeze([]) as unknown as any[];

export function render<Component extends BaseComponent> (rootComponent: Component): void {
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
}
