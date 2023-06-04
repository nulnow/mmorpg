import { GameObject } from '../Rendering/GameObject';
import { Box } from '../Rendering/Box';
import { Position } from '../Rendering/Position';
import { ResourceLoader } from '../ResourceLoader';
import { DrawableEntity } from '../Rendering/DrawableEntity';

export class MapWall extends DrawableEntity {
  protected gameObject: GameObject;
  // protected color = '#000';

  public constructor(private width: number, private height: number) {
    super();
    this.gameObject = new GameObject();
    this.setUpWalls();
  }

  private setUpWalls() {
    const wallColor = '#493420';

    const floor = new GameObject();
    floor.setBox(new Box(
      new Position(0, 0, 0),
      this.width, this.height
    ));
    floor.setImage(ResourceLoader.getImageFromPattern(ResourceLoader.getLoadedAssets().cobblestone, this.width, this.height));
    floor.setIsCollidable(false);
    this.gameObject.addChild(floor);

    const leftWall = new GameObject();
    leftWall.setBox(new Box(
      new Position(0, 0, 0),
      20,
      this.height
    ));
    leftWall.setColor(wallColor);
    leftWall.setIsCollidable(true);
    this.gameObject.addChild(leftWall);

    const rightWall = new GameObject();
    rightWall.setBox(new Box(
      new Position(this.width - 20, 0, 0),
      20,
      (this.height / 2) - 100
    ));
    rightWall.setColor(wallColor);
    rightWall.setIsCollidable(true);
    this.gameObject.addChild(rightWall);

    const rightWall2 = new GameObject();
    rightWall2.setBox(new Box(
      new Position(this.width - 20, (this.height / 2) + 100, 0),
      20,
      (this.height / 2) - 100
    ));
    rightWall2.setColor(wallColor);
    rightWall2.setIsCollidable(true);
    this.gameObject.addChild(rightWall2);

    const topWall = new GameObject();
    topWall.setBox(new Box(
      new Position(0, 0, 0),
      this.width, 20
    ));
    topWall.setColor(wallColor);
    topWall.setIsCollidable(true);
    this.gameObject.addChild(topWall);

    const bottomWall = new GameObject();
    bottomWall.setBox(new Box(
      new Position(0, this.height - 20, 0),
      this.width, 20
    ));
    bottomWall.setColor(wallColor);
    bottomWall.setIsCollidable(true);
    this.gameObject.addChild(bottomWall);
  }

  public getGameObject(): GameObject {
    return this.gameObject;
  }
}
