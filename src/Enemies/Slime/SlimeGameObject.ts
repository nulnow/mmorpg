import { BaseEnemyGameObject } from '../BaseEnemy/BaseEnemyGameObject';

export class SlimeGameObject extends BaseEnemyGameObject {
  public getIsRightToLeft(): boolean {
    return false;
  }
}
