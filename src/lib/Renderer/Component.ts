import { CoreComponent } from './CoreComponent';

export abstract class Component<Props extends object = object, State extends object = object> extends CoreComponent {
  public props: object = {};
  public state: object = {};

  protected firstRender = true;
  protected firstUpdateChildren = true;

  private __scheduled: boolean = false;
  private __shouldRender: boolean;
  private __shouldUpdateChildren: boolean;
  private __shouldRenderChildren: boolean;
  private __nextProps: Props | undefined = undefined;
  private __nextState: State | undefined = undefined;

  constructor (...args: any[])
  constructor (parent, props: Partial<Props>) {
    super(parent);

    this.setProps(props);
  }

  public setProps (props?: Partial<Props>): void {
    if (props === undefined) return;

    if (this.__nextProps === undefined) {
      this.__nextProps = Object.assign({}, this.props, props) as Props;
    } else {
      Object.assign(this.__nextProps, props);
    }

    this.performRender();
  }

  protected setState (state?: Partial<State>): void {
    if (state === undefined) return;

    if (this.__nextState === undefined) {
      this.__nextState = Object.assign({}, this.state, state) as State;
    } else {
      Object.assign(this.__nextState, state);
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

  protected willRender (): void {}
  protected didRender (): void {}

  protected willUpdateChildren (): void{}
  protected didUpdateChildren (): void{}

  protected iterate (): boolean {
    if (this.layer !== undefined ? this.layer.isDirty : true) {
      if (this.__nextProps === undefined && this.__nextState === undefined) {
        this.renderLifeCycle();
      } else {
        this.lifeCycle();
      }
    }

    return this.__shouldRenderChildren;
  }

  protected lifeCycle (): void {
    this.__scheduled = false;

    if (this.__nextProps !== undefined) {
      this.willReceiveProperties(this.__nextProps);
    }

    this.__shouldRender = this.shouldRender(this.__nextProps, this.__nextState);
    this.__shouldUpdateChildren = this.shouldUpdateChildren(this.__nextProps, this.__nextState);
    this.__shouldRenderChildren = this.shouldRenderChildren(this.__nextProps, this.__nextState);

    if (this.__nextProps !== undefined) {
      Object.assign(this.props, this.__nextProps);
      this.__nextProps = undefined;
    }

    if (this.__nextState !== undefined) {
      Object.assign(this.props, this.__nextState);
      this.__nextState = undefined;
    }

    if (this.__shouldRender) {
      this.renderLifeCycle();
    }

    if (this.__shouldUpdateChildren) {
      this.childrenLifeCycle();
    }
  }

  protected renderLifeCycle (): void {
    this.willRender();
    this.render();
    this.didRender();

    this.firstRender = false;
  }

  protected childrenLifeCycle (): void {
    this.willUpdateChildren();
    this.__updateChildren();
    this.didUpdateChildren();

    this.firstUpdateChildren = false;
  }
}
