import { GameObject } from '../Rendering/GameObject';
import { PlayerFSM } from './PlayerStateMachine';
import { PlayerEntity } from './PlayerEntity';

export class CharacterGameObject extends GameObject {
  public constructor(playerEntity: PlayerEntity) {
    const fsm = new PlayerFSM(playerEntity);
    super(fsm);
  }
}
