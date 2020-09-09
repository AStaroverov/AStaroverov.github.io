import { Task, TaskQueue } from '../Scheduler';
import { Layer } from '../Layers/Layer';
import { Layers } from '../Layers/Layers';
import { TComponentData, TKey, TRef } from './types';

interface TCompData<Comp extends CoreComponent> {
  task: Task | TaskQueue
  childQueue: TaskQueue
  scheduled: boolean
  parent: Comp | undefined
  schedule: VoidFunction
  children?: Map<TKey, Comp>
  childrenKeys?: TKey[]
  componentsDatas?: TComponentData[]
  updated: boolean
}

export abstract class CoreComponent {
  // Every class has name field
  public name: string;

  public $: object = {};
  public layers: Layers;
  public layer: Layer | undefined;
  public context: any;
  public __comp: TCompData<CoreComponent>;

  constructor (...args: any[])
  constructor (parent: CoreComponent) {
    this.context = parent.context;
    this.layers = parent.layers;

    const task = new TaskQueue();
    const childQueue = new TaskQueue();

    task.add(
      new Task(this.iterate, this),
      childQueue
    );

    this.__comp = {
      task,
      childQueue,
      scheduled: false,
      parent: parent instanceof CoreComponent ? parent : undefined,
      schedule: parent.__comp.schedule,
      children: undefined,
      childrenKeys: undefined,
      componentsDatas: undefined,
      updated: false
    };
  }

  public attachToLayer (l: Layer): void {
    if (l === this.layer) {
      return;
    }

    if (this.layer !== undefined) {
      this.layer.willDirty = true;
    }

    this.layer = l;
    this.layer.willDirty = true;
  }

  public performRender (): void {
    if (this.layer !== undefined) {
      this.layer.willDirty = true;
    }

    this.__comp.schedule();
  }

  public getParent (): CoreComponent | void {
    return this.__comp.parent;
  }

  public setContext (context: object): void {
    Object.assign(this.context, context);
    this.performRender();
  }

  protected unmount (): void {}
  protected render (): void {}
  protected updateChildren (): void | TComponentData[] {}

  protected setProps (props: object): void {}

  private __unmount (): void {
    this.__unmountChildren();
    this.unmount();
    this.performRender();
  }

  protected iterate (): boolean {
    if (this.layer !== undefined ? this.layer.isDirty : true) {
      this.render();
    }

    return true;
  }

  protected __updateChildren (): void {
    const nextComponentsDatas: TComponentData[] = this.updateChildren() || [];
    const comp = this.__comp;
    const childQueue = comp.childQueue;
    const children = comp.children || new Map<TKey, CoreComponent>();
    const prevChildrenKeys: TKey[] = comp.childrenKeys || [];
    const nextChildrenKeys: TKey[] = comp.childrenKeys = [];

    if (nextComponentsDatas === comp.componentsDatas) return;

    let key: TKey | undefined;
    let ref: TRef | undefined;
    let instance: CoreComponent;
    let componentData: TComponentData;

    comp.componentsDatas = nextComponentsDatas;

    childQueue.clearItems();

    if (nextComponentsDatas.length === 0) {
      if (prevChildrenKeys.length > 0) {
        for (let i = 0; i < prevChildrenKeys.length; i += 1) {
          key = prevChildrenKeys[i];
          instance = children.get(key)!;

          instance.__unmount();
          children.delete(key);
        }
      }

      return;
    }

    if (prevChildrenKeys.length === 0) {
      if (nextComponentsDatas.length > 0) {
        for (let i = 0; i < nextComponentsDatas.length; i += 1) {
          componentData = nextComponentsDatas[i];
          key = componentData.props?.key || createDefaultKey(componentData.type.name, i);
          ref = componentData.props.ref;
          // eslint-disable-next-line new-cap
          children.set(key, instance = new componentData.type(this, componentData.props));

          if (typeof ref === 'function') {
            ref(instance);
          }

          if (typeof ref === 'string') {
            this.$[ref] = instance;
          }

          nextChildrenKeys.push(key);
          childQueue.add(instance.__comp.task);
        }
      }

      return;
    }

    const componentsDatasForMount: TComponentData[] = [];
    const keyForMount: TKey[] = [];
    let currentInstance;

    for (let i = 0; i < nextComponentsDatas.length; i += 1) {
      componentData = nextComponentsDatas[i];
      key = componentData.props?.key || createDefaultKey(componentData.type.name, i);
      currentInstance = children.get(key);

      nextChildrenKeys.push(key);

      if (
        currentInstance !== undefined &&
        currentInstance instanceof componentData.type &&
        currentInstance.constructor === componentData.type
      ) {
        currentInstance.setProps(componentData.props);
        currentInstance.__comp.updated = true;
      } else {
        componentsDatasForMount.push(componentData);
        keyForMount.push(key);
      }
    }

    for (let i = 0; i < prevChildrenKeys.length; i += 1) {
      key = prevChildrenKeys[i];

      if (!children.has(key)) {
        continue;
      }

      instance = children.get(key)!;

      if (instance.__comp.updated) {
        instance.__comp.updated = false;
      } else {
        instance.__unmount();
        children.delete(key);
      }
    }

    for (let i = 0; i < componentsDatasForMount.length; i += 1) {
      componentData = componentsDatasForMount[i];
      key = keyForMount[i];
      ref = componentData.props.ref;
      // eslint-disable-next-line new-cap
      children.set(key, instance = new componentData.type(this, componentData.props));

      if (typeof ref === 'function') {
        ref(instance);
      }

      if (typeof ref === 'string') {
        this.$[ref] = instance;
      }
    }

    for (let i = 0; i < nextChildrenKeys.length; i += 1) {
      childQueue.add(children.get(nextChildrenKeys[i])!.__comp.task);
    }
  }

  private __unmountChildren (): void {
    if (this.__comp.childQueue) {
      const children = this.__comp.children!;
      const childrenKeys = this.__comp.childrenKeys!;

      for (let i = 0; i < childrenKeys.length; i += 1) {
        children.get(childrenKeys[i])!.__unmount();
      }
    }
  }
}

function createDefaultKey (name: string, index: number): string {
  return `${name}-${index}--defaultKey`;
}
