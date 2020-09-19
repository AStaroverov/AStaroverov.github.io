import { getRenderIndex } from '../Renderer/renderIndex';
import { getRenderId } from '../Renderer/renderId';
import { Knot } from './Knot';
import { hitBoxService } from '../Services/hitBoxServerice';
import { BBox } from 'rbush';
import { ITask } from '../types';

export type THitBoxData<Item extends CanvasElement = CanvasElement> = BBox & {
  item: Item
};

export class CanvasElement extends Knot implements ITask {
  public children: CanvasElement[];
  public zIndex: number = 0;
  public renderId: number = 0;
  public renderIndex: number = 0;
  public hitBoxData: THitBoxData = {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
    item: this,
  };

  public isRendered (): boolean {
    return this.renderId === getRenderId();
  }

  public setHitBox (
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
  ): void {
    if (this.hitBoxData.minX !== undefined) {
      hitBoxService.remove(this.hitBoxData);
    }

    this.hitBoxData.minX = minX;
    this.hitBoxData.minY = minY;
    this.hitBoxData.maxX = maxX;
    this.hitBoxData.maxY = maxY;

    hitBoxService.add(this.hitBoxData);
  }

  protected removeHitBox (): void {
    hitBoxService.remove(this.hitBoxData);
  }

  public onHitBox (area: BBox): boolean {
    return true;
  }

  protected disconnected(): void {
    super.disconnected();
    this.removeHitBox();
  }

  public run(): void {
    this.beforeEachRender();
    this.render();
  }

  public next(): CanvasElement[] | void {
    return this.children;
  }

  protected render (): void {}

  private beforeEachRender(): void {
    this.renderId = getRenderId();
    this.renderIndex = getRenderIndex();
  }
}
