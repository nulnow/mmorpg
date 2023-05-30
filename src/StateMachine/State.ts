import { FiniteStateMachine } from './FiniteStateMachine';
import { Animator } from '../Rendering/Animator';

export abstract class State {
  protected fsm: FiniteStateMachine;
  protected animator: Animator = new Animator();
  protected sprites: HTMLImageElement[] = [];
  protected speed: number = 0;

  protected constructor(fsm: FiniteStateMachine) {
    this.fsm = fsm;
  }

  public onEnter(): void {
    this.animator.setSprites(this.sprites);
    this.animator.setSpeed(this.speed);
  }

  public onExit(): void {

  }

  public getCurrentSprite(): HTMLImageElement {
    return this.animator.getCurrentSprite();
  }

  public update(timeElapsed: number): void {
    this.animator.update(timeElapsed);
  }
}
