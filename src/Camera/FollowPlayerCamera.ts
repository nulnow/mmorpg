import { Camera } from './Camera';
import { PlayerEntity } from '../Player/PlayerEntity';
import { UnsubscribeFn } from '../EventEmitter';
import { addScreenOrientationChangeEventHandler, removeScreenOrientationChangeEventHandler } from '../JSHACKS';

export class FollowPlayerCamera extends Camera {
  private unsubscribeFromPlayerMoveEventFn: UnsubscribeFn | null = null;

  public constructor(width: number, height: number, private player: PlayerEntity) {
    super(width, height);
  }

  private syncWithPlayer = (): void => {
    const topLeft = this.getBox().getTopLeft();
    const playerCenter = this.player.getGameObject().getBox().getCenter();

    // TODO
    topLeft.x = playerCenter.x - (window.innerWidth / 2)
    topLeft.y = playerCenter.y - (window.innerHeight / 2)
  }

  public initEntity(): void {
    super.initEntity();
    this.syncWithPlayer();
    this.unsubscribeFromPlayerMoveEventFn = this.player.emitter.subscribe('player_move', () => {
      this.syncWithPlayer();
      document.getElementById('cameraPos')!.innerHTML = `camera center x ${this.getBox().getCenter().x} y ${this.getBox().getCenter().y} <br />`;
      document.getElementById('cameraPos')!.innerHTML += `camera corner x ${this.getBox().getRect().left} y ${this.getBox().getRect().top} <br />`;
    });
    window.addEventListener('resize', this.syncWithPlayer);
    addScreenOrientationChangeEventHandler(this.syncWithPlayer);
  }

  public destroy(): void {
    super.destroy();
    window.removeEventListener('resize', this.syncWithPlayer);
    removeScreenOrientationChangeEventHandler(this.syncWithPlayer);
    if (this.unsubscribeFromPlayerMoveEventFn) {
      this.unsubscribeFromPlayerMoveEventFn();
    }
  }
}
