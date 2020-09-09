import { CoreComponent } from './CoreComponent';
import { IComponentConstructor, TComponentData, TComponentProps } from './types';

const fakeProps: TComponentProps = Object.freeze<TComponentProps>({});

export function createElement<Type extends CoreComponent> (
  type: IComponentConstructor<Type>,
  props: TComponentProps = fakeProps
): TComponentData<Type> {
  return { type, props };
}
