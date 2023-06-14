import { StateWithAnimation } from '../StateMachine/State';
import { MusicPlayer } from '../MusicPlayer';
import { FiniteStateMachine, FSMAction } from '../StateMachine/FiniteStateMachine';
import { ResourceLoader } from '../ResourceLoader';
import { UnsubscribeFn } from '../EventEmitter';
import { PlayerEntity } from './PlayerEntity';
import { InputController } from '../InputController';
import { IEntityWithHealth } from '../IEntityWithHealth';
import { EnemyEntity } from '../Enemies/EnemyEntity';

export class PlayerIdleState extends StateWithAnimation {
  // protected sprites = ResourceLoader.getLoadedAssets().adventurer.idle;
  protected sprites = ResourceLoader.getLoadedAssets().skeleton.idle;
  protected speed = 5;
  protected fsm: PlayerFiniteStateMachine;

  public constructor(fsm: PlayerFiniteStateMachine) {
    super(fsm);
    this.fsm = fsm;
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
      this.fsm.setAttackState();
    }
    if (this.fsm.getPlayer().getInputController()?.isAttack2Pressed()) {
      this.fsm.getPlayer().fireAttack();
    }
    if (this.fsm.getPlayer().getInputController()?.isAttack3Pressed()) {
      this.fsm.getPlayer().activateFireShield();
    }
    if (this.fsm.getPlayer().getInputController()?.isAttack4Pressed()) {
      this.fsm.getPlayer().addHealBall();
    }


    if (this.fsm.getPlayer().getInputController()?.isClearButtonPressed()) {
      this.fsm.getPlayer().handleClear();
    }
    if (this.fsm.getPlayer().getInputController()?.isOneOfMovementKeysIsPressed()) {
      this.fsm.setRunState();
    }
  }
}

export class PlayerRunState extends StateWithAnimation {
  // protected sprites = ResourceLoader.getLoadedAssets().adventurer.run;
  protected sprites = ResourceLoader.getLoadedAssets().skeleton.run;
  // protected speed = 5;
  protected speed = 25;
  protected fsm: PlayerFiniteStateMachine;

  public constructor(fsm: PlayerFiniteStateMachine) {
    super(fsm);
    this.fsm = fsm;
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

    if (this.fsm.getPlayer().getInputController()?.isAttack1Pressed()) {
      this.fsm.setAttackState();
    }
    if (this.fsm.getPlayer().getInputController()?.isAttack2Pressed()) {
      this.fsm.getPlayer().fireAttack();
    }
    if (this.fsm.getPlayer().getInputController()?.isAttack3Pressed()) {
      this.fsm.getPlayer().activateFireShield();
    }
    if (this.fsm.getPlayer().getInputController()?.isClearButtonPressed()) {
      this.fsm.getPlayer().handleClear();
    }

    if (!inputController?.isOneOfMovementKeysIsPressed()) {
      this.fsm.setIdleState();
    } else {
      const maxDeltaPX = 0.5;
      const length = (this.fsm.getPlayer().getSpeed() * timeElapsed) / 1000;

      const size = Math.floor(length / maxDeltaPX);
      const left = maxDeltaPX % length;
      let isMoved = false;

      const player = this.fsm.getPlayer();
      const playerBox = player.getGameObject().getBox()
      const nextBox = playerBox.copy();

      for (let i = 0; i <= size; i++) {
        let toAdd = maxDeltaPX;
        if (i === size) {
          toAdd = left;
          break;
        }

        let x = 0;
        let y = 0;

        if (inputController.isTopPressed()) {
          y -= toAdd;
        }

        if (inputController.isRightPressed()) {
          x += toAdd;
        }

        if (inputController.isBottomPressed()) {
          y += toAdd;
        }

        if (inputController.isLeftPressed()) {
          x -= toAdd;
        }

        let xCollide = false;
        let yCollide = false;
        {
          nextBox.move(x, 0);

          const collisions = this.fsm.getPlayer().findCollisions(nextBox);

          if (collisions.length === 0) {
            const angle = Math.atan2(y, x);
            if (Math.abs(angle) !== (Math.PI / 2)) {
              player.getGameObject().setRotation(angle);
            }
            playerBox.move(x, 0);
            isMoved = true;
          } else {
            xCollide = true;
          }
        }

        {
          nextBox.move(0, y);

          const collisions = this.fsm.getPlayer().findCollisions(nextBox);

          if (collisions.length === 0) {
            const angle = Math.atan2(y, x);
            if (Math.abs(angle) !== (Math.PI / 2)) {
              player.getGameObject().setRotation(angle);
            }
            playerBox.move(0, y);
            isMoved = true;
          } else {
            yCollide = true;
          }
        }

        if (xCollide && yCollide) {
          break;
        }
      }

      if (isMoved) {
        player.getEntityManager().emitter.emit('player_move', player);
      }
    }
  }
}

