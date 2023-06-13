import { Entity } from './Entity';
import { SlimeEntity } from './Enemies/Slime/SlimeEntity';
import { BaseEnemyEntity } from './Enemies/BaseEnemy/BaseEnemyEntity';

export abstract class Spawner extends Entity {
  public abstract spawn(): BaseEnemyEntity;
}

export class SlimeSpawner extends Spawner {
  public spawn(): BaseEnemyEntity {
    return new SlimeEntity(0, 0);
  }
}
