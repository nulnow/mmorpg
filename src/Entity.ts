import { Component } from './Component';
import { EntityManager } from './EntityManager';
import { EventEmitter } from './EventEmitter';
import { Position } from './Rendering/Position';
import { Rotation } from './Rendering/Rotation';
import { Box } from './Rendering/Box';

export class Entity {
  public readonly emitter = new EventEmitter();
  // TODO
  public COLOR = '#212121';

  private position = new Position(0, 0, 0);
  public getPosition(): Position { return this.position; }
  public setPosition(newPosition: Position) { this.position = newPosition; }

  private box: Box;
  public getBox(): Box { return this.box };
  public setBox(newBox: Box): void { this.box = newBox };

  private rotation = new Rotation(0);
  public getRotation(): Rotation { return this.rotation; }
  public setRotation(newRotation: Rotation): void { this.rotation = newRotation; }

  private name = '';
  public getName() { return this.name };
  public setName(name: string): void { this.name = name; }

  private components: Record<string, Component> = {};

  private entityManager?: EntityManager;
  public getEntityManager(): EntityManager { return this.entityManager!; }
  public setEntityManager(entityManager: EntityManager): void { this.entityManager = entityManager; }

  public constructor() {
    this.box = new Box(
      new Position(50, 50, 0),
      new Position(100, 100, 0),
    );
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
}
