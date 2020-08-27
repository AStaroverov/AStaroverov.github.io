import { Task, TaskQueue } from '../Scheduler';
import {Layer} from "../Layers/Layer";
import {Layers} from "../Layers/Layers";

type TOptions = {
  readonly key?: string;
  readonly ref?: ((inst: any) => void) | string;
};

type TCompData = {
  scheduled: boolean,
  parent: CoreComponent,
  schedule: VoidFunction,
  task: Task | TaskQueue,
  childQueue: TaskQueue,
  children: Map<string, CoreComponent>,
  childrenKeys: string[],
  prevChildrenArr: CoreComponent[],
  updated: boolean,
};

const fakeEmptyOptions: TOptions = {};

export abstract class CoreComponent {
  public $: object = {};
  public layers: Layers;
  public layer: Layer;
  public context: any;
  public __comp: TCompData;

  constructor (...args: any[])
  constructor (parent: CoreComponent) {
    this.context = parent.context;
    this.layers = parent.layers;

    this.__comp = {
      scheduled: false,
      parent: parent instanceof CoreComponent ? parent : void 0,
      schedule: parent.__comp.schedule,
      task: new Task(this.iterate, this),
      childQueue: new TaskQueue(),
      children: undefined,
      childrenKeys: undefined,
      prevChildrenArr: undefined,
      updated: false,
    };
  }

  public attachToLayer(l: Layer) {
    if (l === this.layer) {
      return;
    }

    if (this.layer) {
      this.layer.willDirty = true;
    }

    this.layer = l;
    this.layer.willDirty = true;
  }

  public performRender () {
    if (this.layer) {
      this.layer.willDirty = true;
    }

    this.__comp.schedule();
  }

  public getParent (): CoreComponent | void {
    return this.__comp.parent;
  }

  public setContext (context: object) {
    Object.assign(this.context, context);
    this.performRender();
  }

  protected unmount () {}
  protected abstract render ()
  protected updateChildren (): void | CoreComponent[] {}

  protected setProps (props: object) {}

  private __unmount () {
    this.__unmountChildren();
    this.unmount();
    this.performRender();
  }

  protected iterate () {
    if (this.layer !== undefined ? this.layer.isDirty : true) {
      this.render();
    }

    return true;
  }

  protected __updateChildren () {
    let nextChildrenArr = this.updateChildren();

    if (typeof nextChildrenArr === "undefined") {
      nextChildrenArr = [];
    }

    const __comp = this.__comp;
    const childQueue = __comp.childQueue;
    const children = __comp.children || new Map();
    const childrenKeys = __comp.childrenKeys || [];
    const nextChildrenKeys = __comp.childrenKeys = [];

    if (nextChildrenArr === __comp.prevChildrenArr) return;

    let key;
    let ref;
    let child;
    let instance;
    let currentChild;

    __comp.prevChildrenArr = nextChildrenArr;

    childQueue.clearItems();

    if (nextChildrenArr.length === 0) {
      if (childrenKeys.length > 0) {
        for (let i= 0; i < childrenKeys.length; i += 1) {
          key = childrenKeys[i];
          child = children.get(key);

          child.__unmount();
          children.delete(key);
        }
      }

      return;
    }

    if (childrenKeys.length === 0) {
      if (nextChildrenArr.length > 0) {
        for (let i= 0; i < nextChildrenArr.length; i += 1) {
          child = nextChildrenArr[i];
          key = child.options.hasOwnProperty('key')
            ? child.options.key
            : `${child.klass.name}|${i}|defaultKey`;
          ref = child.options.ref;
          children.set(key, instance = new child.klass(this, child.props));

          if (typeof ref === 'function') {
            ref(instance);
          } else if (typeof ref === 'string') {
            this.$[ref] = instance;
          }

          nextChildrenKeys.push(key);
          childQueue.add(instance.__comp.task);
        }
      }

      return;
    }

    const childForMount = [];
    const keyForMount = [];

    for (let i = 0; i < nextChildrenArr.length; i += 1) {
      child = nextChildrenArr[i];
      key = child.options.hasOwnProperty('key')
        ? child.options.key
        : `${child.klass.name}|${i}|defaultKey`;
      currentChild = children.get(key);

      nextChildrenKeys.push(key);

      if (
        currentChild !== undefined
        && currentChild instanceof child.klass
        && currentChild.constructor === child.klass
      ) {
        currentChild.__setProps(child.props);
        currentChild.__comp.updated = true;
      } else {
        childForMount.push(child);
        keyForMount.push(key);
      }
    }

    for (let i = 0; i < childrenKeys.length; i += 1) {
      key = childrenKeys[i];

      if (!children.has(key)) {
        continue;
      }

      child = children.get(key);

      if (child.__comp.updated === true) {
        child.__comp.updated = false;
      } else {
        child.__unmount();
        children.delete(key);
      }
    }

    for (let i = 0; i < childForMount.length; i += 1) {
      child = childForMount[i];
      key = keyForMount[i];
      ref = child.options.ref;
      children.set(key, instance = new child.klass(this, child.props));

      if (typeof ref === 'function') {
        ref(instance);
      } else if (typeof ref === 'string') {
        this.$[ref] = instance;
      }
    }

    for (let i = 0; i < nextChildrenKeys.length; i += 1) {
      childQueue.add(children.get(nextChildrenKeys[ i ]).__comp.task);
    }
  }

  private __unmountChildren () {
    if (this.__comp.childQueue) {
      const children = this.__comp.children;
      const childrenKeys = this.__comp.childrenKeys;

      for (let i= 0; i < childrenKeys.length; i += 1) {
        children.get(childrenKeys[i]).__unmount();
      }
    }
  }

  static create (props?: object, options: TOptions = fakeEmptyOptions) {
    return { props, options, klass: this };
  }
}
