import { BaseEnemyEntity } from '../BaseEnemy/BaseEnemyEntity';
import { SlimeStateMachine } from './SlimeStateMachine';
import { SlimeGameObject } from './SlimeGameObject';
import { Health } from '../../IEntityWithHealth';

export class SlimeEntity extends BaseEnemyEntity {
  public constructor(x: number, y: number) {
    super(x, y);
    this.finiteStateMachine = new SlimeStateMachine(this);
    this.gameObject = new SlimeGameObject(x, y, this, this.finiteStateMachine)
  }

  protected health: Health = new Health(250, 250);
  public getHealth(): Health {
    return this.health;
  }
  public setHealth(value: number): void {
    this.health.setValue(value);
  }
}
