import { DeathEntity } from './DeathEntity';
import { ResourceLoader } from '../ResourceLoader';
import { State, StateWithAnimation } from '../StateMachine/State';
import { FiniteStateMachine } from '../StateMachine/FiniteStateMachine';

class DeathIdleState extends StateWithAnimation {
  protected sprites = ResourceLoader.getLoadedAssets().deathSprite;
  protected speed = 2;
  protected fsm: DeathStateMachine;

  public constructor(fsm: DeathStateMachine) {
    super(fsm);
    this.fsm = fsm;
  }

  public update(timeElapsed: number) {
    super.update(timeElapsed);
  }
}

export class DeathStateMachine extends FiniteStateMachine{
  protected death: DeathEntity;

  public getDeath(): DeathEntity {
    return this.death;
  }

  public constructor(death: DeathEntity) {
    super(death);

    this.death = death;
    this.addState('idle', new DeathIdleState(this));

    this.setState(this.states['idle']);
  }
}
