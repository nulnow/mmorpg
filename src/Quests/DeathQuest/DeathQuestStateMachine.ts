import { FiniteStateMachine } from '../../StateMachine/FiniteStateMachine';
import { DeathQuestEntity } from './DeathQuestEntity';
import { State } from '../../StateMachine/State';
import { UIEntity } from '../../UI/UIEntity';

export class NotSetDeathQuestState extends State {
  public onEnter() {
    super.onEnter();
  }

  public onExit() {
    super.onExit();
  }

  public update(timeElapsed: number) {
    super.update(timeElapsed);
  }
}

export class JustTakenDeathQuestState extends State {
  protected fsm: DeathQuestStateMachine;

  public constructor(fsm: DeathQuestStateMachine) {
    super(fsm);
    this.fsm = fsm;
  }

  public onEnter() {
    super.onEnter();
    const uiEntity = this.fsm.getQuest().getEntityManager().getEntityByName('ui') as UIEntity;

    uiEntity.addQuest('death-quest', 'Начало истории', () => {
      this.fsm.getQuest().showQuestInfo();
    });

    const updater = (modal: HTMLElement) => {
      modal.style.right = '';
      modal.style.left = '100px';
    };

    uiEntity.showModal({
      title: 'Начало истории...',
      body: `Путник! Вот ты где. Поспешим, нам срочно надо восстановить империю!`,
      updater,
      onClose() {
        uiEntity.showModal({
          updater,
          title: 'Начало истории...',
          body: 'Погоди........ Тыже убийца БОГОВ!',
        });
      },
    });
  }

  public onExit() {
    super.onExit();
  }

  public update(timeElapsed: number) {
    super.update(timeElapsed);
  }
}

export class DeathQuestStateMachine extends FiniteStateMachine {
  public constructor(private quest: DeathQuestEntity) {
    super();
    this.addState('not-set', NotSetDeathQuestState);
    this.addState('just-taken', JustTakenDeathQuestState);

    this.setState(NotSetDeathQuestState);
  }

  public getQuest(): DeathQuestEntity {
    return this.quest;
  }

  public send(action): void {
    if (action.type === 'player_near_death') {
      if (this.getCurrentState() instanceof NotSetDeathQuestState) {
        this.setState(JustTakenDeathQuestState);
      }
    }
  }
}
