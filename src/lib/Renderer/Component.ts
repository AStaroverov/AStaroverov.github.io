import { CoreComponent } from './CoreComponent';

export abstract class Component extends CoreComponent {
  protected firstRender = true;
  protected firstUpdateChildren = true;
  private __scheduled: boolean = false;
  private __shouldRenderChildren: boolean;

  public props: object = {};
  public state: object = {};
  private readonly __data: {
    nextProps: object | undefined
    nextState: object | undefined
  } = {
    nextProps: undefined,
    nextState: undefined
  };

  constructor (...args: any[])
  constructor (parent, props?: object) {
    super(parent);

    this.props = props || this.props;
  }

  public setProps (props?: object): void {
    if (props === undefined) return;

    const data = this.__data;

    if (data.nextProps === undefined) {
      data.nextProps = Object.assign(Object.assign({}, this.props), props);
    } else {
      Object.assign(data.nextProps, props);
    }

    this.performRender();
  }

  protected setState (state?: object): void {
    if (state === undefined) return;

    const data = this.__data;

    if (data.nextState === undefined) {
      data.nextState = Object.assign(Object.assign({}, this.state), state);
    } else {
      Object.assign(data.nextState, state);
    }

    this.performRender();
  }

  protected propsChanged (nextProps: object): void {}
  protected stateChanged (nextState: object): void {}
  protected shouldRender (): boolean {
    return true;
  }

  protected willRender (): void {}
  protected didRender (): void {}

  protected shouldUpdateChildren (): boolean {
    return true;
  }

  protected willUpdateChildren (): void{}
  protected didUpdateChildren (): void{}

  protected childrenLifeCycle (): void {
    this.willUpdateChildren();
    this.__updateChildren();
    this.didUpdateChildren();

    this.firstUpdateChildren = false;
  }

  protected shouldRenderChildren (): boolean {
    return true;
  }

  protected iterate (): boolean {
    if (this.layer !== undefined ? this.layer.isDirty : true) {
      this.lifeCycle();
    }

    return this.__shouldRenderChildren;
  }

  protected lifeCycle (): void {
    this.__scheduled = false;
    const data = this.__data;

    if (data.nextProps !== undefined) {
      this.propsChanged(data.nextProps);
      Object.assign(this.props, data.nextProps);
      data.nextProps = undefined;
    }

    if (data.nextState !== undefined) {
      this.stateChanged(data.nextState);
      Object.assign(this.state, data.nextState);
      data.nextState = undefined;
    }

    if (this.shouldRender()) {
      this.willRender();
      this.render();
      this.didRender();

      this.firstRender = false;
    }

    if (this.shouldUpdateChildren()) {
      this.childrenLifeCycle();
    }

    this.__shouldRenderChildren = this.shouldRenderChildren();
  }
}
