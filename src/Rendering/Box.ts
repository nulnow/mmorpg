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
  public constructor(
    private topLeft: Position,
    private width: number,
    private height: number
  ) {}

  public getTopLeft(): Position {
    return this.topLeft;
  }

  public setTopLeft(position: Position): void {
    this.topLeft = position;
  }

  public getWidth(): number {
    return this.width;
  }
  public setWidth(width: number): void {
    this.width = width;
  }

  public getHeight(): number {
    return this.height;
  }
  public setHeight(height: number): void {
    this.height = height;
  }

  public getRect(): Rect {
    const top = this.topLeft.y;
    const left = this.topLeft.x;
    const right = this.topLeft.x + this.width;
    const bottom = this.topLeft.y + this.height;

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
    this.topLeft.x += x;
    this.topLeft.y += y;
  }

  // public setCenter(newCenter: Position): void {
  //   const currentCenter = this.getCenter();
  //   const dx = newCenter.x - currentCenter.x;
  //   const dy = newCenter.y - currentCenter.y;
  //
  //   this.p1.x += dx;
  //   this.p1.y += dy;
  //
  //   this.p2.x += dx;
  //   this.p2.y += dy;
  // }

  public copy(): Box {
    return new Box(
      this.topLeft.copy(),
      this.width,
      this.height,
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
