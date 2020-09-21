import { MessageType, typedListenMessage } from '../../Worker/messageType';
import { hitBoxService } from '../../Services/hitBoxServerice';
import { Knot } from '../../BaseClasses/Knot';
import { CanvasEvent, shouldPreventDefault, shouldStopImmediatePropagation, shouldStopPropagation } from './consts';
import { CanvasElement } from '../../BaseClasses/CanvasElement';

export function workerEventRedispatcher (workerScope: DedicatedWorkerGlobalScope): void {
  let lastHoveredKnot: CanvasElement;
  let lastHoveredKnots: CanvasElement[] = [];
  let mousedownKnot: CanvasElement;

  typedListenMessage(workerScope, MessageType.SEND_EVENT, ({ data }) => {
    const event = extendEvent(data.payload.event);

    switch (event.type) {
      case 'mousemove': {
        const hoveredKnots = hitBoxService.testPoint(
          event.clientX,
          event.clientY
        );

        const comp = hoveredKnots[0];

        if (comp !== undefined) {
          event.screenX -= comp.hitBoxData.minX;
          event.screenY -= comp.hitBoxData.minY;
        }

        const mouseover = { ...event, type: 'mouseover' };

        hoveredKnots.forEach((comp) => {
          comp.dispatchEvent(mouseover);
        });

        if (comp !== lastHoveredKnot) {
          if (!isChild(comp, lastHoveredKnot)) {
            bubbling(
              lastHoveredKnot,
              { ...event, type: 'mouseleave' },
              (target) => target !== comp
            );
          }

          if (!isChild(lastHoveredKnot, comp)) {
            bubbling(
              comp,
              { ...event, type: 'mouseenter' },
              (target) => target !== lastHoveredKnot
            );
          }
        } else {
          bubbling(lastHoveredKnot, event);
        }

        const mouseout = { ...event, type: 'mouseout' };

        lastHoveredKnots.forEach((comp) => {
          if (hoveredKnots.indexOf(comp) === -1) {
            comp.dispatchEvent(mouseout);
          }
        });

        lastHoveredKnot = comp;
        lastHoveredKnots = hoveredKnots;

        break;
      }
      case 'mousedown': {
        mousedownKnot = lastHoveredKnot;
        bubbling(lastHoveredKnot, event);
        break;
      }
      case 'mouseup': {
        bubbling(lastHoveredKnot, event);
        break;
      }
      case 'click': {
        if (mousedownKnot === lastHoveredKnot) {
          bubbling(lastHoveredKnot, event);
        }
        break;
      }
      case 'mouseleave':
      case 'mouseenter': {
        hitBoxService.root.dispatchEvent(event);

        break;
      }
    }
  });
}

function extendEvent<E extends Event, T extends Knot> (event: E): CanvasEvent<E & { path: T[] }> {
  Object.assign(event, {
    [shouldStopImmediatePropagation]: false,
    [shouldStopPropagation]: false,
    [shouldPreventDefault]: false,
    stopImmediatePropagation: () => {
      event[shouldStopImmediatePropagation] = true;
    },
    stopPropagation: () => {
      event[shouldStopPropagation] = true;
    },
    preventDefault: () => {
      event[shouldPreventDefault] = true;
    },
    path: [],
    composedPath: () => (event as any).path,
    currentTarget: null,
    target: null
  });

  return event as E & { path: T[] };
}

function bubbling<
  Target extends Knot,
  Ev extends CanvasEvent,
> (
  target: Target | undefined,
  event: Ev,
  whileFn: (target: Target) => boolean = () => true
): void {
  event.target = target || null;

  while (target && whileFn(target)) {
    event.path.unshift(target);
    event.currentTarget = target;

    target.dispatchEvent(event);

    if (!event[shouldStopPropagation]) {
      target = target.getParent();
    } else {
      break;
    }
  }
}

function isChild (target: Knot | undefined, parent: Knot): boolean {
  while (target) {
    if (target === parent) {
      return true;
    }

    target = target.getParent();
  }

  return false;
}
