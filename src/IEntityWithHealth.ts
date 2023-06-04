import { Entity } from './Entity';

export class Health {
  public constructor(
    private value: number,
    private maxValue: number,
  ) {}

  public getValue() {
    return this.value;
  }
  public setValue(value: number): void {
    this.value = value
  }

  public getMaxValue(): number {
    return this.maxValue;
  }
  public setMaxValue(maxValue: number): void {
    this.maxValue = maxValue;
  }

  public getPercent(): number {
    return this.value / this.maxValue;
  }
}

export interface IEntityWithHealth {
  getHealth(): Health;
  setHealth(value: number): void;
  damage(value: number, from: Entity): void;
}
