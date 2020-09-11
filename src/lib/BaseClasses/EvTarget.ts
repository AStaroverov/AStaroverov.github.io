export const KEY_EVEN_TARGET = Symbol('EventEmitter field for save in component');
export const KEY_STOP_PROPAGATION = Symbol('Key for save state in event');

type TEventType = string;

export class EvTarget implements EventTarget {
  private eventsMap: Record<TEventType, EventListenerOrEventListenerObject[]> = {};

  public hasEventListener (type): boolean {
    return this.eventsMap.type !== undefined;
  }

  public addEventListener (type: TEventType, listener: EventListenerOrEventListenerObject): void {
    if (Array.isArray(this.eventsMap[type])) {
      this.eventsMap[type].push(listener);
    } else {
      this.eventsMap[type] = [listener];
    }
  }

  public removeEventListener (type: TEventType, listener: EventListenerOrEventListenerObject): void {
    if (Array.isArray(this.eventsMap[type])) {
      const i = this.eventsMap[type].indexOf(listener);

      if (i !== -1) {
        this.eventsMap[type].splice(i, 1);
      }
    }
  }

  public dispatchEvent (event): boolean {
    const bubbles = event.bubbles || false;

    if (event[KEY_STOP_PROPAGATION] === undefined) {
      event[KEY_STOP_PROPAGATION] = false;
      event.stopPropagation = () => {
        event[KEY_STOP_PROPAGATION] = true;
      };
    }

    this.fireEvent(event);

    if (bubbles && !event[KEY_STOP_PROPAGATION]) {
      return dipping(this as any, event);
    }

    return false;
  }

  public hasListener (type: TEventType): boolean {
    return this.eventsMap !== undefined && this.eventsMap[type] !== undefined;
  }

  public fireEvent<Ev extends Event> (event: Ev): void {
    if (!this.hasListener(event.type)) {
      return;
    }

    const listeners: EventListenerOrEventListenerObject[] = this.eventsMap[event.type];

    for (let i = 0; i < listeners.length; i += 1) {
      const listener = listeners[i];

      if (typeof listener === 'function') {
        listener(event);
      } else if (typeof listener === 'object' && typeof listener.handleEvent === 'function') {
        listener.handleEvent(event);
      }
    }
  }
}

function dipping<
  Target extends EvTarget & { getParent: () => Target | undefined },
  Ev extends Event
> (target: Target, event: Ev): boolean {
  const parent = target.getParent();

  if (parent === undefined) {
    return false;
  }

  const eventTarget: EvTarget = parent[KEY_EVEN_TARGET];

  if (eventTarget === undefined) {
    return dipping(parent, event);
  }

  parent.fireEvent(event);

  if (event[KEY_STOP_PROPAGATION]) {
    return false;
  }

  return dipping(parent, event);
}
