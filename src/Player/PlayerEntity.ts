import { InputController } from '../InputController';
import { UnsubscribeFn } from '../EventEmitter';
import { PlayerDieState, PlayerFiniteStateMachine, PlayerIdleState } from './PlayerStateMachine';
import { CharacterGameObject } from './CharacterGameObject';
import { FiniteStateMachine } from '../StateMachine/FiniteStateMachine';
import { Health, IEntityWithHealth } from '../IEntityWithHealth';
import { IEntityAbleToAttack } from '../IEntityAbleToAttack';
import { DrawableEntity } from '../Rendering/DrawableEntity';
import { uiEntity } from '../UI/UIEntity';
import { FireAttackEntity } from '../Buildings/FireAttackEntity';
import { Position } from '../Rendering/Position';
import { fireGreenFilter, firePurpleFilter, FireShieldEntity } from '../Buildings/FireShieldEntity';
import { EntityManager } from '../EntityManager';
import { MiniMap } from './MiniMap';

export class PlayerEntity extends DrawableEntity implements IEntityWithHealth, IEntityAbleToAttack {

  public static detachFronEntityManager(player: PlayerEntity): void {
    const entityManager = player.getEntityManager();
    entityManager.removeEntity(player, false);

    for (const healBall of player.healBalls) {
      entityManager.removeEntity(healBall, false);
    }

    for (const fireShieldBall of player.fireShieldBalls) {
      entityManager.removeEntity(fireShieldBall, false);
    }
  }

