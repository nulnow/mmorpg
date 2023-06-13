import { Box } from './Box';
import { FiniteStateMachine } from '../StateMachine/FiniteStateMachine';
import { Camera } from '../Camera/Camera';
import { Rotation } from './Rotation';
import { ResourceLoader } from '../ResourceLoader';
import { removeOneFromArray } from '../JSHACKS';
import { UnsubscribeFn } from '../EventEmitter';
// import { FireStateMachine } from '../Buildings/FireStateMachine';

export type DrawHook = (context: CanvasRenderingContext2D, camera: Camera) => void;

export class GameObject {
  protected box!: Box;
  protected children: GameObject[] = [];
  protected finiteStateMachine: FiniteStateMachine;
  protected rotation: Rotation = new Rotation(123);
  protected collidable: boolean = false;
  protected color: string | null = null;
  protected patternImage: HTMLImageElement | null = null;
  protected image: HTMLImageElement | null = null;
  protected zIndex = 0;
  public getZIndex(): number {
    return this.zIndex;
  }
  public setZIndex(zIndex: number): this {
    this.zIndex = zIndex;
    return this;
  }

  public constructor(finiteStateMachine: FiniteStateMachine = new FiniteStateMachine()) {
    this.finiteStateMachine = finiteStateMachine;
  }

  public getImage(): HTMLImageElement | null {
    return this.image;
  }
  public setImage(image: HTMLImageElement): this {
    this.image = image;
    return this;
  }

  public getPatternImage(): HTMLImageElement | null {
    return this.patternImage;
  }

  public setPatternImage(patternImage: HTMLImageElement): this {
    this.patternImage = patternImage;
    return this;
  }

  public getColor(): string | null {
    return this.color;
  }

  public setColor(color: string | null): this {
    this.color = color;
    return this;
  }

  public isCollidable(): boolean {
    return this.collidable;
  }

  public setIsCollidable(value: boolean): this {
    this.collidable = value;
    return this;
  }

  private rightToLeft = true;
  public getIsRightToLeft(): boolean {
    return this.rightToLeft;
  }
  public setIsRightToLeft(val: boolean): this {
    this.rightToLeft = val;
    return this;
  }

  public getBox(): Box {
    return this.box;
  }

  public setBox(box: Box): this {
    this.box = box;
    return this;
  }

  public getRotation(): Rotation {
    return this.rotation;
  }

  public setRotation(rotation: Rotation | number): this {
    if (rotation instanceof Rotation) {
      this.rotation = rotation;
    }
    if (typeof rotation === 'number') {
      this.rotation.set(rotation);
    }

    return this;
  }

  public getAllTheBoxes(): Box[] {
    const boxes: Box[] = [];

    if (this.box) {
      boxes.push(this.box);
    }

    for (const child of this.children) {
      const childBoxes = child.getAllTheBoxes();

      for (const box of childBoxes) {
        boxes.push(box);
      }
    }

    return boxes;
  }

  public getChildren(): GameObject[] {
    return this.children;
  }

  public getAllCollidables(): GameObject[] {
    const result = [];
    if (this.isCollidable()) {
      result.push(this);
    }

    for (const child of this.children) {
      const collidable = child.getAllCollidables();

      for (const grandChild of collidable) {
        result.push(grandChild);
      }
    }

    return result;
  }

  public addChild(child: GameObject) {
    this.children.push(child);
  }

  public removeChild(child: GameObject) {
    removeOneFromArray(this.children, c => c !== child);
  }

  public update(timeElapsed: number) {
    this.finiteStateMachine.update(timeElapsed);

    for (const child of this.children) {
      child.update(timeElapsed);
    }
  }

  public getCurrentSprite(): HTMLImageElement | null {
    return this.finiteStateMachine.getCurrentState()?.getCurrentSprite() ?? null;
  };

  private drawHooks = {
    before: [] as DrawHook[],
    after: [] as DrawHook[],
  };
  public addHook(key: 'before' | 'after', hook: DrawHook): UnsubscribeFn {
    this.drawHooks[key].push(hook);

    return () => {
      this.removeHook(key, hook);
    };
  }
  public removeHook(key: 'before' | 'after', hook: DrawHook): this {
    removeOneFromArray(this.drawHooks[key], (h) => h === hook);
    return this;
  }
  public draw(context: CanvasRenderingContext2D, camera: Camera): void {
    for (const hook of this.drawHooks.before) {
      hook(context, camera);
    }

    if (this.box) {
      const relationalEntityCoordinates = camera.getRelativeCoordinates(this.box).getRect();

      const currentSprite = this.getCurrentSprite();

      if (this.color) {
        context.save();
        context.fillStyle = this.color;
        context.fillRect(
          relationalEntityCoordinates.left,
          relationalEntityCoordinates.top,
          relationalEntityCoordinates.width,
          relationalEntityCoordinates.height,
        );
        context.restore();
      }

      if (this.patternImage) {
        const pattern = ResourceLoader.pattern(this.patternImage, context);
        context.save();
        context.fillStyle = pattern;
        context.fillRect(
          relationalEntityCoordinates.left,
          relationalEntityCoordinates.top,
          relationalEntityCoordinates.width,
          relationalEntityCoordinates.height,
        );
        context.restore();
      }

      if (this.image) {
        context.drawImage(
          this.image,
          relationalEntityCoordinates.left,
          relationalEntityCoordinates.top,
          relationalEntityCoordinates.width,
          relationalEntityCoordinates.height,
        );
      }

      if (currentSprite instanceof HTMLImageElement) {
        try {
          context.drawImage(
            currentSprite,
            relationalEntityCoordinates.left,
            relationalEntityCoordinates.top,
            relationalEntityCoordinates.width,
            relationalEntityCoordinates.height,
          );
        } catch (error) {
          debugger;
        }
      }
    }

    for (const child of this.children) {
      child.draw(context, camera);
    }

    for (const hook of this.drawHooks.after) {
      hook(context, camera);
    }
  }

  public destroy() {
    for (const child of this.children) {
      child.destroy();
    }
  }
}
