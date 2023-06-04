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
import { StateSprites } from '../../StateMachine/State';
import { BaseEnemyEntity } from '../BaseEnemy/BaseEnemyEntity';

class GuardEnemyIdleState extends BaseEnemyIdleState {
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().guard.idle;
}

class GuardEnemyHangingAroundState extends BaseEnemyHangingAroundState {
  protected speed = 2;
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().guard.run;
}

class GuardEnemyDieState extends BaseEnemyDieState {
  protected speed = 2;
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().guard.death;
}

class GuardEnemyDeadState extends BaseEnemyDeadState {
  protected speed = 0;
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().guard.death;
}

class GuardEnemyChasingPlayerState extends BaseEnemyChasingPlayerState {
  protected speed = 2;
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().guard.run;
}

class GuardEnemyAttackPlayerState extends BaseEnemyAttackPlayerState {
  protected speed = 2;
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().guard.attack;
}

export class GuardStateMachine extends BaseEnemyStateMachine {
  public constructor(enemy: BaseEnemyEntity) {
    super(enemy);

    this.addState('idle', GuardEnemyIdleState);
    this.addState('attack', GuardEnemyAttackPlayerState);
    this.addState('die', GuardEnemyDieState);
    this.addState('dead', GuardEnemyDeadState);
    this.addState('hangingAround', GuardEnemyHangingAroundState);
    this.addState('chasingPlayer', GuardEnemyChasingPlayerState);
  }
}