export class PlayerAttackState extends StateWithAnimation {
  // protected sprites = ResourceLoader.getLoadedAssets().adventurer.attack1;
  protected sprites = ResourceLoader.getLoadedAssets().skeleton.attack;
  protected speed = 20;
  protected fsm: PlayerFiniteStateMachine;
  protected player: PlayerEntity;

  private unsubscribeFromAnimationEnd: UnsubscribeFn | null = null;

  public constructor(fsm: PlayerFiniteStateMachine) {
    super(fsm);
    this.fsm = fsm;
    this.player = this.fsm.getPlayer();
  }

  public onEnter(): void {
    super.onEnter();
    MusicPlayer.playAttackOnce();
    this.unsubscribeFromAnimationEnd = this.animator.onAnimationEndOnce(() => {
      this.fsm.setIdleState();
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

    const entities = this.fsm.getPlayer().getEntityManager()
      .findEntities(this.player.getGameObject().getBox().getCenter(), this.player.getAttackRange(), entity => (
        (entity !== this.player)
        && (!!(entity as any).getHealth)
        && ((entity as any as IEntityWithHealth).getHealth().getValue() > 0)
      ));

    const damage = this.player.getAttackDamage() * this.player.getAttackSpeed() * (timeElapsed / 1000);

    for (const e of entities) {
      (e as EnemyEntity).damage(damage, this.player);
    }
  }
}

export class PlayerDieState extends StateWithAnimation {
  // protected sprites = ResourceLoader.getLoadedAssets().adventurer.die;
  protected sprites = ResourceLoader.getLoadedAssets().skeleton.die;
  protected speed = 5;
  protected fsm: PlayerFiniteStateMachine;

  private unsubscribeFromAnimationEnd: UnsubscribeFn | null = null;

  public constructor(fsm: PlayerFiniteStateMachine) {
    super(fsm);
    this.fsm = fsm;
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
}

export class PlayerDeadState extends StateWithAnimation {
  // protected sprites = ResourceLoader.getLoadedAssets().adventurer.dead.slice(0, 1);
  protected sprites = ResourceLoader.getLoadedAssets().adventurer.dead.slice(0, 1);
  protected speed = 1;
  protected fsm: PlayerFiniteStateMachine;

  public constructor(fsm: PlayerFiniteStateMachine) {
    super(fsm);
    this.fsm = fsm;
  }
}

export class PlayerFiniteStateMachine extends FiniteStateMachine {
  private readonly player: PlayerEntity;
  private inputController!: InputController;

  private readonly idleState: PlayerIdleState;
  private readonly runState: PlayerRunState;
  private readonly attackState: PlayerAttackState;
  private readonly deadState: PlayerDeadState;
  private readonly dieState: PlayerDieState;

  public constructor(player: PlayerEntity) {
    super(player);
    this.player = player;

    this.idleState = new PlayerIdleState(this);
    this.runState = new PlayerRunState(this);
    this.attackState = new PlayerAttackState(this);
    this.deadState = new PlayerDeadState(this);
    this.dieState = new PlayerDieState(this);

    this.setIdleState();
  }

  public setIdleState(): void {
    this.setState(this.idleState);
  }

  public setRunState(): void {
    this.setState(this.runState);
  }

  public setAttackState(): void {
    this.setState(this.attackState);
  }

  public setDeadState(): void {
    this.setState(this.deadState);
  }

  public setDieState(): void {
    this.setState(this.dieState);
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
