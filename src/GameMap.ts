import { Entity } from './Entity';
import { Scene } from './types';
import { Position } from './Rendering/Position';
import { IDrawableEntity } from './Rendering/IDrawableEntity';
import { GameObject } from './Rendering/GameObject';

export class GameMap extends Entity {
  private static MAX_DISTANCE = Infinity;

  private scene: Scene;

  public constructor(scene: Scene) {
    super();
    this.scene = scene;
  }

  public add(entity: Entity): void {
    this.scene.entities.push(entity);
  }

  public findEntities(point: Position, maxDistance: number = GameMap.MAX_DISTANCE, filter: (e: Entity) => boolean = () => true): Entity[] {
    return this.scene.entities.filter((entity) => {
      // TODO!!!
      const center = entity.getGameObject?.()?.getBox()?.getCenter();
      if (!center) {
        return false;
      }
      const distance = Math.sqrt((center.x - point.x) ** 2 + (center.y - point.y) ** 2);
      return distance <= maxDistance && filter(entity);
    });
  }

  public getCollidableGameObjects(): GameObject[] {
    return this.scene.entities.reduce((result, entity) => {
      if (!entity.getGameObject) {
        return result;
      }
      const gameObject = (entity as any as IDrawableEntity).getGameObject();
      const collidable = gameObject.getAllCollidables();

      collidable.forEach(c => {
        result.push(c);
      });

      return result;
    }, [] as GameObject[]);
  }
}
