import { State } from './State';
import { EventEmitter } from '../EventEmitter';

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

  public constructor() {}
  public start(): void {}

  protected addState(name: string, fsmConstructor: FSMStateConstructor): this {
    this.states[name] = fsmConstructor;

    return this;
  }

  public setState(NewStateConstructor: FSMStateConstructor): this {
    const prevState = this.state;

    if (prevState && prevState.constructor.name !== NewStateConstructor.name) {
      this.state.onExit();
    }
    this.state = new NewStateConstructor(this);
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