  public static attachToEntityManager(player: PlayerEntity, entityManager: EntityManager): void {
    entityManager.addEntity(player);

    for (const healBall of player.healBalls) {
      entityManager.addEntity(healBall);
      entityManager.addToScene(healBall);
    }

    for (const fireShieldBall of player.fireShieldBalls) {
      entityManager.addEntity(fireShieldBall);
      entityManager.addToScene(fireShieldBall);
    }
  }

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
    // const minimap = new MiniMap(this);
    // this.gameObject.addChild(minimap);
  }

  private health: Health = new Health(10000, 10000);

  public getHealth(): Health {
    return this.health;
  }
  public setHealth(value: number): void {
    this.health.setValue(value);
  }

  public respawn(): void {
    this.finiteStateMachine.setIdleState();
    this.setHealth(this.getHealth().getMaxValue());
    this.gameObject.getBox().setTopLeft(new Position(40, 40, 0));
    this.getEntityManager().emitter.emit('player_move', this);
  }

  public damage(value: number): void {
    let newHealth = this.getHealth().getValue() - value;
    if (newHealth <= 0) {
      newHealth = 0;
      this.finiteStateMachine.setState(PlayerDieState as any);
      this.onDeath();
      uiEntity.showModal({
        title: 'ПОРАЖЕНИЕ',
        body: 'О НЕТ! ПОСЛЕДНЯЯ НАДЕЖДА ИМПЕРИИ ПАЛА. ВЕСЬ МИР ВЗОРВАЛСЯ И ВСЕ УМЕРЛИ',
        onClose: () => {
          this.emitter.emit('dead_and_modal_closed', null);
        }
      })
    }
    this.setHealth(newHealth)
  }
  // private FIRE_ATTACK_DELAY_MS = 1200;
  private FIRE_ATTACK_DELAY_MS = 400;
  private timeFromLastFireAttack = this.FIRE_ATTACK_DELAY_MS;
  public fireAttack(): void {
    if (this.timeFromLastFireAttack < this.FIRE_ATTACK_DELAY_MS) {
      return;
    }

    this.timeFromLastFireAttack = 0;
    const center = this.getGameObject().getBox().getCenter();

    // for (let i = 0.1; i < Math.PI * 2; i += 0.05) {
    //   const fireBall = new FireAttackEntity(center.x - 30, center.y - 30, i + (0.5 - Math.random()) / 2);
    //   this.getEntityManager().addToScene(fireBall);
    //   this.getEntityManager().addEntity(fireBall);
    // }

    for (const shieldFireBall of this.fireShieldBalls) {
      const fireBall = new FireAttackEntity(
        center.x - 30, center.y - 30,
        shieldFireBall.getRotation().get(),
        FireAttackEntity.DEFAULT_SPEED,
        FireAttackEntity.DEFAULT_WIDTH,
        FireAttackEntity.DEFAULT_HEIGHT,
        firePurpleFilter,
      );
      this.getEntityManager().addToScene(fireBall);
      this.getEntityManager().addEntity(fireBall);
    }

    this.clearShield();
  }

  private FIRE_SHIELD_DELAY_MS = 100;
  private FIRE_SHIELD_MAX_COUNT = 25;
  private addShieldBallsCount = 1
  // private FIRE_SHIELD_DELAY_MS = 100;
  // private FIRE_SHIELD_MAX_COUNT = 60;

  public getFIRE_SHIELD_DELAY_MS(): number { return this.FIRE_SHIELD_DELAY_MS; }

  private timeFromLastFireShieldActivation = this.FIRE_SHIELD_DELAY_MS;
  public getTimeFromLastFireShieldActivation(): number { return this.timeFromLastFireShieldActivation; }

  private fireShieldBalls: FireShieldEntity[] = [];
  public activateFireShield(): void {
    if (this.timeFromLastFireShieldActivation < this.FIRE_SHIELD_DELAY_MS) {
      return;
    }
    if (this.fireShieldBalls.length >= this.FIRE_SHIELD_MAX_COUNT) {
      return;
    }
    this.timeFromLastFireShieldActivation = 0;
    const center = this.getGameObject().getBox().getCenter();

    for (let i = 0; i < this.addShieldBallsCount; i++) {
      const fireBall = new FireShieldEntity(this, center.x, center.y, 0.004, 30,30, firePurpleFilter);
      fireBall.getRotation().add(0);
      this.getEntityManager().addToScene(fireBall);
      this.getEntityManager().addEntity(fireBall);
      this.fireShieldBalls.push(fireBall);
    }

    // REDISTRIBUTE SHIELD ANGLES
    const angleStep = Math.PI * 2 / this.fireShieldBalls.length;
    let angle = 0;
    for (const fireBall of this.fireShieldBalls) {
      fireBall.getRotation().set(angle);
      angle += angleStep;
    }
  }
  private clearShield(): void {
    for (const fireBall of this.fireShieldBalls) {
      this.getEntityManager().removeEntity(fireBall);
    }
    this.fireShieldBalls.length = 0;
  }

  private clearHealBalls(): void {
    for (const fireBall of this.healBalls) {
      this.getEntityManager().removeEntity(fireBall);
    }
    this.healBalls.length = 0;
  }

  private HEAL_BALL_DELAY_MS = 100;
  private HEAL_BALL_MAX_COUNT = 25;
  private timeFromLastHealBallActivation = this.HEAL_BALL_DELAY_MS;
  private addhealBallCount = 1
  private healBalls: FireShieldEntity[] = [];

  public addHealBall(): void {
    if (this.timeFromLastHealBallActivation < this.HEAL_BALL_DELAY_MS) {
      return;
    }
    if (this.healBalls.length >= this.HEAL_BALL_MAX_COUNT) {
      return;
    }
    this.timeFromLastHealBallActivation = 0;
    const center = this.getGameObject().getBox().getCenter();

    for (let i = 0; i < this.addhealBallCount; i++) {
      const healBall = new FireShieldEntity(this, center.x, center.y, 0.002, 30,30, fireGreenFilter);
      healBall.getRotation().add(0);
      this.getEntityManager().addToScene(healBall);
      this.getEntityManager().addEntity(healBall);
      this.healBalls.push(healBall);
    }
  }

  public handleClear(): void {
    this.clearShield();
    this.clearHealBalls();
  }

  private onDeath(): void {
    this.handleClear();
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

  private speed = 150;
  public getSpeed(): number {
    return this.speed;
  }

  private unsubscribeFromSpeedChange!: UnsubscribeFn;

  public initEntity(): void {
    this.inputController = this.getComponentByName('InputController') as any as InputController;

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
    if (this.healBalls.length) {
      const count = this.healBalls.length;
      if (this.health.getValue() < this.health.getMaxValue()) {
        let newHeathValue = this.health.getValue() + count * timeElapsed * 0.01;
        if (newHeathValue > this.health.getMaxValue()) {
          newHeathValue = this.health.getMaxValue();
        }
        this.health.setValue(newHeathValue)
      }
    }
    this.timeFromLastFireAttack += timeElapsed;
    this.timeFromLastFireShieldActivation += timeElapsed;
    this.timeFromLastHealBallActivation += timeElapsed;
    this.finiteStateMachine.update(timeElapsed);
  }
}
