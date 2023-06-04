import { Health, IEntityWithHealth } from '../../IEntityWithHealth';
import { IEntityAbleToAttack } from '../../IEntityAbleToAttack';
import { BaseEnemyGameObject } from './BaseEnemyGameObject';
import { BaseEnemyStateMachine } from './BaseEnemyStateMachine';
import { GameObject } from '../../Rendering/GameObject';
import { DrawableEntity } from '../../Rendering/DrawableEntity';
import { Entity } from '../../Entity';
import { GAME_EVENTS } from '../../GAME_EVENTS';

export abstract class BaseEnemyEntity extends DrawableEntity implements IEntityWithHealth, IEntityAbleToAttack {
  protected gameObject: BaseEnemyGameObject;
  protected finiteStateMachine: BaseEnemyStateMachine;
  protected speed = 0.02;
  protected reactDistance = 300;

  // protected health: Health = new Health(250, 250);
  protected health: Health = new Health(10, 250);
  public getHealth(): Health {
    return this.health;
  }
  public setHealth(value: number): void {
    this.health.setValue(value);
  }

  public damage(value: number, from: Entity): void {
    let newHealth = this.getHealth().getValue() - value;
    if (newHealth <= 0) {
      newHealth = 0;
      this.emitter.emit(GAME_EVENTS.KILLED_EVENT, { who: this, killer: from });
      // TODO
      this.finiteStateMachine.setDieState();
    }
    this.setHealth(newHealth)
  }

  protected attackSpeed = 5;
  public getAttackSpeed(): number {
    return this.attackSpeed;
  }
  public setAttackSpeed(value: number): void {
    this.attackSpeed = value;
  }

  protected attackDamage = 10;
  public getAttackDamage(): number {
    return this.attackDamage;
  }
  public setAttackDamage(value: number): void {
    this.attackDamage = value;
  }

  protected attackRange = 50;
  public getAttackRange(): number {
    return this.attackRange
  }
  public setAttackRange(value: number) {
    this.attackRange = value;
  }

  public getReactDistance(): number {
    return this.reactDistance;
  }

  public getSpeed(): number {
    return this.speed;
  }

  public getGameObject(): GameObject {
    return this.gameObject;
  }

  public constructor(x: number, y: number) {
    super();
    this.finiteStateMachine = new BaseEnemyStateMachine(this);
    this.gameObject = new BaseEnemyGameObject(x, y, this, this.finiteStateMachine)
  }

  public initEntity() {
    super.initEntity();
    this.finiteStateMachine.start();
  }

  public update(timeElapsed: number) {
    super.update(timeElapsed);
    this.finiteStateMachine.update(timeElapsed);
  }
}
