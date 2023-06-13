import { BaseEnemyEntity } from './BaseEnemyEntity';
import { FiniteStateMachine } from '../../StateMachine/FiniteStateMachine';
import { State, StateSprites } from '../../StateMachine/State';
import { MusicPlayer } from '../../MusicPlayer';
import { ResourceLoader } from '../../ResourceLoader';
import { PlayerEntity } from '../../Player/PlayerEntity';
import { GameMap } from '../../GameMap';
import { IEntityWithHealth } from '../../IEntityWithHealth';
import { Random } from '../../Random';
import { Rotation } from '../../Rendering/Rotation';
import { UnsubscribeFn } from '../../EventEmitter';
import { Position } from '../../Rendering/Position';

export class BaseEnemyIdleState extends State {
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().guard.idle;
  protected speed = 7;
  protected fsm: BaseEnemyStateMachine;
  protected player = MusicPlayer.createNeutralSlimePlayer();
  protected chanceToHangAround = 0.1;

  public constructor(fsm: BaseEnemyStateMachine) {
    super(fsm)
    this.fsm = fsm;
    this.gameObject = this.fsm.getEnemy().getGameObject();
  }

  public onEnter() {
    super.onEnter();
    this.player.play();
  }

  public onExit() {
    super.onExit();
    this.player.pause();
  }

  public update(timeElapsed: number) {
    super.update(timeElapsed);

    // this.fsm.setAttackState();
    // return;
    const currentPlayer = this.fsm.getEnemy().getEntityManager().getEntityByName('player') as PlayerEntity;

    if (currentPlayer) {
      const distance = this.fsm.getEnemy().getGameObject().getBox().getCenter().distance(currentPlayer.getGameObject().getBox().getCenter());
      this.player.tuneSoundByDistance(distance);
    }

    // TODO
    const players = this.fsm.getEnemy().getEntityManager().findEntities(this.fsm.getEnemy().getGameObject().getBox().getCenter(), 200, (entity) => (
      entity instanceof PlayerEntity && ((entity as any as IEntityWithHealth).getHealth().getValue() > 0)
    ));

    if (players.length > 0) {
      this.fsm.setChasingPlayerState();
    } else {
      if (Random.runChance(timeElapsed / 1000, this.chanceToHangAround)) {
        this.fsm.setHangingAroundState();
      }
    }
  }
}

export class BaseEnemyHangingAroundState extends State {
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().guard.run;
  protected speed = 7;
  protected fsm: BaseEnemyStateMachine;
  protected player = MusicPlayer.createNeutralSlimePlayer();
  protected chanceToStay = 0.1;
  protected rotation: Rotation = new Rotation(0);

  public constructor(fsm: BaseEnemyStateMachine) {
    super(fsm)
    this.fsm = fsm;
    this.gameObject = this.fsm.getEnemy().getGameObject();
  }

  public onEnter() {
    super.onEnter();
    this.rotation = new Rotation(Math.random() * 2 * Math.PI);
  }

  public onExit() {
    super.onExit();
  }

  public update(timeElapsed: number) {
    super.update(timeElapsed);
    // const angle = Math.PI;
    //
    // this.fsm.getEnemy().getGameObject().setRotation(angle);

    this.fsm.getEnemy().getGameObject().setRotation(this.rotation.get());
    const speed = this.fsm.getEnemy().getSpeed();

    const dy = timeElapsed * (Math.sin(this.rotation.get()) * speed);
    const dx = timeElapsed * (Math.cos(this.rotation.get()) * speed);

    const nextBox = this.fsm.getEnemy().getGameObject().getBox().copy();
    nextBox.move(dx, dy);

    const collisions = this.fsm.getEnemy().findCollisions(nextBox);
    if (!collisions.length) {
      this.fsm.getEnemy().getGameObject().getBox().move(dx, dy);
    } else {
      this.fsm.setIdleState();
    }

    if (Random.runChance(timeElapsed / 1000, this.chanceToStay)) {
      this.fsm.setIdleState();
    }
  }
}

export class BaseEnemyDieState extends State {
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().guard.death;
  protected speed = 7;
  protected fsm: BaseEnemyStateMachine;

  private unsubscribeFromAnimationEnd: UnsubscribeFn | null = null;

  public constructor(fsm: BaseEnemyStateMachine) {
    super(fsm)
    this.fsm = fsm;
    this.gameObject = this.fsm.getEnemy().getGameObject();
  }

  public onEnter(): void {
    super.onEnter();
    this.unsubscribeFromAnimationEnd = this.animator.onAnimationEndOnce(() => {
      this.fsm.setDeadState();
    });
  }

  public onExit(): void {
    super.onExit();
    if (this.unsubscribeFromAnimationEnd) {
      this.unsubscribeFromAnimationEnd();
    }
  }

  public update(timeElapsed: number) {
    super.update(timeElapsed);
  }
}

export class BaseEnemyDeadState extends State {
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().guard.death;
  protected speed = 0;
  protected fsm: BaseEnemyStateMachine;

  public constructor(fsm: BaseEnemyStateMachine) {
    super(fsm)
    this.fsm = fsm;
    this.gameObject = this.fsm.getEnemy().getGameObject();
  }
}

export class BaseEnemyChasingPlayerState extends State {
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().guard.run;
  protected speed = 7;
  protected fsm: BaseEnemyStateMachine;
  private player: MusicPlayer = MusicPlayer.createSlimeMovingPlayer();

  public constructor(fsm: BaseEnemyStateMachine) {
    super(fsm)
    this.fsm = fsm;
    this.gameObject = this.fsm.getEnemy().getGameObject();
  }

