import { DrawableEntity } from '../Rendering/DrawableEntity';
import { GameObject } from '../Rendering/GameObject';
import { ResourceLoader } from '../ResourceLoader';
import { Box } from '../Rendering/Box';
import { Position } from '../Rendering/Position';
import { BOXES, TOP_LEFT_WALL_PATH } from './StairsCONSTS';

const DEFAULT_WIDTH = 1580;
const DEFAULT_HEIGHT = 1720;

class TopLeftStairsWallEntity extends DrawableEntity {
  public constructor(private x: number, private y: number, private scale: number) {
    super();

    const box = new Box(
      new Position(x, y),
      DEFAULT_WIDTH * scale, DEFAULT_HEIGHT * scale
    );
    this.gameObject = new GameObject();
    this.gameObject.setBox(box);
    this.gameObject.setZIndex(1);

    const topLeftWallImage = ResourceLoader.cropImageByPath(ResourceLoader.getLoadedAssets().stairs, TOP_LEFT_WALL_PATH);
    this.gameObject.setImage(topLeftWallImage);

    this.gameObject.addHook('before', (context, camera) => {
      context.globalAlpha = 0.7;
    });
    this.gameObject.addHook('after', (context, camera) => {
      context.globalAlpha = 1;
    });
  }
}

export class Stairs extends DrawableEntity {
  private topLeftWallEntity: TopLeftStairsWallEntity | null = null;

  public getWidth___TODO_DELETE_IT(): number {
    return this.getGameObject().getBox().getWidth();
  }

  public getHeight__TODO_DELETE_IT(): number {
    return this.getGameObject().getBox().getWidth();
  }

  public constructor(private x: number, private y: number, private scale: number = 2) {
    super();
    const imageBox = new Box(
      new Position(x, y),
      DEFAULT_WIDTH * scale, DEFAULT_HEIGHT * scale
    );
    this.gameObject = new GameObject();
    this.gameObject.setBox(imageBox);
    this.gameObject.setZIndex(-1);

    const backgroundImage = ResourceLoader.getLoadedAssets().stairs;
    this.gameObject.setImage(backgroundImage);

    for (const box of BOXES) {
      const point1 = box[0];
      const point2 = box[1];

      const scaledPoint1 = {
        x: x + point1.x * this.scale,
        y: y + point1.y * this.scale,
      };

      const scaledPoint2 = {
        x: x + point2.x * this.scale,
        y: y + point2.y * this.scale,
      };

      const topLeftX = Math.min(scaledPoint1.x, scaledPoint2.x);
      const topLeftY =  Math.min(scaledPoint1.y, scaledPoint2.y);

      const width = Math.abs(scaledPoint1.x - scaledPoint2.x);
      const height = Math.abs(scaledPoint1.y - scaledPoint2.y);

      const collidableGameObject = new GameObject();
      // collidableGameObject.setColor('#000')
      collidableGameObject.setIsCollidable(true);
      collidableGameObject.setBox(new Box(
        new Position(topLeftX, topLeftY),
        width, height
      ));

      this.gameObject.addChild(collidableGameObject);
    }
  }

  public initEntity() {
    super.initEntity();
    const entityManager = this.getEntityManager();

    const topLeftWallEntity = new TopLeftStairsWallEntity(this.x, this.y, this.scale);
    entityManager.addToScene(topLeftWallEntity);
    entityManager.addEntity(topLeftWallEntity);

    this.topLeftWallEntity = topLeftWallEntity;
  }

  public destroy() {
    super.destroy();

    if (this.topLeftWallEntity) {
      this.getEntityManager().removeEntity(this.topLeftWallEntity);
    }
  }
}
