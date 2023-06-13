import { Position } from './Position';
import { MarkupRect } from '../types';

export type Rect = {
  top: number,
  left: number,
  right: number,
  bottom: number,

  width: number,
  height: number,
}

export class Box {
  public static fromMarkupRect(markupRect: MarkupRect, { scale = 1 }: { scale?: number } = {}): Box {
    const point1 = markupRect[0];
    const point2 = markupRect[1];

    const topLeftX = Math.min(point1.x * scale, point2.x * scale);
    const topLeftY =  Math.min(point1.y * scale, point2.y * scale);

    const width = Math.abs(point1.x * scale - point2.x * scale);
    const height = Math.abs(point1.y * scale - point2.y * scale);

    return new Box(
      new Position(topLeftX, topLeftY),
      width, height,
    );
  }

  public constructor(
    private topLeft: Position,
    private width: number,
    private height: number
  ) {}

  public getTopLeft(): Position {
    return this.topLeft;
  }

  public getBottom(): number {
    return this.topLeft.y + this.height;
  }

  public setTopLeft(position: Position): this {
    this.topLeft = position;
    return this;
  }

  public getWidth(): number {
    return this.width;
  }
  public setWidth(width: number): this {
    this.width = width;
    return this;
  }

  public getHeight(): number {
    return this.height;
  }
  public setHeight(height: number): this {
    this.height = height;
    return this;
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

  public move(x: number, y: number): this {
    this.topLeft.x += x;
    this.topLeft.y += y;

    return this;
  }

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

  public isCollide(box: Box): boolean {
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
