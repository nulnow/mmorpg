import { DeathEntity } from './DeathEntity';
import { ResourceLoader } from '../ResourceLoader';
import { State } from '../StateMachine/State';
import { FiniteStateMachine } from '../StateMachine/FiniteStateMachine';

class DeathIdleState extends State {
  protected sprites = ResourceLoader.getLoadedAssets().deathSprite;
  protected speed = 2;
  protected fsm: DeathStateMachine;

  public constructor(fsm: DeathStateMachine) {
    super(fsm)
    this.fsm = fsm;
    this.gameObject = this.fsm.getDeath().getGameObject();
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
    super();

    this.death = death;
    this.addState('idle', DeathIdleState as any);

    this.setState(DeathIdleState as any);
  }
}
