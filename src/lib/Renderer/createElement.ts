import { CoreComponent } from './CoreComponent';
import { IComponentConstructor, TComponentData, TComponentProps } from './types';

const fakeEmptyOptions: TComponentProps = {};

export function createElement<Type extends CoreComponent> (
  type: IComponentConstructor<Type>,
  props: TComponentProps = fakeEmptyOptions
): TComponentData<Type> {
  return { type, props };
}
