import { State } from '../StateMachine/State';
import { MusicPlayer } from '../MusicPlayer';
import { FiniteStateMachine, FSMAction } from '../StateMachine/FiniteStateMachine';
import { ResourceLoader } from '../ResourceLoader';
import { UnsubscribeFn } from '../EventEmitter';
import { PlayerEntity } from './PlayerEntity';
import { InputController } from '../InputController';
import { GameMap } from '../GameMap';
import { IEntityWithHealth } from '../IEntityWithHealth';
import { EnemyEntity } from '../Enemies/EnemyEntity';

export class PlayerIdleState extends State {
  protected sprites = ResourceLoader.getLoadedAssets().adventurer.idle;
  protected speed = 5;
  protected fsm: PlayerFiniteStateMachine;

  public constructor(fsm: PlayerFiniteStateMachine) {
    super(fsm);
    this.fsm = fsm;
    this.gameObject = this.fsm.getPlayer().getGameObject();
  }

  public onEnter(): void {
    super.onEnter();
  }

  public onExit(): void {
    super.onExit();
  }

  public update(timeElapsed: number): void {
    super.update(timeElapsed);
    if (this.fsm.getPlayer().getInputController()?.isAttack1Pressed()) {
      return this.fsm.setState(PlayerAttackState as any);
    }
    if (this.fsm.getPlayer().getInputController()?.isOneOfMovementKeysIsPressed()) {
      return this.fsm.setState(PlayerRunState as any);
    }
  }
}

export class PlayerRunState extends State {
  protected sprites = ResourceLoader.getLoadedAssets().adventurer.run;
  protected speed = 5;
  protected fsm: PlayerFiniteStateMachine;

  public constructor(fsm: PlayerFiniteStateMachine) {
    super(fsm);

    this.fsm = fsm;
    this.gameObject = fsm.getPlayer().getGameObject();
  }

  public onEnter(): void {
    super.onEnter();
    MusicPlayer.playSteps();
  }

  public onExit(): void {
    super.onExit();
    MusicPlayer.pausePlayingSteps();
  }

  public update(timeElapsed: number): void {
    super.update(timeElapsed);
    const inputController = this.fsm.getInputController();
    if (!inputController) {
      return;
    }
    if (!inputController?.isOneOfMovementKeysIsPressed()) {
      this.fsm.setState(PlayerIdleState as any);
    } else {
      const length = (this.fsm.getPlayer().getSpeed() * timeElapsed) / 1000;
      let x = 0;
      let y = 0;

      if (inputController.isTopPressed()) {
        y -= length;
      }

      if (inputController.isRightPressed()) {
        x += length;
      }

      if (inputController.isBottomPressed()) {
        y += length;
      }

      if (inputController.isLeftPressed()) {
        x -= length;
      }

      const player = this.fsm.getPlayer();
      const playerBox = player.getGameObject().getBox()
      const nextBox = playerBox.copy();
      nextBox.move(x, y);

      document.getElementById('playerPos')!.innerHTML = `player center x ${nextBox.getCenter().x} y ${nextBox.getCenter().y} <br />`
      document.getElementById('playerPos')!.innerHTML += `player topleft x ${nextBox.getTopLeft().x} y ${nextBox.getTopLeft().y}`

      const collisions = this.fsm.getPlayer().findCollisions(nextBox);

      if (collisions.length === 0) {
        const angle = Math.atan2(y, x);
        if (Math.abs(angle) !== (Math.PI / 2)) {
          player.getGameObject().setRotation(angle);
        }
        playerBox.move(x, y);
        player.emitter.emit('player_move', playerBox);
      }
    }
  }
}

export class PlayerAttackState extends State {
  protected sprites = ResourceLoader.getLoadedAssets().adventurer.attack1;
  protected speed = 20;
  protected fsm: PlayerFiniteStateMachine;
  protected player: PlayerEntity;

  private unsubscribeFromAnimationEnd: UnsubscribeFn | null = null;

  public constructor(fsm: PlayerFiniteStateMachine) {
    super(fsm);
    this.fsm = fsm;
    this.gameObject = this.fsm.getPlayer().getGameObject();
    this.player = this.fsm.getPlayer();
  }

  public onEnter(): void {
    super.onEnter();
    MusicPlayer.playAttackOnce();
    this.unsubscribeFromAnimationEnd = this.animator.onAnimationEndOnce(() => {
      this.fsm.setState(PlayerIdleState as any);
    });
  }

  public onExit(): void {
    super.onExit();
    if (this.unsubscribeFromAnimationEnd) {
      this.unsubscribeFromAnimationEnd();
    }
  }

  public update(timeElapsed: number): void {
    super.update(timeElapsed);

    const gameMap = this.fsm.getPlayer().getEntityManager().getEntityByName('map') as GameMap;
    const entities = gameMap
      .findEntities(this.player.getGameObject().getBox().getCenter(), this.player.getAttackRange())
      .filter(entity => entity !== this.player)
      .filter(entity => !!(entity as any).getHealth)
      .filter(entity => (entity as any as IEntityWithHealth).getHealth().getValue() > 0);

    const damage = this.player.getAttackDamage() * this.player.getAttackSpeed() * (timeElapsed / 1000);

    entities.forEach(e => {
      (e as EnemyEntity).damage(damage, this.player);
    });
  }
}

export class PlayerDieState extends State {
  protected sprites = ResourceLoader.getLoadedAssets().adventurer.die;
  protected speed = 5;
  protected fsm: PlayerFiniteStateMachine;

  private unsubscribeFromAnimationEnd: UnsubscribeFn | null = null;

  public constructor(fsm: PlayerFiniteStateMachine) {
    super(fsm);
    this.fsm = fsm;
    this.gameObject = this.fsm.getPlayer().getGameObject();
  }

  public onEnter(): void {
    super.onEnter();
    this.unsubscribeFromAnimationEnd = this.animator.onAnimationEndOnce(() => {
      this.fsm.setState(PlayerDeadState as any);
    });
  }

  public onExit(): void {
    super.onExit();
    if (this.unsubscribeFromAnimationEnd) {
      this.unsubscribeFromAnimationEnd();
    }
  }
}

export class PlayerDeadState extends State {
  protected sprites = ResourceLoader.getLoadedAssets().adventurer.dead.slice(0, 1);
  protected speed = 1;
  protected fsm: PlayerFiniteStateMachine;

  public constructor(fsm: PlayerFiniteStateMachine) {
    super(fsm);
    this.fsm = fsm;
    this.gameObject = this.fsm.getPlayer().getGameObject();
  }
}

export class PlayerFiniteStateMachine extends FiniteStateMachine {
  private player: PlayerEntity;
  private inputController!: InputController;

  public constructor(player: PlayerEntity) {
    super();
    this.player = player;

    this.setState(PlayerIdleState as any);
  }

  public getPlayer(): PlayerEntity {
    return this.player;
  }

  public getInputController(): InputController {
    return this.inputController;
  }

  public onEntityInit() {
    this.inputController = this.player.getInputController();
  }

  public onAction(_: FSMAction): void {}

  public update(timeElapsed: number) {
    super.update(timeElapsed);
  }
}
