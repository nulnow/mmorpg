import { Entity } from './Entity';
import { Component } from './Component';
import { IDrawableEntity } from './Rendering/IDrawableEntity';
import { GameObject } from './Rendering/GameObject';

export abstract class Item extends Entity implements IDrawableEntity {
  public abstract getName(): string;
  public abstract getGameObject(): GameObject;
  public abstract getDamage(): number;
  public abstract getProtection(): number;
}

export class Knife extends Item implements IDrawableEntity {
  public getName(): string {
      return 'Knife'
  }

  private gameObject: GameObject = new GameObject();

  public getGameObject(): GameObject {
    return this.gameObject;
  }

  public getDamage(): number {
    return 10;
  }

  public getProtection(): number {
    return 10;
  }
}

export class InventoryComponent extends Component {
  public init(): void {};
  public destroy(): void {};
  public initEntity(): void {};
  public update(timeElapsed: number): void {};
}
