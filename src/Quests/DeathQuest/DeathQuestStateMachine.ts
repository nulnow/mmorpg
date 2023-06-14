import { FiniteStateMachine } from '../../StateMachine/FiniteStateMachine';
import { DeathQuestEntity } from './DeathQuestEntity';
import { State } from '../../StateMachine/State';
import { uiEntity } from '../../UI/UIEntity';

export class NotSetDeathQuestState extends State {
  public constructor(fsm: FiniteStateMachine) {
    super(fsm);
  }

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
    super(quest);
    this.addState('not-set', new NotSetDeathQuestState(this));
    this.addState('just-taken', new JustTakenDeathQuestState(this));

    this.setState(this.states['not-set']);
  }

  public getQuest(): DeathQuestEntity {
    return this.quest;
  }

  public send(action): void {
    if (action.type === 'player_near_death') {
      if (this.getCurrentState() instanceof NotSetDeathQuestState) {
        this.setState(this.states['just-taken']);
      }
    }
  }
}
