import { IDrawableEntity } from '../Rendering/IDrawableEntity';
import { Entity } from '../Entity';
import { GameObject } from '../Rendering/GameObject';
import { Box } from '../Rendering/Box';
import { Position } from '../Rendering/Position';
import { ResourceLoader } from '../ResourceLoader';

export class BedEntity extends Entity implements IDrawableEntity {
  private gameObject: GameObject;
  // protected color = '#000';

  public constructor() {
    super();
    this.gameObject = new GameObject();
    this.setUp();
  }

  private setUp(): void {
    const image = ResourceLoader.getLoadedAssets().bed;

    const bed = new GameObject();
    bed.setBox(new Box(
      new Position(20, 490, 0),
      140, 70
    ));
    bed.setImage(image);
    bed.setIsCollidable(true);
    this.gameObject.addChild(bed);
  }

  public getGameObject(): GameObject {
    return this.gameObject;
  }
}