  public onEnter() {
    super.onEnter();
    this.player.play();
  }

  public onExit() {
    super.onExit();
    this.player.pause();
  }

  public update(timeElapsed: number) {
    super.update(timeElapsed);

    const currentPlayer = this.fsm.getEnemy().getEntityManager().getEntityByName('player') as PlayerEntity;
    const distance = this.fsm.getEnemy().getGameObject().getBox().getCenter().distance(currentPlayer.getGameObject().getBox().getCenter());
    this.player.tuneSoundByDistance(distance);

    const players = this.fsm.getEnemy().getEntityManager().findEntities(this.fsm.getEnemy().getGameObject().getBox().getCenter(), this.fsm.getEnemy().getReactDistance(), e => e instanceof PlayerEntity)

    if (players.length > 0) {
      const playerToChaise = players[0] as PlayerEntity;

      const distanceToPlayer = playerToChaise.getGameObject().getBox().getCenter().distance(this.fsm.getEnemy().getGameObject().getBox().getCenter());
      // TODO
      if (distanceToPlayer > this.fsm.getEnemy().getAttackRange()) {
        const playerCenterPosition = playerToChaise.getGameObject().getBox().getCenter();
        const enemyCenterPosition = this.fsm.getEnemy().getGameObject().getBox().getCenter();
        const angle = playerCenterPosition.getAngle(enemyCenterPosition);

        this.fsm.getEnemy().getGameObject().setRotation(angle);
        const speed = this.fsm.getEnemy().getSpeed();

        const dy = timeElapsed * (Math.sin(angle) * speed);
        const dx = timeElapsed * (Math.cos(angle) * speed);

        const nextBox = this.fsm.getEnemy().getGameObject().getBox().copy();
        nextBox.move(dx, dy);
        if (!this.fsm.getEnemy().findCollisions(nextBox).length) {
          this.fsm.getEnemy().getGameObject().getBox().move(dx, dy);
        }

        console.log('here1')
      } else {
        console.log('here')
        this.fsm.setAttackState();
      }

    } else {
      this.fsm.setIdleState();
    }
  }
}

export class BaseEnemyAttackPlayerState extends State {
  protected sprites: StateSprites = ResourceLoader.getLoadedAssets().guard.attack;
  protected speed = 7;
  protected fsm: BaseEnemyStateMachine;
  private player: MusicPlayer = MusicPlayer.createEvilSlimePlayer();
  private enemy: BaseEnemyEntity;

  public constructor(fsm: BaseEnemyStateMachine) {
    super(fsm)
    this.fsm = fsm;
    this.gameObject = this.fsm.getEnemy().getGameObject();
    this.enemy = this.fsm.getEnemy();
  }

  public onEnter() {
    super.onEnter();
    this.player.play();
  }

  public onExit() {
    super.onExit();
    this.player.pause();
  }

  public update(timeElapsed: number) {
    super.update(timeElapsed);

    // return;
    // const currentPlayer = this.fsm.getEnemy().getEntityManager().getEntityByName('player') as PlayerEntity;
    //
    // if (currentPlayer) {
    //   const distance = this.fsm.getEnemy().getGameObject().getBox().getCenter().distance(currentPlayer.getGameObject().getBox().getCenter());
    //   this.player.tuneSoundByDistance(distance);
    // }

    // TODO
    const players = this.fsm.getEnemy().getEntityManager().findEntities(this.fsm.getEnemy().getGameObject().getBox().getCenter(), this.fsm.getEnemy().getReactDistance(), (entity) => (
      entity instanceof PlayerEntity && ((entity as any as IEntityWithHealth).getHealth().getValue() > 0)
    ));

    const player: PlayerEntity | null = (players.length ? players[0] : null) as PlayerEntity | null;

    if (!player) {
      this.fsm.setIdleState();
    } else {
      const damage = this.enemy.getAttackDamage() * this.enemy.getAttackSpeed() * (timeElapsed / 1000);

      player.damage(damage);

      if (player.getGameObject().getBox().getCenter().distance(this.fsm.getEnemy().getGameObject().getBox().getCenter()) > this.fsm.getEnemy().getAttackRange()) {
        console.log('bbbb')
        this.fsm.setChasingPlayerState();
      }
    }
  }
}

export class BaseEnemyStateMachine extends FiniteStateMachine {
  protected enemy: BaseEnemyEntity;

  public setIdleState(): void {
    this.send({ type: 'idle' });
  }

  public setHangingAroundState(): void {
    this.send({ type: 'hangingAround' });
  }

  public setChasingPlayerState(): void {
    this.send({ type: 'chasingPlayer' });
  }

  public setAttackState(): void {
    this.send({ type: 'attack' });
  }

  public setDieState(): void {
    this.send({ type: 'die' });
  }

  public setDeadState(): void {
    this.send({ type: 'dead' });
  }

  public getEnemy(): BaseEnemyEntity {
    return this.enemy;
  }

  public constructor(enemy: BaseEnemyEntity) {
    super();
    this.enemy = enemy;
    this.addState('idle', BaseEnemyIdleState);
    this.addState('attack', BaseEnemyIdleState);
    this.addState('die', BaseEnemyDieState);
    this.addState('dead', BaseEnemyDeadState);
    this.addState('hangingAround', BaseEnemyHangingAroundState);
    this.addState('chasingPlayer', BaseEnemyChasingPlayerState);
  }

  public send(action: { type: string; data?: any }) {
    super.send(action);
    this.setState(this.states[action.type] as any)
  }

  public start() {
    super.start();
    this.setIdleState();
  }
}
