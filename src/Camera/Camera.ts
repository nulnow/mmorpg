import { Entity } from '../Entity';
import { Box } from '../Rendering/Box';
import { Position } from '../Rendering/Position';
import { GameObject } from '../Rendering/GameObject';
import { IDrawableEntity } from '../Rendering/IDrawableEntity';

export class Camera extends Entity {
  protected box: Box;
  private filter = "";

  private resizeHandler = () => {
    this.box = new Box(
      new Position(0, 0, 0),
      window.innerWidth, window.innerHeight,
    );
  };

  public constructor(width: number, height: number) {
    super();

    this.box = new Box(
      new Position(0, 0, 0),
      width, height
    );
  }

  public initEntity() {
    super.initEntity();
    // todo
    window.addEventListener('resize', this.resizeHandler);
  }

  public destroy() {
    super.destroy();
    window.removeEventListener('resize', this.resizeHandler);
  }

  public getFilter(): string {
    return this.filter;
  }

  public setFilter(value: string): void {
    this.filter = value;
  }

  public getBox(): Box {
    return this.box;
  }

  public setBox(box: Box): void {
    this.box = box;
  }

  public isVisibleBox(box: Box): boolean {
    return this.box.isCollide(box);
  }

  public isVisibleGameObject(gameObject: GameObject): boolean {
    const boxes = gameObject.getAllTheBoxes();

    for (let i = 0; i < boxes.length; i++) {
      if (this.isVisibleBox(boxes[i])) {
        return true;
      }
    }

    return false;
  }

  public isVisibleDrawableEntity(drawable: IDrawableEntity): boolean {
    return this.isVisibleGameObject(drawable.getGameObject());
  }

  public getRelativePosition(position: Position): Position {
    const copy = position.copy();
    const rect = this.box.getRect();

    copy.x -= rect.left;
    copy.y -= rect.top;

    return copy;
  }

  public getRelativeCoordinates(box: Box): Box {
    const copy = box.copy();

    const copyTopLeft = copy.getTopLeft();
    const cameraTopLeft = this.box.getTopLeft();

    copyTopLeft.x -= cameraTopLeft.x;
    copyTopLeft.y -= cameraTopLeft.y;

    return copy;
  }
}
