import { DrawableEntity } from '../Rendering/DrawableEntity';
import { GameObject } from '../Rendering/GameObject';
import { ResourceLoader } from '../ResourceLoader';
import { Box } from '../Rendering/Box';
import { Position } from '../Rendering/Position';
import { STAIRS_COLLISION_BOXES, STAIRS_NAMED_RECTS, STAIRS_TOP_LEFT_WALL_PATH } from './StairsCONSTS';

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

    const topLeftWallImage = ResourceLoader.cropImageByPath(ResourceLoader.getLoadedAssets().stairs, STAIRS_TOP_LEFT_WALL_PATH);
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

  private readonly topStairsTeleportBox: Box;
  public getTopStairsTeleportBox(): Box {
    return this.topStairsTeleportBox;
  }

  private readonly bottomStairsTeleportBox: Box;
  public getBottomStairsTeleportBox(): Box {
    return this.bottomStairsTeleportBox;
  }

  private readonly stairsSpawnArea: Box;
  public getStairsSpawnArea(): Box {
    return this.stairsSpawnArea;
  }

  public constructor(protected x: number, protected y: number, protected scale: number = 2) {
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

    for (const box of STAIRS_COLLISION_BOXES) {

      const collisionBox = Box.fromMarkupRect(
        box,
        { scale: this.scale }
      );
      collisionBox.move(x, y);

      const collidableGameObject = new GameObject();
      collidableGameObject.setIsCollidable(true);
      collidableGameObject.setBox(collisionBox);

      this.gameObject.addChild(collidableGameObject);
    }

    this.topStairsTeleportBox = Box.fromMarkupRect(STAIRS_NAMED_RECTS.stairsTopTeleport, { scale: this.scale }).move(x, y);
    this.bottomStairsTeleportBox = Box.fromMarkupRect(STAIRS_NAMED_RECTS.stairsBottomTeleport, { scale: this.scale }).move(x, y);
    this.stairsSpawnArea = Box.fromMarkupRect(STAIRS_NAMED_RECTS.stairsSpawnArea, { scale: this.scale }).move(x, y);
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
