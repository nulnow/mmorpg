import { Box } from './Box';
import { FiniteStateMachine } from '../StateMachine/FiniteStateMachine';
import { Camera } from '../Camera/Camera';
import { Rotation } from './Rotation';
import { ResourceLoader } from '../ResourceLoader';
// import { FireStateMachine } from '../Buildings/FireStateMachine';

export class GameObject {
  protected box!: Box;
  protected children: GameObject[] = [];
  protected finiteStateMachine: FiniteStateMachine;
  protected rotation: Rotation = new Rotation(123);
  protected collidable: boolean = false;
  protected color: string | null = null;
  protected patternImage: HTMLImageElement | null = null;
  protected image: HTMLImageElement | null = null;

  public constructor(finiteStateMachine: FiniteStateMachine = new FiniteStateMachine()) {
    this.finiteStateMachine = finiteStateMachine;
  }

  public getImage(): HTMLImageElement | null {
    return this.image;
  }
  public setImage(image: HTMLImageElement): void {
    this.image = image;
  }

  public getPatternImage(): HTMLImageElement | null {
    return this.patternImage;
  }

  public setPatternImage(patternImage: HTMLImageElement): void {
    this.patternImage = patternImage;
  }

  public getColor(): string | null {
    return this.color;
  }

  public setColor(color: string | null): void {
    this.color = color;
  }

  public isCollidable(): boolean {
    return this.collidable;
  }

  public setIsCollidable(value: boolean): void {
    this.collidable = value;
  }

  public isRightToLeft(): boolean {
    return true;
  }

  public getBox(): Box {
    return this.box;
  }

  public setBox(box: Box): void {
    this.box = box;
  }

  public getRotation(): Rotation {
    return this.rotation;
  }

  public setRotation(rotation: Rotation | number): void {
    if (rotation instanceof Rotation) {
      this.rotation = rotation;
    }
    if (typeof rotation === 'number') {
      this.rotation.set(rotation);
    }
  }

  public getAllTheBoxes(): Box[] {
    const boxes: Box[] = [];

    if (this.box) {
      boxes.push(this.box);
    }

    this.children.forEach((child) => {
      const childBoxes = child.getAllTheBoxes();
      childBoxes.forEach(box => {
        boxes.push(box);
      });
    });

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

    this.children.forEach(child => {
      const collidable = child.getAllCollidables();
      collidable.forEach(grandChild => {
        result.push(grandChild);
      });
    });

    return result;
  }

  public addChild(child: GameObject) {
    this.children.push(child);
  }

  public removeChild(child: GameObject) {
    this.children = this.children.filter(c => c !== child);
  }

  public update(timeElapsed: number) {
    this.finiteStateMachine.update(timeElapsed);

    this.getChildren().forEach(child => {
      child.update(timeElapsed);
    });
  }

  public getCurrentSprite(): HTMLImageElement | null {
    return this.finiteStateMachine.getCurrentState()?.getCurrentSprite() ?? null;
  };

  public draw(context: CanvasRenderingContext2D, camera: Camera): void {
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

    this.getChildren().forEach((child) => {
      child.draw(context, camera);
    });
  }
}