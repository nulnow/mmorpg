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

    const collidableGameObjects = gameMap.getCollidableGameObjects();

    return collidableGameObjects.filter((obj) => {
      return obj !== this.getGameObject() && boxToFindCollisionsWith.isCollide(obj.getBox());
    });
  }

  public distance(entity: DrawableEntity): number {
    return this.getGameObject().getBox().getTopLeft().distance(
      entity.getGameObject().getBox().getTopLeft()
    );
  }
}
