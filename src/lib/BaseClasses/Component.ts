import { KEY_CONTEXT, KEY_PARENT, KEY_PRIVATE_CONTEXT } from '../types';
import { getRenderIndex } from '../Renderer/renderIndex';
import { getRenderId } from '../Renderer/renderId';
import { Knot } from './Knot';

type PrivateContext = {
  scheduleUpdate: () => void
};

export class Component<
  Props extends object = object,
  State extends object = object,
  Context extends object = object
> extends Knot {
  public context: any;

  public renderId: number = 0;
  public renderIndex: number = 0;

  public props: Partial<Props> = {};
  public state: Partial<State> = {};

  protected privateContext: PrivateContext;

  protected firstRender = true;
  protected firstUpdateChildren = true;

  protected nextProps: Props | undefined = undefined;
  protected nextState: State | undefined = undefined;

  protected __shouldRender: boolean;
  protected __shouldUpdateChildren: boolean;
  protected __shouldRenderChildren: boolean;

  constructor (props: Props) {
    super(props[KEY_PARENT]);

    this.props = props || {};
    this.context = props[KEY_CONTEXT];
    this.privateContext = props[KEY_PRIVATE_CONTEXT];
  }

  public performRender (): void {
    this.privateContext.scheduleUpdate();
  }

  public setContext (context: Context): void {
    Object.assign(this.context, context);
    this.performRender();
  }

  public isRendered (): boolean {
    return this.renderId === getRenderId();
  }

  public setProps (props?: Partial<Props>): void {
    if (props === undefined) return;

    if (this.nextProps === undefined) {
      this.nextProps = Object.assign({}, this.props, props) as Props;
    } else {
      Object.assign(this.nextProps, props);
    }

    this.performRender();
  }

  protected setState (state?: Partial<State>): void {
    if (state === undefined) return;

    if (this.nextState === undefined) {
      this.nextState = Object.assign({}, this.state, state) as State;
    } else {
      Object.assign(this.nextState, state);
    }

    this.performRender();
  }

  protected willReceiveProperties (nextProps: Partial<Props>): void {}

  protected shouldRender (nextProps: Partial<Props> | undefined, nextState: Partial<State> | undefined): boolean {
    return true;
  }

  protected shouldUpdateChildren (nextProps: Partial<Props> | undefined, nextState: Partial<State> | undefined): boolean {
    return true;
  }

  protected shouldRenderChildren (nextProps: Partial<Props> | undefined, nextState: Partial<State> | undefined): boolean {
    return true;
  }

  protected willRender (): void {};
  protected render (): void {};
  protected didRender (): void {};

  protected willUpdateChildren (): void{}
  protected updateChildren (): void{}
  protected didUpdateChildren (): void{}

  protected iterate (): boolean {
    if (this.nextProps === undefined && this.nextState === undefined) {
      this.renderLifeCycle();
    } else {
      this.lifeCycle();
    }

    return this.__shouldRenderChildren;
  }

  protected lifeCycle (): void {
    if (this.nextProps !== undefined) {
      this.willReceiveProperties(this.nextProps);
    }

    this.__shouldRender = this.shouldRender(this.nextProps, this.nextState);
    this.__shouldUpdateChildren = this.shouldUpdateChildren(this.nextProps, this.nextState);
    this.__shouldRenderChildren = this.shouldRenderChildren(this.nextProps, this.nextState);

    if (this.nextProps !== undefined) {
      Object.assign(this.props, this.nextProps);
      this.nextProps = undefined;
    }

    if (this.nextState !== undefined) {
      Object.assign(this.props, this.nextState);
      this.nextState = undefined;
    }

    if (this.__shouldRender) {
      this.renderLifeCycle();
    }

    if (this.__shouldUpdateChildren) {
      this.childrenLifeCycle();
    }
  }

  protected renderLifeCycle (): void {
    this.renderId = getRenderId();
    this.renderIndex = getRenderIndex();

    this.willRender();
    this.render();
    this.didRender();

    this.firstRender = false;
  }

  protected childrenLifeCycle (): void {
    this.willUpdateChildren();
    this.updateChildren();
    this.didUpdateChildren();

    this.firstUpdateChildren = false;
  }

  protected unmount (): void {
    this.unmountChildren();
    this.performRender();
  }

  protected unmountChildren (): void {
    this.children.forEach((child: Component) => {
      child.unmount();
    });
  }
}
