import { GameObject } from '../Rendering/GameObject';
import { EnemyEntity } from './EnemyEntity';
import { EnemyStateMachine } from './EnemyStateMachine';
import { Box } from '../Rendering/Box';
import { Position } from '../Rendering/Position';
import { Rotation } from '../Rendering/Rotation';
import { AttackCircle } from '../Player/AttackCircle';
import { HealthBar } from '../Player/HealthBar';

export class EnemyGameObject extends GameObject {
  private enemy: EnemyEntity;
  private attackCircle: AttackCircle;
  private healthBar: HealthBar;

  public constructor(enemy: EnemyEntity, finiteStateMachine: EnemyStateMachine) {
    super(finiteStateMachine);
    this.enemy = enemy;
    this.box = new Box(
      new Position(200, 200, 0),
      100, 100
    );

    this.rotation = new Rotation(123);
    this.attackCircle = new AttackCircle(this, this.finiteStateMachine, this.enemy.getAttackRange());
    this.addChild(this.attackCircle);

    this.healthBar = new HealthBar(this.enemy);
    this.addChild(this.healthBar);
  }

  public isRightToLeft(): boolean {
    return false;
  }
}
