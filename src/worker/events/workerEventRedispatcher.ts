import { MessageType, typedListenMessage } from '../messageType';
import { Knot } from '../../prototypes/Knot';
import { CanvasEvent, shouldPreventDefault, shouldStopImmediatePropagation, shouldStopPropagation } from './consts';
import { CanvasElement } from '../../prototypes/CanvasElement';
import { TPrivateContext } from '../../BaseComponent';
import { vec2, mat4 } from 'gl-matrix';

export function workerEventRedispatcher (
  workerScope: DedicatedWorkerGlobalScope,
  privateContext: TPrivateContext
): void {
  let lastHoveredKnot: CanvasElement;
  let lastHoveredKnots: CanvasElement[] = [];
  let mousedownKnot: CanvasElement;

  typedListenMessage(workerScope, MessageType.SEND_EVENT, ({ data }) => {
    const event = extendEvent(data.payload.event);

    if (event.type.indexOf('mouse') > -1 || event.type.indexOf('touch') > -1) {
      mutateTargetEvent(event as unknown as CanvasEvent<MouseEvent>, privateContext.globalTransformMatrix);
    }

    switch (event.type) {
      case 'mousemove': {
        const mouseEvent = (event as unknown as CanvasEvent<MouseEvent>);
        const hoveredKnots = privateContext.hitBoxService.testPoint(
          mouseEvent.clientX,
          mouseEvent.clientY
        );

        if (hoveredKnots.length === 0) {
          hoveredKnots[0] = privateContext.root as CanvasElement;
        }

        const comp = hoveredKnots[0];

        if (comp !== undefined) {
          mouseEvent.screenX -= comp.hitBoxData.minX;
          mouseEvent.screenY -= comp.hitBoxData.minY;
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
      case 'mouseenter':
      case 'keydown':
      case 'keyup':
      case 'keypress': {
        privateContext.root.dispatchEvent(event);

        break;
      }
      case 'wheel': {
        bubbling(lastHoveredKnot, event);
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

const tmpPoint: vec2 = [0, 0];
const tmp2Point: vec2 = [0, 0];
function mutateTargetEvent (event: CanvasEvent<MouseEvent>, matrix: mat4): void {
  tmp2Point[0] = event.clientX;
  tmp2Point[1] = event.clientY;

  vec2.transformMat4(tmpPoint, tmp2Point, matrix);

  event.clientX = tmpPoint[0];
  event.clientY = tmpPoint[1];
  event.x = event.clientX;
  event.y = event.clientY;
}
