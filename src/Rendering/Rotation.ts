export class Rotation {
  private value = 0;

  public constructor(value: number) {
    this.value = value;
  }

  public get(): number {
    return this.value;
  }

  public set(val: number): this {
    this.value = val;
    return this;
  }

  public add(val: number) {
    this.value += val;
  }

  public isLeft(): boolean {
    const value = this.value % (Math.PI * 2);
    const toReturn = (
      Math.abs(value)
      >
      (Math.PI / 2)
    );

    return toReturn;
  }

  public isRight(): boolean {
    return !this.isLeft();
  }
}
