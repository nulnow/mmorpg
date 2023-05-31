import { GameObject } from '../Rendering/GameObject';
import { PlayerFiniteStateMachine } from './PlayerStateMachine';
import { PlayerEntity } from './PlayerEntity';
import { Box } from '../Rendering/Box';
import { Position } from '../Rendering/Position';
import { Rotation } from '../Rendering/Rotation';
import { AttackCircle } from './AttackCircle';
import { HealthBar } from './HealthBar';

export class CharacterGameObject extends GameObject {
  private player: PlayerEntity;
  private attackCircle: AttackCircle;
  private healthBar: HealthBar;

  public constructor(player: PlayerEntity, finiteStateMachine: PlayerFiniteStateMachine) {
    super(finiteStateMachine);
    this.player = player;
    this.box = new Box(
      new Position(40, 40, 0),
      100,
      100
    );
    this.rotation = new Rotation(0);

    this.attackCircle = new AttackCircle(this, this.finiteStateMachine, this.player.getAttackRange());
    this.addChild(this.attackCircle);

    this.healthBar = new HealthBar(this.player);
    this.addChild(this.healthBar);
  }
}
