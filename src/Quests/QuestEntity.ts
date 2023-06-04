import { Entity } from '../Entity';
import { PlayerEntity } from '../Player/PlayerEntity';
import { GAME_EVENTS } from '../GAME_EVENTS';
import { UnsubscribeFn } from '../EventEmitter';
import { SlimeEntity } from '../Enemies/slime/SlimeEntity';
import { UIEntity } from '../UI/UIEntity';
import { FireEntity } from '../Buildings/FireEntity';

export class QuestEntity extends Entity {
  public constructor() {
    super();
  }

  private unsubscribeFromKilledEvent: UnsubscribeFn | null = null;
  private closeStartModalFn: UnsubscribeFn | null = null;
  private killCount = 0;
  private done = false;
  private fires: Entity[] = [];

  public initEntity() {
    super.initEntity();
    const uiEntity = (this.getEntityManager().getEntityByName('ui') as UIEntity);
    this.closeStartModalFn = uiEntity.showModal({
      title: 'Current Quest:',
      body: 'О нет! Наша великая империя находится в упадке! Демоны нападают со всех сторон, культы предателей возникают то тут, то там'
        + 'Нам предстоит сделать выбор - мы герой или революционер. От нас зависит судьба империи - выберем ли мы разрушить её, либо отстроить из пепла и руин.'
       + 'Вы - независимый герой, способный на многое! Перед вами открывается путь приключений доселе не слыханной широты! Доколе мы - простые люди империи'
      +  'должны страдать от гнёта короля-тирана. Пора навести порядок и восстановить справедливость! <br />  <br />' +
      ` убейте 3х водных сламов и потушите ваш дом. Тогда империя восстановится.`,
    });

    this.unsubscribeFromKilledEvent = this.getEntityManager().emitter.subscribe(GAME_EVENTS.KILLED_EVENT, ({ who, killer }) => {
      if (!this.done && who instanceof SlimeEntity && killer instanceof PlayerEntity) {
        this.killCount++;

        if (this.killCount === 3) {
          this.done = false;
          this.onSuccess();
        }
      }
    });

    for (let j = 0; j < 5; j++) {
      const fire = new FireEntity(-70, 50 * (j + 1), 150, 150);
      this.getEntityManager().addToScene(fire);
      this.getEntityManager().addEntity(fire);
      this.fires.push(fire);
    }

    for (let j = 0; j < 10; j++) {
      const fire = new FireEntity(j * 50, -70, 150, 150);
      this.getEntityManager().addToScene(fire);
      this.getEntityManager().addEntity(fire);
      this.fires.push(fire);
    }
  }

  private onSuccess(): void {
    if (this.closeStartModalFn) {
      this.closeStartModalFn();
    }

    const uiEntity = (this.getEntityManager().getEntityByName('ui') as UIEntity);

    uiEntity.showModal({
      title: 'Congrats!',
      body: 'You have done the quests! Fire is down. Империя спасена! Good shape хороший Color и fabric',
    });

    this.fires.forEach(fire => {
      this.getEntityManager().removeEntity(fire);
    });

    // this.getEntityManager().getEntityByName('fire')
  }

  public destroy() {
    super.destroy();
    if (this.unsubscribeFromKilledEvent) {
      this.unsubscribeFromKilledEvent();
    }
  }
}
