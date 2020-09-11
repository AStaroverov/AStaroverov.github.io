import { HitBox } from '../BaseClasses/HitBox';

export class Knot extends HitBox { // Like Node from HTML
  public children: Knot[];

  protected parent: Knot | undefined;

  constructor (parent: Knot) {
    super();

    this.parent = parent;
  }

  public getParent<Parent extends Knot> (): Parent | undefined {
    return this.parent as Parent | undefined;
  }

  public appendChild<Child extends Knot> (node: Child): void {
    this.children.push(node);
  }

  public removeChild<Child extends Knot> (node: Child): void {
    const index = this.children.indexOf(node);

    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  public containsChild<T extends Knot> (node: T): boolean {
    return this.children.includes(node);
  }
}
