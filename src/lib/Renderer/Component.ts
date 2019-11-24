import { CoreComponent } from './CoreComponent';
import { Task } from "../Scheduler";
import { rootTaskQueue } from './TaskQueue';

export abstract class Component extends CoreComponent {
  protected firstRender = true;
  protected firstUpdateChildren = true;
  private __scheduled: boolean = false;
  private __shouldRenderChildren: boolean;
  private __taskForUpdate = new Task(this.lifeCycle, this, true);

  public props: object = {};
  public state: object = {};
  private __data = {
    nextProps: void 0,
    nextState: void 0,
  };

  constructor (...args: any[])
  constructor (parent, props?: object) {
    super(parent);

    this.props = props || this.props;
    this.performRender();
  }

  public setProps (props?: object) {
    if (props === undefined) return;

    const data = this.__data;

    if (data.nextProps === void 0) {
      data.nextProps = Object.assign(Object.assign({}, this.props), props);
    } else {
      Object.assign(data.nextProps, props);
    }

    this.performRender();
  }

  protected setState (state?: object) {
    if (state === undefined) return;

    const data = this.__data;

    if (data.nextState === void 0) {
      data.nextState = Object.assign(Object.assign({}, this.state), state);
    } else {
      Object.assign(data.nextState, state); 
    }

    this.performRender();
  }

  public performRender () {
    if (!this.__scheduled) {
      this.__scheduled = true;
      rootTaskQueue.add(this.__taskForUpdate);
    }

    super.performRender();
  }

  protected propsChanged (nextProps: object): void {}
  protected stateChanged (nextState: object): void {}
  protected shouldRender (): boolean {
    return true;
  }

  protected willRender(): void {}
  protected didRender(): void {}

  protected shouldUpdateChildren(): boolean {
    return true;
  }
  protected willUpdateChildren () {}
  protected didUpdateChildren () {}

  protected childrenLifeCycle () {
    this.willUpdateChildren();
    this.__updateChildren();
    this.didUpdateChildren();

    this.firstUpdateChildren = false;
  }

  protected willNotRender () {}

  protected __setProps (props: object) {
    this.setProps(props);
  }

  protected shouldRenderChildren(): boolean {
    return true;
  }

  protected iterate () {
    this.canvas.render(this.context.ctx);

    return this.__shouldRenderChildren;
  }

  protected lifeCycle() {
    this.__scheduled = false;
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

    if (this.shouldRender()) {
      this.willRender();
      this.render();
      this.didRender();

      this.firstRender = false;
    } else {
      this.willNotRender();
    }

    if (this.shouldUpdateChildren()) {
      this.childrenLifeCycle()
    }

    this.__shouldRenderChildren = this.shouldRenderChildren();
  }
}
