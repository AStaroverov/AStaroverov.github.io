import { CoreComponent } from './Components/CoreComponent';

export type TKey = string;
export type TRef = ((inst: any) => void) | string;

export const KEY_PARENT = Symbol('parent');
export const KEY_LAYERS = Symbol('layers');
export const KEY_CONTEXT = Symbol('context');
export const KEY_PRIVATE_CONTEXT = Symbol('private context');

export interface TComponentProps {
  [key: string]: any
  readonly key?: TKey
  readonly ref?: TRef
  readonly [KEY_PARENT]?: unknown
  readonly [KEY_LAYERS]?: unknown
  readonly [KEY_CONTEXT]?: unknown
  readonly [KEY_PRIVATE_CONTEXT]?: unknown
}

export type TConstructor<Type> = new (parent: Type, props: TComponentProps) => Type;
export type TComponentConstructor<Type extends CoreComponent = CoreComponent> = TConstructor<Type>;

export interface TComponentData<Type extends CoreComponent = CoreComponent> {
  type: TComponentConstructor<Type>
  props: TComponentProps
}
