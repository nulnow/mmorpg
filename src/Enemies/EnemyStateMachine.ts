import { FiniteStateMachine } from '../StateMachine/FiniteStateMachine';
import { State, StateWithAnimation } from '../StateMachine/State';
import { ResourceLoader } from '../ResourceLoader';
import { EnemyEntity } from './EnemyEntity';
import { PlayerEntity } from '../Player/PlayerEntity';
import { MusicPlayer } from '../MusicPlayer';
import { IEntityWithHealth } from '../IEntityWithHealth';
import { Rotation } from '../Rendering/Rotation';
import { Random } from '../Random';
import { UnsubscribeFn } from '../EventEmitter';

export class EnemyIdleState extends StateWithAnimation {
  protected sprites = ResourceLoader.getLoadedAssets().slime.idle;
  protected speed = 7;
  protected fsm: EnemyStateMachine;
  protected player = MusicPlayer.createNeutralSlimePlayer();
  protected chanceToHangAround = 0.1;

  public constructor(fsm: EnemyStateMachine) {
    super(fsm);
    this.fsm = fsm;
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

    const players = this.fsm.getEnemy().getEntityManager().findEntities(this.fsm.getEnemy().getGameObject().getBox().getCenter(), 200, (e) => (
      e instanceof PlayerEntity && ((e as any as IEntityWithHealth).getHealth().getValue() > 0)
    ));

    if (players.length > 0) {
      this.fsm.setState(EnemyChasingPlayerState as any);
    } else {
      if (Random.runChance(timeElapsed / 1000, this.chanceToHangAround)) {
        this.fsm.setState(EnemyHangingAroundState as any);
      }
    }
  }
}

export class EnemyHangingAroundState extends StateWithAnimation {
  protected sprites = ResourceLoader.getLoadedAssets().slime.move;
  protected speed = 7;
  protected fsm: EnemyStateMachine;
  protected player = MusicPlayer.createNeutralSlimePlayer();
  protected chanceToStay = 0.1;
  protected rotation: Rotation = new Rotation(0);

  public constructor(fsm: EnemyStateMachine) {
    super(fsm);
    this.fsm = fsm;
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
      this.fsm.setState(EnemyIdleState as any);
    }

    if (Random.runChance(timeElapsed / 1000, this.chanceToStay)) {
      this.fsm.setState(EnemyIdleState as any);
    }
  }
}

export class EnemyDieState extends StateWithAnimation {
  protected sprites = ResourceLoader.getLoadedAssets().slime.die;
  protected speed = 7;
  protected fsm: EnemyStateMachine;

  private unsubscribeFromAnimationEnd: UnsubscribeFn | null = null;

  public constructor(fsm: EnemyStateMachine) {
    super(fsm);
    this.fsm = fsm;
  }

  public onEnter(): void {
    super.onEnter();
    this.unsubscribeFromAnimationEnd = this.animator.onAnimationEndOnce(() => {
      this.fsm.setState(EnemyDeadState as any);
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

export class EnemyDeadState extends StateWithAnimation {
  protected sprites = ResourceLoader.getLoadedAssets().slime.die.slice(0, 2);
  protected speed = 1;
  protected fsm: EnemyStateMachine;

  public constructor(fsm: EnemyStateMachine) {
    super(fsm);
    this.fsm = fsm;
  }
}

export class EnemyChasingPlayerState extends StateWithAnimation {
  protected sprites = ResourceLoader.getLoadedAssets().slime.move;
  protected speed = 7;
  protected fsm: EnemyStateMachine;
  private player: MusicPlayer = MusicPlayer.createSlimeMovingPlayer();

  public constructor(fsm: EnemyStateMachine) {
    super(fsm);
    this.fsm = fsm;
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

    const players = this.fsm.getEnemy().getEntityManager().findEntities(this.fsm.getEnemy().getGameObject().getBox().getCenter(), this.fsm.getEnemy().getReactDistance(), e => (
      e instanceof PlayerEntity
    ))

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

        this.fsm.getEnemy().getGameObject().getBox().move(dx, dy);
      } else {
        this.fsm.setState(EnemyAttackPlayerState as any);
      }

    } else {
      this.fsm.setState(EnemyIdleState as any);
    }
  }
}

export class EnemyAttackPlayerState extends StateWithAnimation {
  protected sprites = ResourceLoader.getLoadedAssets().slime.attack;
  protected speed = 7;
  protected fsm: EnemyStateMachine;
  private player: MusicPlayer = MusicPlayer.createEvilSlimePlayer();
  private enemy: EnemyEntity;

  public constructor(fsm: EnemyStateMachine) {
    super(fsm);
    this.fsm = fsm;
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

    const currentPlayer = this.fsm.getEnemy().getEntityManager().getEntityByName('player') as PlayerEntity;
    const distance = this.fsm.getEnemy().getGameObject().getBox().getCenter().distance(currentPlayer.getGameObject().getBox().getCenter());
    this.player.tuneSoundByDistance(distance);

    const players = this.fsm.getEnemy().getEntityManager().findEntities(this.fsm.getEnemy().getGameObject().getBox().getCenter(), this.fsm.getEnemy().getReactDistance(),
      e => e instanceof PlayerEntity && ((e as any as IEntityWithHealth).getHealth().getValue() > 0)
    );

    const player: PlayerEntity | null = (players.length ? players[0] : null) as PlayerEntity | null;

    if (!player) {
      this.fsm.setState(EnemyIdleState as any)
    } else {
      const damage = this.enemy.getAttackDamage() * this.enemy.getAttackSpeed() * (timeElapsed / 1000);

      player.damage(damage);

      if (player.getGameObject().getBox().getCenter().distance(this.fsm.getEnemy().getGameObject().getBox().getCenter()) > this.fsm.getEnemy().getAttackRange()) {
        this.fsm.setState(EnemyChasingPlayerState as any);
      }
    }
  }
}

export class EnemyStateMachine extends FiniteStateMachine {
  protected enemy: EnemyEntity;

  public getEnemy(): EnemyEntity {
    return this.enemy;
  }

  public constructor(enemy: EnemyEntity) {
    super(enemy);

    this.enemy = enemy;

    this.addState(EnemyIdleState as any);
    this.addState(EnemyChasingPlayerState as any);
    this.addState(EnemyAttackPlayerState as any);
    this.addState(EnemyDieState as any);
    this.addState(EnemyDeadState as any);

    this.setState(EnemyIdleState as any)
  }
}
