import { State } from '../StateMachine/State';
import { MusicPlayer } from '../MusicPlayer';
import { FiniteStateMachine, FSMAction } from '../StateMachine/FiniteStateMachine';
import { PlayerEntity } from './PlayerEntity';
import { ResourceLoader } from '../ResourceLoader';

export class PlayerIdleState extends State {
  protected fsm: PlayerFSM;

  protected sprites = ResourceLoader.getLoadedAssets().adventurer.idle;
  protected speed = 5;

  public constructor(fsm: PlayerFSM) {
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
  }
}

export class PlayerRunState extends State {
  protected fsm: PlayerFSM;

  public constructor(fsm: PlayerFSM) {
    super(fsm);
    this.fsm = fsm;
  }

  public onEnter(): void {
    MusicPlayer.playSteps();
  }

  public onExit(): void {
    MusicPlayer.pausePlayingSteps();
  }

  public update(_: number): void {
    this.fsm.getPlayer()
    // Тут можно взаимодействовать со всем в зависимости от того, столько времени прошло
  }
}

export class PlayerAttackState extends State {
  public constructor(fsm: PlayerFSM) {
    super(fsm);
  }

  public onEnter(): void {
    MusicPlayer.playAttackOnce();
  }

  public onExit(): void {

  }

  public update(_: number): void {

  }
}

export class PlayerFSM extends FiniteStateMachine {
  private readonly player: PlayerEntity;

  public getPlayer() {
    return this.player;
  }

  public constructor(player: PlayerEntity) {
    super(PlayerIdleState as any);
    this.player = player;

    this.addState(PlayerRunState as any);
    this.addState(PlayerIdleState as any);
    this.addState(PlayerAttackState as any);
  }

  public onAction(action: FSMAction): void {

  }
}
