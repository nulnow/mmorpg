import { Position } from './Position';

export type Rect = {
  top: number,
  left: number,
  right: number,
  bottom: number,

  width: number,
  height: number,
}

export class Box {
  private p1: Position;
  private p2: Position;

  public constructor(p1: Position, p2: Position) {
    this.p1 = p1;
    this.p2 = p2;
  }

  public getRect(): Rect {
    const top = Math.min(this.p1.y, this.p2.y);
    const left = Math.min(this.p1.x, this.p2.x);
    const right = Math.max(this.p1.x, this.p2.x);
    const bottom = Math.max(this.p1.y, this.p2.y);

    const width = right - left;
    const height = bottom - top;

    return {
      top: top,
      left: left,
      right: right,
      bottom: bottom,

      width: width,
      height: height,
    };
  }

  public calculateRelationRect(box: Box): Rect {
    const selfRect = this.getRect();
    const boxRect = box.getRect();

    return {
      left: boxRect.left - selfRect.left,
      bottom: boxRect.bottom - selfRect.bottom,
      right: boxRect.right - selfRect.right,
      top: boxRect.top - selfRect.top,

      width: boxRect.width,
      height: boxRect.height,
    };
  }

  public move(x: number, y: number): void {
    this.p1.x += x;
    this.p2.x += x;

    this.p1.y += y;
    this.p2.y += y;
  }

  public copy(): Box {
    return new Box(
      this.p1.copy(),
      this.p2.copy(),
    );
  }

  public getCenter(): Position {
    const rect = this.getRect();
    const x = (rect.left + (rect.width / 2));
    const y = (rect.top + (rect.height / 2));

    return new Position(x, y, 0);
  }

  public isCollide(box: Box) {
    const a = this.getRect();
    const b = box.getRect();

    return !(
      ((a.top + a.height) < (b.top)) ||
      (a.top > (b.top + b.height)) ||
      ((a.left + a.width) < b.left) ||
      (a.left > (b.left + b.width))
    );
  }
}
