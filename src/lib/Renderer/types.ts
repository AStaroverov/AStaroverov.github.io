import { CoreComponent } from './CoreComponent';

export type TKey = string;
export type TRef = ((inst: any) => void) | string;

export interface TComponentProps {
  [key: string]: any
  readonly key?: TKey
  readonly ref?: TRef
}

export type IComponentConstructor<Type extends CoreComponent> = new (parent: Type, props: TComponentProps) => Type;

export interface TComponentData<Type extends CoreComponent = CoreComponent> {
  type: IComponentConstructor<Type>
  props: TComponentProps
}
