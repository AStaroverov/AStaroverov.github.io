import { BaseComponent } from './BaseComponent';

export type TMutable<T> = {
  -readonly[P in keyof T]: T[P]
};

export type TConstructor<Type = {}> = new (...a: any[]) => Type;
export type TComponentConstructor<Type extends BaseComponent = BaseComponent> = TConstructor<Type>;

export interface ITask {
  run: (parent?: ITask) => void
  next: () => ITask[] | void
}

export type TKey = string;
export type TRef = ((inst: any) => void) | string;

export const KEY_CONTEXT = Symbol('context');
export const KEY_PRIVATE_CONTEXT = Symbol('private context');

export interface TComponentData<
  Type extends BaseComponent = BaseComponent,
  Args extends unknown[] = unknown[],
> {
  type: TComponentConstructor<Type>
  args: Args
}

export type TPoint = {
  x: number
  y: number
};

export type TRect = TPoint & {
  width: number
  height: number
};
