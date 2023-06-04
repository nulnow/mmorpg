import { BaseEnemyEntity } from '../BaseEnemy/BaseEnemyEntity';
import { GuardStateMachine } from './GuardStateMachine';
import { GuardGameObject } from './GuardGameObject';
import { Health } from '../../IEntityWithHealth';

export class GuardEntity extends BaseEnemyEntity {
  public constructor(x: number, y: number) {
    super(x, y);
    this.finiteStateMachine = new GuardStateMachine(this);
    this.gameObject = new GuardGameObject(x, y, this, this.finiteStateMachine)
  }

  protected health: Health = new Health(100, 100);
  public getHealth(): Health {
    return this.health;
  }
  public setHealth(value: number): void {
    this.health.setValue(value);
  }
}
