export class Rotation {
  private value = 0;

  public constructor(value: number) {
    this.value = value;
  }

  public get(): number {
    return this.value;
  }

  public set(val: number) {
    this.value = val;
  }
}
