import { DrawableEntity } from '../Rendering/DrawableEntity';
import { Box } from '../Rendering/Box';
import { Position } from '../Rendering/Position';
import { GameObject } from '../Rendering/GameObject';
import { ResourceLoader } from '../ResourceLoader';
import { TREE_POINTS, TREE_BOXES, MINI_TREE_POINTS, MINI_TREE_BOXES } from './GiantTreeCONSTS';

const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 2071;

class MiniTree extends DrawableEntity {
  public constructor(private x: number, private y: number, private scale: number) {
    super();

    const box = new Box(
      new Position(x, y),
      DEFAULT_WIDTH * scale, DEFAULT_HEIGHT * scale
    );
    this.gameObject = new GameObject();
    this.gameObject.setBox(box);
    this.gameObject.setZIndex(1);

    const topLeftWallImage = ResourceLoader.cropImageByPath(ResourceLoader.getLoadedAssets().giantTree, MINI_TREE_POINTS);
    this.gameObject.setImage(topLeftWallImage);

    this.gameObject.addHook('before', (context, camera) => {
      context.globalAlpha = 0.7;
    });
    this.gameObject.addHook('after', (context, camera) => {
      context.globalAlpha = 1;
    });

    for (const box of MINI_TREE_BOXES) {
      const point1 = box[0];
      const point2 = box[1];

      const scaledPoint1 = {
        x: point1.x * this.scale,
        y: point1.y * this.scale,
      };

      const scaledPoint2 = {
        x: point2.x * this.scale,
        y: point2.y * this.scale,
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
}

class Tree extends DrawableEntity {
  public constructor(private x: number, private y: number, private scale: number) {
    super();

    const box = new Box(
      new Position(x, y),
      DEFAULT_WIDTH * scale, DEFAULT_HEIGHT * scale
    );
    this.gameObject = new GameObject();
    this.gameObject.setBox(box);
    this.gameObject.setZIndex(1);

    const topLeftWallImage = ResourceLoader.cropImageByPath(ResourceLoader.getLoadedAssets().giantTree, TREE_POINTS);
    this.gameObject.setImage(topLeftWallImage);

    this.gameObject.addHook('before', (context, camera) => {
      context.globalAlpha = 0.7;
    });
    this.gameObject.addHook('after', (context, camera) => {
      context.globalAlpha = 1;
    });
  }
}

export class GiantTree extends DrawableEntity {
  private tree: Tree | null = null;
  private miniTree: MiniTree | null = null;

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

    const backgroundImage = ResourceLoader.getLoadedAssets().giantTree;
    this.gameObject.setImage(backgroundImage);

    for (const box of TREE_BOXES) {
      const point1 = box[0];
      const point2 = box[1];

      const scaledPoint1 = {
        x: point1.x * this.scale,
        y: point1.y * this.scale,
      };

      const scaledPoint2 = {
        x: point2.x * this.scale,
        y: point2.y * this.scale,
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

    const tree = new Tree(this.x, this.y, this.scale);
    entityManager.addToScene(tree);
    entityManager.addEntity(tree);

    const miniTree = new MiniTree(this.x, this.y, this.scale);
    entityManager.addToScene(miniTree);
    entityManager.addEntity(miniTree);

    this.tree = tree;
    this.miniTree = miniTree;
  }

  public destroy() {
    super.destroy();

    if (this.tree) {
      this.getEntityManager().removeEntity(this.tree);
    }

    if (this.miniTree) {
      this.getEntityManager().removeEntity(this.miniTree);
    }
  }
}
