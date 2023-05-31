import { Component } from './Component';
import { EntityManager } from './EntityManager';
import { EventEmitter } from './EventEmitter';
import { Box } from './Rendering/Box';
import { GameObject } from './Rendering/GameObject';
import { GameMap } from './GameMap';

export class Entity {
  public readonly emitter = new EventEmitter();
  // TODO
  public COLOR = '#212121';

  private name = '';
  public getName() { return this.name };
  public setName(name: string): void { this.name = name; }

  private components: Record<string, Component> = {};

  private entityManager?: EntityManager;
  public getEntityManager(): EntityManager { return this.entityManager!; }
  public setEntityManager(entityManager: EntityManager): void { this.entityManager = entityManager; }

  public constructor() {

  }

  public isDead() {
    return false;
  }

  public initEntity(): void {
    for (const componentName in this.components) {
      this.components[componentName].initEntity();
    }
  }

  public addComponent(c: Component): void {
    c.setParent(this);
    this.components[c.constructor.name] = c;
    c.init();
  }

  public getComponentByName(name: string): Component {
    return this.components[name];
  }

  public destroy() {
    for (const componentName in this.components) {
      this.components[componentName].destroy();
    }
  }

  public update(timeElapsed: number) {
    for (const componentName in this.components) {
      this.components[componentName].update(timeElapsed);
    }
  }

  public findCollisions(boxToFindCollisionsWith: Box): GameObject[] {
    const gameMap = this.getEntityManager().getEntityByName('map') as any as GameMap;

    const collidableGameObjects = gameMap.getCollidableGameObjects().filter(obj => obj !== this.getGameObject());

    return collidableGameObjects.filter((gameObject) => {
      return boxToFindCollisionsWith.isCollide(gameObject.getBox());
    });
  }
}
