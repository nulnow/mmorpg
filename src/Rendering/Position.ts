export class Position {
  private readonly pos: [number, number, number] = [0, 0, 0];

  public get x(): number { return this.pos[0]; }
  public set x(val: number) {
    this.pos[0] = val;
  }

  public get y(): number { return this.pos[1]; }
  public set y(val: number) {
    this.pos[1] = val;
  }

  public get z(): number { return this.pos[2]; }
  public set z(val: number) {
    this.pos[2] = val;
  }

  public constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public toArray(): [number, number, number] {
    return [...this.pos];
  }

  public copy(): Position {
    return new Position(this.pos[0], this.pos[1], this.pos[2]);
  }

  public getAngle(pos: Position): number {
    return Math.atan2(this.y - pos.y, this.x - pos.x);
  }

  public distance(pos: Position): number {
    return Math.sqrt( Math.pow(this.x - pos.x, 2) + Math.pow(this.y - pos.y, 2));
  }

  public getVector(pos: Position): Position {
    const copy = this.copy();
    copy.x = this.x - pos.x;
    copy.y = this.y - pos.y;
    return copy;
  }

  public addVector(pos: Position): void {
    this.x += pos.x;
    this.y += pos.y;
  }
}
