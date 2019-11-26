import { TaskQueue, scheduler } from '../Scheduler';
import { ComponentQueue, RootComponentQueue } from './TaskQueue';

type TOptions = {
  readonly key?: string;
  readonly ref?: ((inst: any) => void) | string;
};

type TCoreComponentObject = {
  props: object,
  klass: typeof CoreComponent,
  options: TOptions,
}

const fakeEmptyOptions: TOptions = {};

export class CoreComponent {
  public $: object = {};
  public key: string;
  public context: any;
  public parent: CoreComponent;

  public shouldUpdateChildren: boolean = true;
  public shouldRenderChildren: boolean = true;

  private __schedule: VoidFunction
  private __compQueue: TaskQueue;
  private __mapKeyToChildren: Map<string, CoreComponent>

  constructor (...args: any[])
  constructor (parent: CoreComponent | void) {
    if (parent) {
      this.context = parent.context;
      this.parent = parent;

      this.__compQueue = new ComponentQueue(this);
      this.__schedule = parent.__schedule;
    } else {
      this.context = {};
      this.parent = undefined;

      this.__compQueue = new RootComponentQueue(this);
      this.__schedule = (this.__compQueue as RootComponentQueue).schedule.bind(this.__compQueue);
    }

    this.performRender();
  }

  public performRender () {
    this.__schedule();
  }

  public getParent (): CoreComponent | void {
    return this.parent;
  }

  public setContext (context: object) {
    Object.assign(this.context, context);
    this.performRender();
  }

  public setProps (props: object) {}

  protected unmount () {}
  protected render () {}
  protected updateChildren (): void | TCoreComponentObject[] {}

  private __unmount () {
    this.__unmountChildren();
    this.unmount();
    this.performRender();
  }

  public iterate () {
    this.render();

    return this.shouldRenderChildren;
  }

  protected __updateChildren () {
    let nextChildren = this.updateChildren();

    if (typeof nextChildren === "undefined") {
      nextChildren = [];
    }

    this.performRender();

    const compQueue = this.__compQueue;
    const mapKeyToChild = this.__mapKeyToChildren || (this.__mapKeyToChildren = new Map());

    let key: string | undefined;
    let ref: string | ((comp: CoreComponent) => void);
    let child: CoreComponent;
    let childObject: TCoreComponentObject;

    if (nextChildren.length === 0) {
      if (compQueue.writeIndex > 0) {
        for (let i= 0; i < compQueue.writeIndex; i += 1) {
          (compQueue.mapIdToItem.get(compQueue.itemIds[i]) as ComponentQueue)
            .component.__unmount();
        }
      }

      compQueue.clear();
      mapKeyToChild.clear();
      return;
    }

    if (compQueue.writeIndex === 0) {
      if (nextChildren.length > 0) {
        for (let i= 0; i < nextChildren.length; i += 1) {
          childObject = nextChildren[i];
          key = childObject.options.hasOwnProperty('key')
            ? childObject.options.key
            : `${childObject.klass.name}|${i}|defaultKey`;
          ref = childObject.options.ref;
          child = new childObject.klass(this, childObject.props);
          child.key = key;

          if (typeof ref === 'function') {
            ref(child);
          } else if (typeof ref === 'string') {
            this.$[ref] = child;
          }

          compQueue.add(child.__compQueue);
          mapKeyToChild.set(key, child);
        }
      }
      return;
    }

    const prevLength = compQueue.writeIndex;
    const prevItemIds = compQueue.itemIds.slice(0, compQueue.writeIndex);
    const existItemIds = new Uint32Array(compQueue.writeIndex);
    
    compQueue.writeIndex = 0;

    for (let i = 0, j = 0; i < nextChildren.length; i += 1) {
      childObject = nextChildren[i];
      key = childObject.options.hasOwnProperty('key')
        ? childObject.options.key
        : `${childObject.klass.name}|${i}|defaultKey`;

      child = mapKeyToChild.get(key);

      if (child) {
        existItemIds[j++] = compQueue.itemIds[i] = child.__compQueue.id;
        child.setProps(childObject.props);
      } else {
        child = new childObject.klass(this, childObject.props);
        child.key = key;

        if (typeof ref === 'function') {
          ref(child);
        } else if (typeof ref === 'string') {
          this.$[ref] = child;
        }

        compQueue.add(child.__compQueue);
        mapKeyToChild.set(key, child);
      }
    }

    let length = 0;

    for (let i = 0, j = 0; i < prevLength; i++) {
      if (prevItemIds[i] === existItemIds[j]) {
        j++;
      } else {
        length++;
        prevItemIds[i - j] = prevItemIds[i];
      }
    }
    
    for (let i = 0; i < length; i++) {
      child = (compQueue.mapIdToItem.get(prevItemIds[i]) as ComponentQueue).component;
      child.__unmount();
      compQueue.mapIdToItem.delete(prevItemIds[i]);
      mapKeyToChild.delete(child.key);
    }
  }

  private __unmountChildren () {
    if (this.__compQueue) {
      const length = this.__compQueue.writeIndex;

      for (let i= 0; i < length; i += 1) {
        (this.__compQueue.mapIdToItem.get(
          this.__compQueue.itemIds[i]
        ) as ComponentQueue).component.__unmount();
      }
    }
  }

  static create (props?: object, options: TOptions = fakeEmptyOptions): TCoreComponentObject {
    return { props, options, klass: this };
  }

  static mount (Component: typeof CoreComponent, ...args: unknown[]) {
    const root = new Component(undefined, ...args);
    
    scheduler.add(root.__compQueue);

    return root;
  }

  static unmount (instance) {
    instance.__unmount();
  }
}
