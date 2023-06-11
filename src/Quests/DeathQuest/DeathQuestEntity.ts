import { Entity } from '../../Entity';
import { PlayerEntity } from '../../Player/PlayerEntity';
import { DeathEntity } from '../../Buildings/DeathEntity';
import { DeathQuestStateMachine } from './DeathQuestStateMachine';
import { UIEntity } from '../../UI/UIEntity';

export class DeathQuestEntity extends Entity {
  private player!: PlayerEntity;
  private death!: DeathEntity;
  private fsm: DeathQuestStateMachine = new DeathQuestStateMachine(this);
  private uiEntity!: UIEntity;

  public constructor() {
    super();
  }

  public showQuestInfo() {
    this.uiEntity.showModal({
      title: 'Начало истории',
      body: `
        Путник. Нам предстоит путешествие на восток. Там мы отыщем древний артефакт зла. С его помощью добро победит.
      `,
    });
  }

  public initEntity() {
    super.initEntity();
    this.uiEntity = this.getEntityManager().getEntityByName('ui') as UIEntity;
    this.player = this.getEntityManager().getEntityByName('player') as PlayerEntity;
    this.death = this.getEntityManager().getEntityByName('death') as DeathEntity;
  }

  public update(timeElapsed: number) {
    super.update(timeElapsed);

    const distanceToPlayer = this.death.distanceTo(this.player);

    if (distanceToPlayer < 150) {
      this.fsm.send({ type: 'player_near_death' });
    }
  }
}
