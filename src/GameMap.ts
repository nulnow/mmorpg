import { Entity } from './Entity';
import { Scene } from './types';
import { Position } from './Rendering/Position';

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

  public findEntities(point: Position, maxDistance: number = GameMap.MAX_DISTANCE): Entity[] {
    return this.scene.entities.filter((entity) => {
      const center = entity.getBox().getCenter();
      const distance = Math.sqrt((center.x - point.x) ** 2 + (center.y - point.y) ** 2);
      return distance <= maxDistance;
    });
  }
}
