import { MessageType, typedPostMessage } from '../messageType';
import { CanvasEvent, FIELDS_FOR_COPY } from './consts';
import { PIXEL_RATIO } from '../../utils';

export function dispatcherEventToWorker (worker: Worker, root: Element): VoidFunction {
  const redispatch = (event: MouseEvent): void => {
    const rect = root.getBoundingClientRect();
    const cloneEvent: CanvasEvent<MouseEvent> = createEventData(event);

    cloneEvent.clientX = PIXEL_RATIO * (event.clientX - rect.left);
    cloneEvent.clientY = PIXEL_RATIO * (event.clientY - rect.top);
    cloneEvent.x = cloneEvent.clientX;
    cloneEvent.y = cloneEvent.clientY;
    cloneEvent.movementX = PIXEL_RATIO * cloneEvent.movementX;
    cloneEvent.movementY = PIXEL_RATIO * cloneEvent.movementY;

    typedPostMessage(worker, MessageType.SEND_EVENT, { event: cloneEvent });
  };

  root.addEventListener('click', redispatch);
  root.addEventListener('mousemove', redispatch);
  root.addEventListener('mousedown', redispatch);
  root.addEventListener('mouseup', redispatch);
  root.addEventListener('mouseenter', redispatch);
  root.addEventListener('mouseleave', redispatch);

  return () => {
    root.removeEventListener('click', redispatch);
    root.removeEventListener('mousemove', redispatch);
    root.removeEventListener('mousedown', redispatch);
    root.removeEventListener('mouseup', redispatch);
    root.removeEventListener('mouseenter', redispatch);
    root.removeEventListener('mouseleave', redispatch);
  };
}

function createEventData<E extends Event> (event: E): CanvasEvent<E> {
  const eventData: CanvasEvent<E> = {} as any;

  FIELDS_FOR_COPY.forEach(key => {
    eventData[key] = event[key];
  });

  return eventData;
}
