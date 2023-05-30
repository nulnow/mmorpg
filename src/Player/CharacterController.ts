import { Component } from '../Component';
import { PlayerFSM } from './PlayerStateMachine';
import { PlayerEntity } from './PlayerEntity';

export class CharacterController extends Component {
  private stateMachine: PlayerFSM;

  public constructor(player: PlayerEntity) {
    super();
    this.stateMachine = new PlayerFSM(player);
    this.setParent(player);
  }

  public initEntity(): void {

  }

  public update(timeElapsed: number) {

  }
}
