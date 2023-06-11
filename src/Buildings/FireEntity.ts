import { GameObject } from '../Rendering/GameObject';
import { Position } from '../Rendering/Position';
import { Box } from '../Rendering/Box';
import { FireStateMachine } from './FireStateMachine';
import { DrawableEntity } from '../Rendering/DrawableEntity';
import { SpriteFilter } from '../Rendering/Sprite';

export class FireEntity extends DrawableEntity {
  protected readonly gameObject: GameObject;
  protected readonly finiteStateMachine: FireStateMachine;

  public constructor(
    protected x: number,
    protected y: number,
    protected width: number,
    protected height: number,
    spriteFilter?: SpriteFilter,
  ) {
    super();
    this.finiteStateMachine = new FireStateMachine(this, spriteFilter);
    this.gameObject = new GameObject(this.finiteStateMachine);
    this.gameObject.setBox(new Box(
      new Position(x, y, 0),
      width,
      height,
    ));
    this.gameObject.setIsCollidable(false);
  }

  public getGameObject(): GameObject {
    return this.gameObject;
  }

  public update(timeElapsed: number) {
    super.update(timeElapsed);
    this.finiteStateMachine.update(timeElapsed);
  }
}

