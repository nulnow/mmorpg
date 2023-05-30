import { Entity } from './Entity';
import { Box } from './Rendering/Box';
import { Position } from './Rendering/Position';

export class Camera extends Entity {
  public constructor(width: number, height: number) {
    super();

    this.setBox(new Box(
      new Position(0, 0, 0),
      new Position(width, height, 0),
    ));
  }

  public isVisible(entity: Entity): boolean {
    return this.getBox().isCollide(entity.getBox());
  }
}
