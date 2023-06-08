import { DrawableEntity } from '../Rendering/DrawableEntity';
import { GameObject } from '../Rendering/GameObject';
import { ResourceLoader } from '../ResourceLoader';
import { Box } from '../Rendering/Box';
import { Position } from '../Rendering/Position';

const BASE_WIDTH = 112;
const BASE_HEIGHT = 160;

export class TreeEntity extends DrawableEntity {
  public constructor(
    private x: number,
    private y: number,
    private index: number = 0,
    private isRightToLeft: boolean = true,
    private scale: number = 1,
  ) {
    super();
    const tree = new GameObject();
    tree.setBox(new Box(
      new Position(this.x, this.y, 0),
      BASE_WIDTH * this.scale, BASE_HEIGHT * this.scale
    ));
    tree.setImage(ResourceLoader.getLoadedAssets().treeSprite.getSpriteByIndex(this.index));
    tree.setIsCollidable(false);
    tree.setIsRightToLeft(this.isRightToLeft);

    const collidableBox = new GameObject();
    collidableBox.setIsCollidable(true);
    collidableBox.setBox(new Box(
      new Position(this.x + (BASE_WIDTH * this.scale) / 4, this.y + BASE_HEIGHT * this.scale * (3 / 4), 0),
      (BASE_WIDTH * this.scale) / 2, (BASE_HEIGHT * this.scale / 4) / 5
    ));
    tree.addChild(collidableBox);

    this.gameObject = tree;
  }
}
