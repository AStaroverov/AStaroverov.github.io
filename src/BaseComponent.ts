import { CanvasElement } from './prototypes/CanvasElement';

type PrivateContext = {
  scheduleUpdate: () => void
};

export class BaseComponent<Context extends object = object> extends CanvasElement {
  public context: Context;

  private privateContext: PrivateContext;

  public setProps (props: object): void {
    Object.assign(this, props);
  }

  public setParent<Parent extends this>(parent: Parent): void {
    this.context = parent.context;
    this.privateContext = parent.privateContext;

    super.setParent(parent);
  }

  public removeParent (): void {
    // @ts-expect-error
    this.context = undefined;
    // @ts-expect-error
    this.privateContext = undefined;

    super.removeParent();
  }

  public performRender (): void {
    this.privateContext.scheduleUpdate();
  }
}
