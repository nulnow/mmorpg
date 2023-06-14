import { FiniteStateMachine } from './FiniteStateMachine';
import { Animator } from '../Rendering/Animator';
import { Sprite } from '../Rendering/Sprite';

export type StateSprites = HTMLImageElement[] | Sprite;

export abstract class State {
  protected fsm: FiniteStateMachine;

  protected constructor(fsm: FiniteStateMachine) {
    this.fsm = fsm;
  }

  public onEnter(): void {}

  public onExit(): void {}

  public update(timeElapsed: number): void {}
}

export class StateWithAnimation extends State {
  protected fsm: FiniteStateMachine;
  protected animator: Animator = new Animator();
  protected sprites: StateSprites = [];
  protected speed: number = 0;

  protected constructor(fsm: FiniteStateMachine) {
    super(fsm);
    this.fsm = fsm;
  }

  public onEnter(): void {
    this.animator.setGameObject(this.fsm.getEntity().getGameObject());
    this.animator.setSprites(this.sprites);
    this.animator.setSpeed(this.speed);
  }

  public onExit(): void {}

  public getCurrentSprite(): HTMLImageElement {
    return this.animator.getCurrentSprite();
  }

  public update(timeElapsed: number): void {
    this.animator.update(timeElapsed);
  }
}
