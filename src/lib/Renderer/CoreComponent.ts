import { scheduler, TaskQueue, Task } from '../Scheduler';
import { RootTaskQueue, ChildTaskQueue } from './scheduler';

type TOptions = {
  readonly key?: string;
  readonly ref?: ((inst: any) => void) | string;
};

type TCompData = {
  parent: CoreComponent | undefined,
  children: object,
  childrenKeys: string[],
  prevChildrenArr: object[],
  updated: boolean,
  task: Task,
  childTaskQueue: ChildTaskQueue,
};

const fakeEmptyOptions: TOptions = {};

export abstract class CoreComponent {
  public $: object = {};
  public context: any;
  public __comp: TCompData;

  constructor (...args: any[])
  constructor (props: object | void, parent: CoreComponent | TFakeParentData) {
    this.context = parent.context;
    this.__comp = {
      parent: parent instanceof CoreComponent ? parent : undefined,
      task: new Task(this.iterate, { context: this }),
      updated: false,
      children: {},
      childrenKeys: [],
      childTaskQueue: new ChildTaskQueue(),
      prevChildrenArr: [],
    };

    parent.__comp.childTaskQueue.add(this.__comp.task);
    parent.__comp.childTaskQueue.add(this.__comp.childTaskQueue);
  }

  public performRender () {
    this.context.scheduleUpdate();
  }

  public getParent (): CoreComponent | void {
    return this.__comp.parent;
  }

  public setContext (context: object) {
    Object.assign(this.context, context);
    this.performRender();
  }

  protected unmount () {}
  protected abstract iterate ()
  protected abstract render ()
  protected updateChildren (): void | object[] {}

  protected setProps (props: object) {}

  private __unmount () {
    this.__unmountChildren();
    this.unmount();
    this.performRender();
  }

  protected __updateChildren () {
    const nextChildrenArr = this.updateChildren();

    if (typeof nextChildrenArr === 'undefined') return;

    const __comp = this.__comp;
    const children = __comp.children;
    const childrenKeys = __comp.childrenKeys;
    const nextChildrenKeys = __comp.childrenKeys = [];

    if (nextChildrenArr === __comp.prevChildrenArr) return;

    let key;
    let ref;
    let child;
    let currentChild;
    __comp.prevChildrenArr = nextChildrenArr;

    if (nextChildrenArr.length === 0) {
      if (childrenKeys.length > 0) {
        for (let i= 0; i < childrenKeys.length; i += 1) {
          key = childrenKeys[i];
          child = children[key];

          child.__unmount();
          children[key] = void 0;
        }
      }

      return;
    }

    if (childrenKeys.length === 0) {
      if (nextChildrenArr.length > 0) {
        for (let i= 0; i < nextChildrenArr.length; i += 1) {
          child = nextChildrenArr[i];
          key = child.options.hasOwnProperty('key') ? child.options.key : `${child.klass.name}|${i}|defaultKey`;
          ref = child.options.ref;
          children[key] = new child.klass(child.props, this);

          if (typeof ref === 'function') {
            ref(children[key]);
          }
          else if (typeof ref === 'string') {
            this.$[ref] = children[key];
          }

          nextChildrenKeys.push(key);
        }
      }

      return;
    }

    const childForMount = [];
    const keyForMount = [];

    for (let i = 0; i < nextChildrenArr.length; i += 1) {
      child = nextChildrenArr[i];
      key = child.options.hasOwnProperty('key') ? child.options.key : `${child.klass.name}|${i}|defaultKey`;
      currentChild = children[key];

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
      child = children[key];

      if (child === undefined) continue;

      if (child.__comp.updated === true) {
        child.__comp.updated = false;
      } else {
        child.__unmount();
        children[key] = void 0;
      }
    }

    for (let i = 0; i < childForMount.length; i += 1) {
      child = childForMount[i];
      key = keyForMount[i];
      ref = child.options.ref;
      child = children[key] = new child.klass(child.props, this);

      if (typeof ref === 'function') {
        ref(children[key]);
      }
      else if (typeof ref === 'string') {
        this.$[ref] = children[key];
      }
    }
  }

  private __unmountChildren () {
    const children = this.__comp.children;
    const childrenKeys = this.__comp.childrenKeys;

    for (let i= 0; i < childrenKeys.length; i += 1) {
      children[childrenKeys[i]].__unmount();
    }
  }

  static create (props?: object, options: TOptions = fakeEmptyOptions) {
    return { props, options, klass: this };
  }

  static mount (Component, props?: object) {
    const fakeParent = getRootParentData();

    fakeParent.context.scheduleUpdate();

    return new Component(props, fakeParent);
  }

  static unmount (instance) {
    instance.__unmount();
  }
}

type TFakeParentData = {
  context: any & { scheduleUpdateL (): void; },
  __comp: { childTaskQueue: TaskQueue }
}

function getRootParentData (): TFakeParentData {
  const q = new RootTaskQueue();

  scheduler.add(q);

  return {
    context: { scheduleUpdate: () => q.scheduled = true },
    __comp: { childTaskQueue: q }
  }
}
