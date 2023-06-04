import { GameObject } from '../Rendering/GameObject';
import { EnemyGameObject } from './EnemyGameObject';
import { EnemyDieState, EnemyStateMachine } from './EnemyStateMachine';
import { Health, IEntityWithHealth } from '../IEntityWithHealth';
import { IEntityAbleToAttack } from '../IEntityAbleToAttack';
import { DrawableEntity } from '../Rendering/DrawableEntity';
import { Entity } from '../Entity';
import { GAME_EVENTS } from '../GAME_EVENTS';

export class EnemyEntity extends DrawableEntity implements IEntityWithHealth, IEntityAbleToAttack {
  protected readonly gameObject: GameObject;
  private readonly finiteStateMachine: EnemyStateMachine;
  private speed = 0.02;
  private reactDistance = 300;

  private health: Health = new Health(250, 250);
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
      this.finiteStateMachine.setState(EnemyDieState as any);
    }
    this.setHealth(newHealth)
  }

  private attackSpeed = 5;
  public getAttackSpeed(): number {
    return this.attackSpeed;
  }
  public setAttackSpeed(value: number): void {
    this.attackSpeed = value;
  }

  private attackDamage = 10;
  public getAttackDamage(): number {
    return this.attackDamage;
  }
  public setAttackDamage(value: number): void {
    this.attackDamage = value;
  }

  private attackRange = 50;
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
    this.finiteStateMachine = new EnemyStateMachine(this);
    this.gameObject = new EnemyGameObject(x, y, this, this.finiteStateMachine)
  }

  public update(timeElapsed: number) {
    super.update(timeElapsed);
    this.finiteStateMachine.update(timeElapsed);
  }
}
