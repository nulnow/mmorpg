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

  public isLeft(): boolean {
    const value = this.value % (Math.PI * 2);
    return (
      Math.abs(value)
      >
      (Math.PI / 2)
    );
  }

  public isRight(): boolean {
    return !this.isLeft();
  }
}
