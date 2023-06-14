import { State } from './State';
import { EventEmitter } from '../EventEmitter';
import { DrawableEntity } from '../Rendering/DrawableEntity';

// TODO
export type FSMActionPayload = any;

export type FSMAction = {
  type: string;
  payload: FSMActionPayload;
}

// TODO
type FSMStateConstructor = any;

export class FiniteStateMachine {
  private emitter = new EventEmitter();
  private state!: State;
  protected states: Record<string, FSMStateConstructor> = {};
  private entity: DrawableEntity;

  public getEntity(): DrawableEntity {
    return this.entity;
  }

  public constructor(entity: DrawableEntity) {
    this.entity = entity;
  }
  public start(): void {}

  protected addState(name: string, state: State): this {
    this.states[name] = state;
    return this;
  }

  public setState(state: State): this {
    const prevState = this.state;

    if (prevState && prevState !== state) {
      this.state.onExit();
    }
    this.state = state;
    this.state.onEnter();

    return this;
  }

  public getCurrentState(): State {
    return this.state;
  }

  public send(action: { type: string, data?: any }): void {}

  public update(timeElapsed: number) {
    if (this.state) {
      this.state.update(timeElapsed);
    }
  }
}
