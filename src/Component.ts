import { Entity } from './Entity';

export abstract class Component {
  protected parent!: Entity;

  public setParent(parent: Entity): void {
    this.parent = parent;
  }

  public init(): void {};
  public destroy(): void {};
  public initEntity(): void {};
  public update(timeElapsed: number): void {};
}
