import { Component } from './Component';
import { EntityManager } from './EntityManager';
import { EventEmitter } from './EventEmitter';

export class Entity {
  public readonly emitter = new EventEmitter();

  // private children: Entity[] = [];
  // public getChildren(): Entity[] {
  //   return this.children;
  // }
  // public addChild(entity: Entity): this {
  //   this.children.push(entity);
  //
  //   return this;
  // }
  // public removeChild(entity: Entity): this {
  //   removeOneFromArray(this.children, e => e === entity);
  //
  //   return this;
  // }

  private tags: string[] = [];
  public addTag(tag: string): void {
    this.tags.push(tag);
  }
  public hasTag(tag: string): boolean {
    return this.tags.includes(tag);
  }

  private name = '';
  public getName() { return this.name };
  public setName(name: string): void { this.name = name; }

  private components: Record<string, Component> = {};

  private entityManager?: EntityManager;
  public getEntityManager(): EntityManager { return this.entityManager!; }
  public setEntityManager(entityManager: EntityManager): void { this.entityManager = entityManager; }

  public constructor() {}

  public initEntity(): void {
    for (const componentName in this.components) {
      this.components[componentName].initEntity();
    }
  }

  public addComponent(c: Component): void {
    c.setParent(this);
    this.components[c.constructor.name] = c;
    c.init();
    console.log('addComponent');
    console.log(c);
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
