import { FiniteStateMachine } from './FiniteStateMachine';
import { Animator } from '../Rendering/Animator';
import { GameObject } from '../Rendering/GameObject';
import { Sprite } from '../Rendering/Sprite';

export type StateSprites = HTMLImageElement[] | Sprite;

export abstract class State {
  protected fsm: FiniteStateMachine;
  protected animator: Animator = new Animator();
  protected sprites: StateSprites = [];
  protected speed: number = 0;
  protected gameObject: GameObject;

  protected constructor(fsm: FiniteStateMachine) {
    this.fsm = fsm;
    this.gameObject = new GameObject(fsm);
  }

  private animatorCacheFilled = false;
  public onEnter(): void {
    this.animator.setGameObject(this.gameObject);
    this.animator.setSprites(this.sprites);
    this.animator.setSpeed(this.speed);

    if (!this.animatorCacheFilled) {
      this.animator.warmCache();
      this.animatorCacheFilled = true;
    }
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
