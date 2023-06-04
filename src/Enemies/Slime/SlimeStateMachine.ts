import {
  BaseEnemyAttackPlayerState,
  BaseEnemyChasingPlayerState,
  BaseEnemyDeadState,
  BaseEnemyDieState,
  BaseEnemyHangingAroundState,
  BaseEnemyIdleState,
  BaseEnemyStateMachine
} from '../BaseEnemy/BaseEnemyStateMachine';
import { ResourceLoader } from '../../ResourceLoader';
import { SlimeEntity } from './SlimeEntity';

class SlimeEnemyIdleState extends BaseEnemyIdleState {
  protected sprites = ResourceLoader.getLoadedAssets().slime.idle;
}

class SlimeEnemyHangingAroundState extends BaseEnemyHangingAroundState {
  protected sprites = ResourceLoader.getLoadedAssets().slime.move;
}

class SlimeEnemyDieState extends BaseEnemyDieState {
  protected sprites = ResourceLoader.getLoadedAssets().slime.die;
}

class SlimeEnemyDeadState extends BaseEnemyDeadState {
  protected speed = 1;
  protected sprites = ResourceLoader.getLoadedAssets().slime.die;
}

class SlimeEnemyChasingPlayerState extends BaseEnemyChasingPlayerState {
  protected sprites = ResourceLoader.getLoadedAssets().slime.move;
}

class SlimeEnemyAttackPlayerState extends BaseEnemyAttackPlayerState {
  protected sprites = ResourceLoader.getLoadedAssets().slime.attack;
}

export class SlimeStateMachine extends BaseEnemyStateMachine {
  public constructor(slimeEnemyEntity: SlimeEntity) {
    super(slimeEnemyEntity);

    this.addState('idle', SlimeEnemyIdleState);
    this.addState('attack', SlimeEnemyAttackPlayerState);
    this.addState('die', SlimeEnemyDieState);
    this.addState('dead', SlimeEnemyDeadState);
    this.addState('hangingAround', SlimeEnemyHangingAroundState);
    this.addState('chasingPlayer', SlimeEnemyChasingPlayerState);
  }
}
