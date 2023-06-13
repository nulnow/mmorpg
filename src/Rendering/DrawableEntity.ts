import { IDrawableEntity } from './IDrawableEntity';
import { GameObject } from './GameObject';
import { Entity } from '../Entity';
import { Box } from './Box';

export class DrawableEntity extends Entity implements IDrawableEntity {
  protected gameObject!: GameObject;

  public getGameObject(): GameObject {
    return this.gameObject;
  }

  public setGameObject(gameObject: GameObject): this {
    this.gameObject = gameObject;
    return this;
  }

  public findCollisions(boxToFindCollisionsWith: Box): GameObject[] {
    const collidableGameObjects = this.getEntityManager().getCollidableGameObjects();

    return collidableGameObjects.filter((obj) => {
      return obj !== this.getGameObject() && boxToFindCollisionsWith.isCollide(obj.getBox());
    });
  }

  public distanceTo(entity: DrawableEntity): number {
    return this.getGameObject().getBox().getTopLeft().distance(
      entity.getGameObject().getBox().getTopLeft()
    );
  }
}
