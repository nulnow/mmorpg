import { DrawableEntity } from '../Rendering/DrawableEntity';
import { FireStateMachine } from './FireStateMachine';
import { GameObject } from '../Rendering/GameObject';
import { Box } from '../Rendering/Box';
import { Position } from '../Rendering/Position';
import { DeathStateMachine } from './DeathStateMachine';

export class DeathEntity extends DrawableEntity {
  protected readonly gameObject: GameObject;
  protected readonly finiteStateMachine: FireStateMachine;

  public constructor(
    private x: number,
    private y: number,
  ) {
    super();
    this.finiteStateMachine = new DeathStateMachine(this);
    this.gameObject = new GameObject(this.finiteStateMachine);
    this.gameObject.setBox(new Box(
      new Position(x, y, 0),
      100,
      100,
    ));
  }

  public update(timeElapsed: number) {
    super.update(timeElapsed);
    this.finiteStateMachine.update(timeElapsed);
  }
}
