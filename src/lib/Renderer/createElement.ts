import { CoreComponent } from '../Components/CoreComponent';
import { TComponentConstructor, TComponentData, TComponentProps } from '../types';

const fakeProps: TComponentProps = Object.freeze<TComponentProps>({});

export function createElement<Type extends CoreComponent> (
  type: TComponentConstructor<Type>,
  props: TComponentProps = fakeProps
): TComponentData<Type> {
  return { type, props };
}
