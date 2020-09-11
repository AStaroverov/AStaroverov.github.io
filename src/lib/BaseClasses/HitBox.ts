import { EvTarget } from './EvTarget';
import { hitBoxService } from '../Services/hitBoxServerice';
Node;
export type THitBoxData = {
  minX: number
  minY: number
  maxX: number
  maxY: number
};
export class HitBox extends EvTarget {
  private hitBoxData: THitBoxData = {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0
  };

  public updateHitBox (minX: number, minY: number, maxX: number, maxY: number): void {
    if (this.hitBoxData.minX !== undefined) {
      hitBoxService.remove(this);
    }

    this.hitBoxData.minX = minX;
    this.hitBoxData.minY = minY;
    this.hitBoxData.maxX = maxX;
    this.hitBoxData.maxY = maxY;

    hitBoxService.add(this);
  }

  public removeHitBox (): void {
    hitBoxService.remove(this);
  }

  public destroyHitBox (): void {
    hitBoxService.remove(this);
  }
}
