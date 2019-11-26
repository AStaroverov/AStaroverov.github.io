import { CoreComponent } from './CoreComponent';

export class Component extends CoreComponent {
  public firstRender = true;
  public firstUpdateChildren = true;
  public shouldRender: boolean = true;

  public props: object = {};
  public state: object = {};

  private protoIterator = this.iterate;

  private __data = {
    nextProps: void 0,
    nextState: void 0,
  };

  constructor (...args: any[])
  constructor (parent, props?: object) {
    super(parent);

    this.props = props || this.props;
    this.iterate = this.lifeCycle;
  }

  public setProps (props?: object) {
    if (props === undefined) return;

    const data = this.__data;

    if (data.nextProps === void 0) {
      data.nextProps = Object.assign(Object.assign({}, this.props), props);
    } else {
      Object.assign(data.nextProps, props);
    }

    this.iterate = this.lifeCycle;
  }

  protected setState (state?: object) {
    if (state === undefined) return;

    const data = this.__data;

    if (data.nextState === void 0) {
      data.nextState = Object.assign(Object.assign({}, this.state), state);
    } else {
      Object.assign(data.nextState, state); 
    }

    this.iterate = this.lifeCycle;
  }

  protected propsChanged (nextProps: object): void {}
  protected stateChanged (nextState: object): void {}

  protected willRender(): void {}
  protected didRender(): void {}

  protected willUpdateChildren () {}
  protected didUpdateChildren () {}

  protected childrenLifeCycle () {
    this.willUpdateChildren();

    if (this.shouldUpdateChildren) {
      this.shouldUpdateChildren = false;
      this.__updateChildren();
      this.didUpdateChildren();
    }

    this.firstUpdateChildren = false;
  }

  protected willNotRender () {}

  protected __setProps (props: object) {
    this.setProps(props);
  }

  protected lifeCycle() {
    this.iterate = this.protoIterator;
    const data = this.__data;

    if (data.nextProps !== void 0) {
      this.propsChanged(data.nextProps);
      Object.assign(this.props, data.nextProps);
      data.nextProps = void 0;
    }

    if (data.nextState !== void 0) {
      this.stateChanged(data.nextState);
      Object.assign(this.state, data.nextState);
      data.nextState = void 0;
    }

    this.willRender();
    if (this.shouldRender) {
      this.render();
      this.didRender();

      this.firstRender = false;
    } else {
      this.willNotRender();
    }

    this.childrenLifeCycle()

    return this.shouldRenderChildren;
  }
}
