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

        event.type = 'mouseover';
        hoveredKnots.forEach((comp) => {
          comp.dispatchEvent(event);
        });

        if (comp !== lastHoveredKnot) {
          const commonParent = findCommonParent(comp, lastHoveredKnot);

          event.type = 'mouseleave';
          bubbling(
            lastHoveredKnot,
            event,
            (target) => target !== commonParent
          );

          event.type = 'mouseenter';
          bubbling(
            comp,
            event,
            (target) => target !== commonParent
          );
        } else {
          event.type = 'mousemove';
          bubbling(lastHoveredKnot, event);
        }

        event.type = 'mouseout';
        lastHoveredKnots.forEach((comp) => {
          if (hoveredKnots.indexOf(comp) === -1) {
            comp.dispatchEvent(event);
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
  event.path = [];
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

function findCommonParent (t1: Knot, t2: Knot): Knot {
  const path1 = createPath(t1);
  const path2 = createPath(t2);

  let commonParent: Knot = path1[path1.length];
  let i = path1.length - 1;
  let j = path2.length - 1;

  while (i >= 0 && j >= 0) {
    if (path1[i] === path2[j]) {
      commonParent = path1[i];
    } else {
      break;
    }

    i -= 1;
    j -= 1;
  }

  return commonParent;
}

function createPath (target: Knot | undefined): Knot[] {
  const path: Knot[] = [];

  while (target) {
    path.push(target);
    target = target.getParent();
  }

  return path;
}
