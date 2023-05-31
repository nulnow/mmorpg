import { State } from '../StateMachine/State';
import { ResourceLoader } from '../ResourceLoader';
import { FiniteStateMachine } from '../StateMachine/FiniteStateMachine';
import { FireEntity } from './FireEntity';

export class FireBurningState extends State {
  protected sprites = ResourceLoader.getLoadedAssets().fireSprite;
  protected speed = 6;
  protected fsm: FireStateMachine;

  public constructor(fsm: FireStateMachine) {
    super(fsm)
    this.fsm = fsm;
    this.gameObject = this.fsm.getFire().getGameObject();
  }

  public onEnter() {
    this.speed += (3 * Math.random());
    super.onEnter();
  }

  public update(timeElapsed: number) {
    super.update(timeElapsed);
  }
}

export class FireStateMachine extends FiniteStateMachine {
  protected fire: FireEntity;

  public getFire(): FireEntity {
    return this.fire;
  }

  public constructor(fire: FireEntity) {
    super();

    this.fire = fire;
    this.addState(FireBurningState as any);

    this.setState(FireBurningState as any);
  }
}
