import { Entity } from './Entity';

export class EntityManager {
  private ids = 0;

  private entitiesMap: Record<string, Entity> = {};
  private entities: Entity[] = [];

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

  public update(timeElapsed: number): void {
    const dead: Entity[] = [];
    const alive: Entity[] = [];
    for (let i = 0; i < this.entities.length; ++i) {
      const entity = this.entities[i];

      entity.update(timeElapsed);

      if (entity.isDead()) {
        dead.push(entity);
      } else {
        alive.push(entity);
      }
    }

    for (let i = 0; i < dead.length; ++i) {
      const e = dead[i];
      delete this.entitiesMap[e.getName()];
      e.destroy();
    }

    this.entities = alive;
  }
}
