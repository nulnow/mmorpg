import { IDrawableEntity } from './IDrawableEntity';
import { GameObject } from './GameObject';
import { Entity } from '../Entity';
import { Box } from './Box';
import { GameMap } from '../GameMap';

export class DrawableEntity extends Entity implements IDrawableEntity {
  protected gameObject!: GameObject;

  public getGameObject(): GameObject {
    return this.gameObject;
  }

  public setGameObject(gameObject: GameObject): void {
    this.gameObject = gameObject;
  }

  public findCollisions(boxToFindCollisionsWith: Box): GameObject[] {
    const gameMap = this.getEntityManager().getEntityByName('map') as any as GameMap;

    const collidableGameObjects = gameMap.getCollidableGameObjects().filter(obj => obj !== this.getGameObject());

    return collidableGameObjects.filter((gameObject) => {
      return boxToFindCollisionsWith.isCollide(gameObject.getBox());
    });
  }
}
