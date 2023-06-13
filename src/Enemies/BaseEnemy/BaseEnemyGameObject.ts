import { BaseEnemyStateMachine } from './BaseEnemyStateMachine';
import { Box } from '../../Rendering/Box';
import { HealthBar } from '../../Player/HealthBar';
import { AttackCircle } from '../../Player/AttackCircle';
import { BaseEnemyEntity } from './BaseEnemyEntity';
import { GameObject } from '../../Rendering/GameObject';
import { Rotation } from '../../Rendering/Rotation';
import { Position } from '../../Rendering/Position';

export class BaseEnemyGameObject extends GameObject {
  private enemy: BaseEnemyEntity;
  private attackCircle: AttackCircle;
  private healthBar: HealthBar;

  public constructor(
    x: number, y: number,
    enemy: BaseEnemyEntity,
    finiteStateMachine: BaseEnemyStateMachine,
    width: number = 100,
    height: number = 100,
    ) {
    super(finiteStateMachine);
    this.enemy = enemy;
    this.box = new Box(
      new Position(x, y, 0),
      width, height
    );

    this.rotation = new Rotation(123);
    this.attackCircle = new AttackCircle(this, this.finiteStateMachine, this.enemy.getAttackRange());
    this.addChild(this.attackCircle);

    this.healthBar = new HealthBar(this.enemy);
    this.addChild(this.healthBar);
  }

  public getIsRightToLeft(): boolean {
    return false;
  }
}
