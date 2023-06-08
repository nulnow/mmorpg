import { InputController } from '../InputController';
import { UnsubscribeFn } from '../EventEmitter';
import { PlayerDieState, PlayerFiniteStateMachine } from './PlayerStateMachine';
import { CharacterGameObject } from './CharacterGameObject';
import { FiniteStateMachine } from '../StateMachine/FiniteStateMachine';
import { Health, IEntityWithHealth } from '../IEntityWithHealth';
import { IEntityAbleToAttack } from '../IEntityAbleToAttack';
import { DrawableEntity } from '../Rendering/DrawableEntity';
import { UIEntity } from '../UI/UIEntity';
import { FireAttackEntity } from '../Buildings/FireAttackEntity';

export class PlayerEntity extends DrawableEntity implements IEntityWithHealth, IEntityAbleToAttack {
  private readonly finiteStateMachine: PlayerFiniteStateMachine;
  private inputController!: InputController;

  public getFiniteStateMachine(): FiniteStateMachine {
    return this.finiteStateMachine;
  }

  public getInputController() {
    return this.inputController;
  }

  public constructor(x: number, y: number) {
    super();
    this.finiteStateMachine = new PlayerFiniteStateMachine(this);
    this.gameObject = new CharacterGameObject(x, y, this, this.finiteStateMachine);
  }

  private health: Health = new Health(100, 150);

  public getHealth(): Health {
    return this.health;
  }
  public setHealth(value: number): void {
    this.health.setValue(value);
  }
  public damage(value: number): void {
    let newHealth = this.getHealth().getValue() - value;
    if (newHealth <= 0) {
      newHealth = 0;
      this.finiteStateMachine.setState(PlayerDieState as any);
      (this.getEntityManager().getEntityByName('ui') as UIEntity).showModal({
        title: 'ПОРАЖЕНИЕ',
        body: 'О НЕТ! ПОСЛЕДНЯЯ НАДЕЖДА ИМПЕРИИ ПАЛА. ВЕСЬ МИР ВЗОРВАЛСЯ И ВСЕ УМЕРЛИ',
      })
    }
    this.setHealth(newHealth)
  }
  private FIRE_ATTACK_DELAY_MS = 500;
  private timeFromLastFireAttack = 0;

  public fireAttack(): void {
    if (this.timeFromLastFireAttack < this.FIRE_ATTACK_DELAY_MS) {
      return;
    }
    this.timeFromLastFireAttack = 0;
    for (let i = 0.1; i < Math.PI * 2; i += 0.05) {
      const center = this.getGameObject().getBox().getCenter();
      const fireBall = new FireAttackEntity(center.x, center.y, i);
      this.getEntityManager().addToScene(fireBall);
      this.getEntityManager().addEntity(fireBall);
    }
  }

  private attackSpeed = 15;
  public getAttackSpeed(): number {
    return this.attackSpeed;
  }
  public setAttackSpeed(value: number): void {
    this.attackSpeed = value;
  }

  private attackDamage = 20;
  public getAttackDamage(): number {
    return this.attackDamage;
  }
  public setAttackDamage(value: number): void {
    this.attackDamage = value;
  }

  private attackRange = 65;
  public getAttackRange(): number {
    return this.attackRange
  }
  public setAttackRange(value: number) {
    this.attackRange = value;
  }

  private speed = 350;
  public getSpeed(): number {
    return this.speed;
  }

  public COLOR = "rgba(255,0,98,0)";

  private unsubscribeFromSpeedChange!: UnsubscribeFn;

  public initEntity(): void {
    console.log('init player entity')
    this.inputController = this.getComponentByName('InputController') as any as InputController;
    console.log('input controller', this.inputController);

    this.unsubscribeFromSpeedChange = this.emitter.subscribe('speed_change', (value) => {
      this.speed = value;
    });
    this.emitter.subscribe('attack_speed_change', (value) => {
      this.attackSpeed = value;
    });

    this.finiteStateMachine.onEntityInit();
    super.initEntity();
  }

  public destroy() {
    super.destroy();
    this.unsubscribeFromSpeedChange();
  }

  public update(timeElapsed: number): void {
    super.update(timeElapsed);
    this.timeFromLastFireAttack += timeElapsed;
    this.finiteStateMachine.update(timeElapsed);
  }
}
