import { State } from './State';
import { EventEmitter } from '../EventEmitter';

// TODO
export type FSMActionPayload = any;

export type FSMAction= {
  type: string;
  payload: FSMActionPayload;
}

type FSMStateConstructor = { new (fsm: FiniteStateMachine): State };

export class FiniteStateMachine {
  private emitter = new EventEmitter();
  private state!: State;
  private states: Record<string, FSMStateConstructor> = {};

  public constructor() {
  }

  protected addState(fsmConstructor: FSMStateConstructor): void {
    this.states[fsmConstructor.name] = fsmConstructor;
  }

  public setState(NewStateConstructor: FSMStateConstructor): void {
    const prevState = this.state;

    if (prevState && prevState.constructor.name !== NewStateConstructor.name) {
      this.state.onExit();
    }
    this.state = new NewStateConstructor(this);
    this.state.onEnter();
  }

  public getCurrentState(): State {
    return this.state;
  }

  public update(timeElapsed: number) {
    if (this.state) {
      this.state.update(timeElapsed);
    }
  }
}
