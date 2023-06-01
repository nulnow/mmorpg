import { Entity } from '../Entity';
import { InputController } from '../InputController';
import { GameMap } from '../GameMap';
import { Box } from '../Rendering/Box';
import { UnsubscribeFn } from '../EventEmitter';
import { PlayerDeadState, PlayerDieState, PlayerFiniteStateMachine } from './PlayerStateMachine';
import { GameObject } from '../Rendering/GameObject';
import { CharacterGameObject } from './CharacterGameObject';
import { FiniteStateMachine } from '../StateMachine/FiniteStateMachine';
import { IDrawableEntity } from '../Rendering/IDrawableEntity';
import { Health, IEntityWithHealth } from '../IEntityWithHealth';
import { IEntityAbleToAttack } from '../IEntityAbleToAttack';

export class PlayerEntity extends Entity implements IDrawableEntity, IEntityWithHealth, IEntityAbleToAttack {
  private readonly finiteStateMachine: PlayerFiniteStateMachine;
  private readonly gameObject: GameObject;

  public getFiniteStateMachine(): FiniteStateMachine {
    return this.finiteStateMachine;
  }

  public getGameObject(): GameObject {
    return this.gameObject;
  }

  public getInputController() {
    return this.inputController;
  }

  public constructor() {
    super();
    this.finiteStateMachine = new PlayerFiniteStateMachine(this);
    this.gameObject = new CharacterGameObject(this, this.finiteStateMachine);
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
      this.finiteStateMachine.setState(PlayerDieState as any)
    }
    this.setHealth(newHealth)
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


  private inputController!: InputController;
  private speed = 100;
  public getSpeed(): number {
    return this.speed;
  }

  public COLOR = "rgba(255,0,98,0)";

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
    this.finiteStateMachine.update(timeElapsed);
  }
}
