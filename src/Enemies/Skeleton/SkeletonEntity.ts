import { BaseEnemyEntity } from '../BaseEnemy/BaseEnemyEntity';
import {
  BaseEnemyAttackPlayerState,
  BaseEnemyChasingPlayerState,
  BaseEnemyDeadState,
  BaseEnemyDieState,
  BaseEnemyHangingAroundState,
  BaseEnemyIdleState, BaseEnemyStateMachine
} from '../BaseEnemy/BaseEnemyStateMachine';
import { StateSprites } from '../../StateMachine/State';
import { ResourceLoader } from '../../ResourceLoader';
import { Health } from '../../IEntityWithHealth';
import { BaseEnemyGameObject } from '../BaseEnemy/BaseEnemyGameObject';

export class SkeletonEntity extends BaseEnemyEntity {
  public constructor(x: number, y: number) {
    super(x, y);
    this.finiteStateMachine = new SkeletonStateMachine(this);
    this.gameObject = new BaseEnemyGameObject(x, y, this, this.finiteStateMachine, 150, 150)
  }

  protected health: Health = new Health(250, 250);
  public getHealth(): Health {
    return this.health;
  }
  public setHealth(value: number): void {
    this.health.setValue(value);
  }

  public initEntity() {
    super.initEntity();
    // this.finiteStateMachine.send({ type: 'attack' });
  }
}

class SkeletonEnemyIdleState extends BaseEnemyIdleState {
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().skeleton.idle;
}

class SkeletonEnemyHangingAroundState extends BaseEnemyHangingAroundState {
  protected speed = 26;
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().skeleton.run;
}

class SkeletonEnemyDieState extends BaseEnemyDieState {
  protected speed = 0;
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().skeleton.die;
}

class SkeletonEnemyDeadState extends BaseEnemyDeadState {
  protected speed = 26;
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().skeleton.death;
}

class SkeletonEnemyChasingPlayerState extends BaseEnemyChasingPlayerState {
  protected speed = 26;
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().skeleton.run;

  public update(timeElapsed: number) {
    super.update(timeElapsed);
  }
}

class SkeletonEnemyAttackPlayerState extends BaseEnemyAttackPlayerState {
  protected speed = 26;
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().skeleton.attack;

  public constructor(props) {
    super(props);
  }

  public onEnter() {
    super.onEnter();
  }

  public onExit() {
    super.onExit();
  }

  public update(timeElapsed: number) {
    super.update(timeElapsed);
    // console.log('here 123');
  }
}

export class SkeletonStateMachine extends BaseEnemyStateMachine {
  public constructor(enemy: BaseEnemyEntity) {
    super(enemy);

    this.addState('idle', SkeletonEnemyIdleState);
    this.addState('attack', SkeletonEnemyAttackPlayerState);
    this.addState('die', SkeletonEnemyDieState);
    this.addState('dead', SkeletonEnemyDeadState);
    this.addState('hangingAround', SkeletonEnemyHangingAroundState);
    this.addState('chasingPlayer', SkeletonEnemyChasingPlayerState);
  }
}
