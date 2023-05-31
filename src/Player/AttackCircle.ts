import { GameObject } from '../Rendering/GameObject';
import { FiniteStateMachine } from '../StateMachine/FiniteStateMachine';
import { Camera } from '../Camera/Camera';
import { PlayerAttackState } from './PlayerStateMachine';
import { EnemyAttackPlayerState } from '../Enemies/EnemyStateMachine';

export class AttackCircle extends GameObject {
  private parent: GameObject;

  public constructor(parent: GameObject, finiteStateMachine: FiniteStateMachine, private radius: number) {
    super(finiteStateMachine);
    this.parent = parent;
  }

  public draw(context: CanvasRenderingContext2D, camera: Camera) {
    if (
      this.finiteStateMachine.getCurrentState() instanceof PlayerAttackState
      ||
      this.finiteStateMachine.getCurrentState() instanceof EnemyAttackPlayerState
    ) {
      const parentCenter = this.parent.getBox().getCenter();
      const relativePosition = camera.getRelativePosition(parentCenter);

      context.save();
      context.beginPath();
      context.strokeStyle = '#ff0000';
      context.arc(relativePosition.x, relativePosition.y, this.radius, 0, 2 * Math.PI);
      context.stroke();
      context.restore();
    }
  }
}
