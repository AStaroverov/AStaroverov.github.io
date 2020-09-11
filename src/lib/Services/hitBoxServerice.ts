import rbush from 'rbush';
import { CoreComponent } from '../Components/CoreComponent';
import { HitBox, THitBoxData } from '../BaseClasses/HitBox';

type TOptionsHitTest = {
  noSort?: Boolean
};

export class HitBoxService<Component extends CoreComponent> {
  private rbush = rbush(16);

  public add (item: HitBox): void{
    // TODO: should try Bulk-Inserting Data tree.load([item1, item2, ...]);
    this.rbush.insert(item);
  }

  public remove (item: HitBox): void {
    this.rbush.remove(item);
  }

  public testPoint (x: number, y: number, options?: TOptionsHitTest): Component[] {
    return this.testHitBox({
      minX: x - 1,
      minY: y - 1,
      maxX: x + 1,
      maxY: y + 1
    }, options);
  }

  public testHitBox (data: THitBoxData, options?: TOptionsHitTest): Component[] {
    const result = this.rbush.search(data);
    let i = 0;
    let j = 0;

    for (; i < result.length; i += 1) {
      if (result[i].item.onHitBox(data)) {
        result[j++] = result[i].item;
      }
    }

    result.length = j;

    if (options && options.noSort) {
      return result;
    }

    return result.sort((a, b) => {
      return b.renderIndex - a.renderIndex;
    });
  }
}

export const hitBoxService = new HitBoxService();
