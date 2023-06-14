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
  protected speed = 12;
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().guard.run;
}

class GuardEnemyDieState extends BaseEnemyDieState {
  protected speed = 12;
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().guard.death;
}

class GuardEnemyDeadState extends BaseEnemyDeadState {
  protected speed = 0;
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().guard.death;
}

class GuardEnemyChasingPlayerState extends BaseEnemyChasingPlayerState {
  protected speed = 12;
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().guard.run;
}

class GuardEnemyAttackPlayerState extends BaseEnemyAttackPlayerState {
  protected speed = 12;
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().guard.attack;
}

export class GuardStateMachine extends BaseEnemyStateMachine {
  public constructor(enemy: BaseEnemyEntity) {
    super(enemy);

    this.addState('idle', new GuardEnemyIdleState(this));
    this.addState('attack', new GuardEnemyAttackPlayerState(this));
    this.addState('die', new GuardEnemyDieState(this));
    this.addState('dead', new GuardEnemyDeadState(this));
    this.addState('hangingAround', new GuardEnemyHangingAroundState(this));
    this.addState('chasingPlayer', new GuardEnemyChasingPlayerState(this));
  }
}
