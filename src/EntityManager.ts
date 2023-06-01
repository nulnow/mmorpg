import { Entity } from './Entity';
import { Scene } from './types';
import { IDrawableEntity } from './Rendering/IDrawableEntity';

export class EntityManager {
  private ids = 0;

  private entitiesMap: Record<string, Entity> = {};
  private entities: Entity[] = [];

  public constructor(private scene: Scene) {}

  private generateName(): string {
    this.ids += 1;

    return '__name__' + this.ids;
  }

  public addEntity(entity: Entity, entityName?: string): void {
    if (!entityName) {
      entityName = this.generateName();
    }

    this.entitiesMap[entityName] = entity;
    this.entities.push(entity);

    entity.setEntityManager(this);
    entity.setName(entityName);
    entity.initEntity();
  }

  public getEntityByName(name: string): Entity {
    return this.entitiesMap[name];
  }

  public filterEntities(callback: (entity: Entity) => boolean): Entity[] {
    return this.entities.filter(callback);
  }

  private lastSortTime = 0;
  private sortIntervalSEC = 1.5;

  private timePassed = 0;

  public update(timeElapsed: number): void {
    this.lastSortTime += timeElapsed;
    this.timePassed += timeElapsed;

    if ((this.timePassed / 1000) > 4) {
      this.scene.camera.setFilter("none");
    } else {
      this.scene.camera.setFilter(`grayscale(${(100 / (this.timePassed / 1000)) + 10}%)`);
    }

    if (this.lastSortTime >= (1000 / this.sortIntervalSEC)) {
      this.lastSortTime = 0;
      this.scene.entities.sort((a, b) => {
        const pos1 = (a as any as IDrawableEntity)?.getGameObject?.()?.getBox?.()?.getTopLeft?.();
        const pos2 = (b as any as IDrawableEntity)?.getGameObject?.()?.getBox?.()?.getTopLeft?.();

        if (!pos1 || !pos2) {
          return 0;
        }

        return pos1.y - pos2.y;
      });
    }

    for (let i = 0; i < this.entities.length; ++i) {
      const entity = this.entities[i];
      entity.update(timeElapsed);
    }
  }
}
