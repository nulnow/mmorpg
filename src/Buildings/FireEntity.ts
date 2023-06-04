import { GameObject } from '../Rendering/GameObject';
import { Position } from '../Rendering/Position';
import { Box } from '../Rendering/Box';
import { FireStateMachine } from './FireStateMachine';
import { DrawableEntity } from '../Rendering/DrawableEntity';

export class FireEntity extends DrawableEntity {
  protected readonly gameObject: GameObject;
  protected readonly finiteStateMachine: FireStateMachine;

  public constructor(
    private x: number,
    private y: number,
    private width: number,
    private height: number,
  ) {
    super();
    this.finiteStateMachine = new FireStateMachine(this);
    this.gameObject = new GameObject(this.finiteStateMachine);
    this.gameObject.setBox(new Box(
      new Position(x, y, 0),
      width,
      height,
    ));
  }

  public getGameObject(): GameObject {
    return this.gameObject;
  }

  public update(timeElapsed: number) {
    super.update(timeElapsed);
    this.finiteStateMachine.update(timeElapsed);
  }
}

