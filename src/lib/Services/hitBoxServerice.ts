import RBush, { BBox } from 'rbush';
import { CanvasElement, THitBoxData } from '../BaseClasses/CanvasElement';

type TOptionsHitTest = {
  noSort?: Boolean
};

export class HitBoxService<Component extends CanvasElement> {
  public root: Component;
  private rbush = new RBush<THitBoxData<Component>>(16);
  private tmpBox: BBox = {
    minX: 0,
    minY: 0,
    maxY: 0,
    maxX: 0
  };

  public setRoot (root: Component): void {
    this.root = root;
  }

  public add (item: THitBoxData<Component>): void {
    // TODO: should try Bulk-Inserting Data tree.load([item1, item2, ...]);
    this.rbush.insert(item);
  }

  public remove (item: THitBoxData<Component>): void {
    this.rbush.remove(item);
  }

  public testPoint (x: number, y: number, options?: TOptionsHitTest): Component[] {
    this.tmpBox.minX = x - 1;
    this.tmpBox.minY = y - 1;
    this.tmpBox.maxX = x + 1;
    this.tmpBox.maxY = y + 1;

    return this.testHitBox(this.tmpBox, options);
  }

  public testHitBox (data: BBox, options?: TOptionsHitTest): Component[] {
    const result: Component[] = [];
    const searched: Array<THitBoxData<Component>> = this.rbush.search(data);

    for (let i = 0; i < searched.length; i += 1) {
      if (searched[i].item?.onHitBox(data)) {
        result.push(searched[i].item);
      }
    }

    if (options && options.noSort) {
      return result;
    }

    return result.sort((a, b) => {
      if (a.zIndex !== 0 || b.zIndex !== 0) {
        return b.zIndex - a.zIndex;
      }

      return b.renderIndex - a.renderIndex;
    });
  }
}

export const hitBoxService = new HitBoxService();
