import { Entity } from './Entity';
import { Scene } from './types';
import { IDrawableEntity } from './Rendering/IDrawableEntity';
import { DrawableEntity } from './Rendering/DrawableEntity';
import { EventEmitter } from './EventEmitter';
import { GAME_EVENTS } from './GAME_EVENTS';
import { Position } from './Rendering/Position';
import { GameObject } from './Rendering/GameObject';

export class EntityManager {
  public emitter = new EventEmitter();
  private ids = 0;

  private entitiesMap: Record<string, Entity> = {};
  private entities: Entity[] | null = [];
  private scene: Scene | null = null;

  public constructor(scene: Scene) {
    this.scene = scene;
  }

  public addToScene(drawableEntity: DrawableEntity): void {
    this.scene!.entities.push(drawableEntity);
  }

  private generateName(): string {
    this.ids += 1;

    return '__name__' + this.ids;
  }

  public addEntity(entity: Entity, entityName?: string): void {
    if (!entityName) {
      entityName = this.generateName();
    }

    this.entitiesMap[entityName] = entity;
    this.entities!.push(entity);

    entity.setEntityManager(this);
    entity.setName(entityName);
    entity.initEntity();

    entity.emitter.subscribe(GAME_EVENTS.KILLED_EVENT, (data) => {
      this.emitter.emit(GAME_EVENTS.KILLED_EVENT, data);
    });
  }

  public removeEntity(entity: Entity, destroy = true): void {
    Object.entries(this.entitiesMap).forEach(([key, value]) => {
      if (value === entity) {
        delete this.entitiesMap[key];
        this.scene!.entities = this.scene!.entities.filter(e => e !== entity);
      }
    });
    this.entities = this.entities!.filter(e => e !== entity);
    if (destroy) {
      entity.destroy();
      (entity as any as DrawableEntity).getGameObject?.().destroy();
    }
  }

  public removeEntityByName(name: string): void {
    const entity = this.getEntityByName(name);
    if (entity) {
      delete this.entitiesMap[name];
      this.scene!.entities = this.scene!.entities.filter(e => e !== entity);
    }
  }

  // public removeEntity(entity: Entity): void {
  //   for (const key in this.entitiesMap) {
  //     const e = this.entitiesMap[key];
  //     if (e === entity) {
  //       delete this.entitiesMap[key];
  //       removeOnFromArray(this.scene.entities, e => e !== entity)
  //       break;
  //     }
  //   }
  //   removeOnFromArray(this.entities, e => e !== entity)
  //   entity.destroy();
  //   (entity as any as DrawableEntity).getGameObject().destroy();
  // }
  //
  // public removeEntityByName(name: string): void {
  //   const entity = this.getEntityByName(name);
  //   if (entity) {
  //     delete this.entitiesMap[name];
  //     removeOnFromArray(this.scene.entities, e => e !== entity)
  //   }
  // }

  public getEntityByName(name: string): Entity {
    return this.entitiesMap[name];
  }

  public filterEntities(callback: (entity: Entity) => boolean): Entity[] {
    return this.entities!.filter(callback);
  }

  public findEntities(point: Position, maxDistance: number = Infinity, filter: (e: Entity) => boolean = () => true): Entity[] {
    return this.scene!.entities.filter((entity) => {
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
    return this.scene!.entities.reduce((result, entity) => {
      if (!(entity as DrawableEntity).getGameObject) {
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

  private lastSortTime = 0;
  private sortIntervalSEC = 0.3;

  public update(timeElapsed: number): void {
    this.lastSortTime += timeElapsed;

    if ((this.lastSortTime) >= (this.sortIntervalSEC * 1000)) {
      this.lastSortTime = 0;
      (this.scene!.entities as DrawableEntity[]).sort((a, b) => {
        const z1 = a.getGameObject().getZIndex();
        const z2 = b.getGameObject().getZIndex();
        if (z1 !== z2) {
          return z1 - z2;
        }

        const posY1 = a?.getGameObject?.()?.getBox?.()?.getBottom?.() ?? -Infinity;
        const posY2 = b?.getGameObject?.()?.getBox?.()?.getBottom?.() ?? -Infinity;

        return posY1 - posY2;
      });
    }

    for (const entity of this.entities!) {
      entity.update(timeElapsed);
    }
  }

  public destroy(): void {
    for (const entity of this.entities!) {
      entity.destroy();
    }

    this.entities = null;
    this.scene = null;
  }
}
