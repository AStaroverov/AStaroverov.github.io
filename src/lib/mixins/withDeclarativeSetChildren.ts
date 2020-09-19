import { TComponentProps } from "./withReactDataFlow";
import { BaseComponent } from "../BaseClasses/BaseComponent";
import { TComponentConstructor, TComponentData, TConstructor, TKey, TRef } from "../types";

const EMPTY_CHILDREN = Object.freeze([]) as unknown as any[];

export function createElement<
  Comp extends BaseComponent,
  Constr extends TComponentConstructor<Comp>,
  Args extends ConstructorParameters<Constr>
> (
  type: Constr,
  ...args: Args
): TComponentData<Comp, Args> {
  return { type, args };
}

export function withDeclarativeSetChildren<Base extends TConstructor<BaseComponent>>(base: Base) {
  return class WithDeclarativeSetChildren extends base {
    private childrenKeys: TKey[];
    private mapKeyToChild: Map<TKey, BaseComponent>;
    private componentsDatas: TComponentData<BaseComponent>[] | void;

    public setChildren(nextComponentsDatas: TComponentData<BaseComponent>[] = EMPTY_CHILDREN): void {
      if (this.mapKeyToChild === undefined) {
        this.mapKeyToChild = new Map<TKey, BaseComponent>();
      }

      const mapKeyToChild = this.mapKeyToChild;
      const prevChildrenKeys: TKey[] = this.childrenKeys || [];
      const nextChildrenKeys: TKey[] = this.childrenKeys = [];

      if (nextComponentsDatas === this.componentsDatas) return;

      let key: TKey | undefined;
      let ref: TRef | undefined;
      let props: TComponentProps;
      let instance: BaseComponent;
      let componentData: TComponentData<BaseComponent>;

      this.componentsDatas = nextComponentsDatas;
      this.children = [];

      if (nextComponentsDatas.length === 0) {
        if (prevChildrenKeys.length > 0) {
          for (let i = 0; i < prevChildrenKeys.length; i += 1) {
            key = prevChildrenKeys[i];
            instance = mapKeyToChild.get(key)!;

            // @ts-expect-error
            instance.disconnected();
            mapKeyToChild.delete(key);
          }
        }

        return;
      }

      if (prevChildrenKeys.length === 0) {
        if (nextComponentsDatas.length > 0) {
          for (let i = 0; i < nextComponentsDatas.length; i += 1) {
            componentData = nextComponentsDatas[i];
            props = componentData.args[0] as TComponentProps;
            key = props?.key || this.createDefaultKey(componentData.type.name, i);
            ref = props?.ref;
            // eslint-disable-next-line new-cap
            mapKeyToChild.set(
              key!,
              instance = new componentData.type(...componentData.args)
            );

            if (typeof ref === 'function') {
              ref(instance);
            }

            nextChildrenKeys.push(key);
            this.appendChild(instance);
          }
        }

        return;
      }

      for (let i = 0; i < nextComponentsDatas.length; i += 1) {
        componentData = nextComponentsDatas[i];
        props = componentData.args[0] as TComponentProps;
        key = props?.key || this.createDefaultKey(componentData.type.name, i);
        instance = mapKeyToChild.get(key)!;

        nextChildrenKeys.push(key);

        if (
          instance !== undefined &&
          instance instanceof componentData.type &&
          instance.constructor === componentData.type
        ) {
          instance.setProps(props);
        } else {
          mapKeyToChild.set(key, instance = new componentData.type(...componentData.args));

          if (typeof props?.ref === 'function') {
            props.ref(instance);
          }
        }

        this.appendChild(instance);
      }

      for (let i = 0; i < prevChildrenKeys.length; i += 1) {
        key = prevChildrenKeys[i];

        if (nextChildrenKeys.indexOf(key) === -1 && mapKeyToChild.has(key)) {
          // @ts-expect-error
          mapKeyToChild.get(key)!.disconnected();
          mapKeyToChild.delete(key);
        }
      }
    }

    private createDefaultKey(...args: (string | number)[]): string {
      return args.join('|') + '|DEFAULT_KEY'
    }
  }
}
