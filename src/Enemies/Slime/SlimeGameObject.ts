import { BaseEnemyGameObject } from '../BaseEnemy/BaseEnemyGameObject';

export class SlimeGameObject extends BaseEnemyGameObject {
  public isRightToLeft(): boolean {
    return false;
  }
}
