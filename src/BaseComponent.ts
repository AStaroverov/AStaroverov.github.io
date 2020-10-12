import { CanvasElement } from './prototypes/CanvasElement';
import { mat4 } from 'gl-matrix';
import { HitBoxService } from './prototypes/helpers/hitBoxServerice';

export type TPrivateContext = {
  root: BaseComponent
  hitBoxService: HitBoxService
  globalTransformMatrix: mat4
  scheduleUpdate: () => void
};

export const PRIVATE_CONTEXT = Symbol('PRIVATE_CONTEXT');

export class BaseComponent<Context extends object = object> extends CanvasElement {
  public context: Context;

  protected [PRIVATE_CONTEXT]: TPrivateContext;

  public setProps (props: object): void {
    Object.assign(this, props);
  }

  public setParent<Parent extends this>(parent: Parent): void {
    this.context = parent.context;
    this[PRIVATE_CONTEXT] = parent[PRIVATE_CONTEXT];

    super.setParent(parent);
  }

  public removeParent (): void {
    // @ts-expect-error
    this.context = undefined;
    // @ts-expect-error
    this[PRIVATE_CONTEXT] = undefined;

    super.removeParent();
  }

  public performRender (): void {
    this[PRIVATE_CONTEXT].scheduleUpdate();
  }

  public setGlobalTransformMatrix (matrix: mat4): void {
    mat4.copy(this[PRIVATE_CONTEXT].globalTransformMatrix, matrix);
  }
}
