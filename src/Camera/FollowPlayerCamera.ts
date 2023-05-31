import { Camera } from './Camera';
import { PlayerEntity } from '../Player/PlayerEntity';
import { UnsubscribeFn } from '../EventEmitter';

export class FollowPlayerCamera extends Camera {
  private unsubscribeFromPlayerMoveEventFn: UnsubscribeFn | null = null;

  public constructor(width: number, height: number, private player: PlayerEntity) {
    super(width, height);
  }

  private syncWithPlayer(): void {
    const rect = this.getBox().getRect();
    const topLeft = this.getBox().getTopLeft();
    const playerCenter = this.player.getGameObject().getBox().getCenter();

    topLeft.x = playerCenter.x - (rect.width / 2)
    topLeft.y = playerCenter.y - (rect.height / 2)
  }

  public initEntity(): void {
    super.initEntity();
    this.syncWithPlayer();
    this.unsubscribeFromPlayerMoveEventFn = this.player.emitter.subscribe('player_move', (newPlayerBox) => {
      this.syncWithPlayer();
      document.getElementById('cameraPos')!.innerHTML = `camera center x ${this.getBox().getCenter().x} y ${this.getBox().getCenter().y} <br />`;
      document.getElementById('cameraPos')!.innerHTML += `camera corner x ${this.getBox().getRect().left} y ${this.getBox().getRect().top} <br />`;
    });
  }

  public destroy(): void {
    super.destroy();
    if (this.unsubscribeFromPlayerMoveEventFn) {
      this.unsubscribeFromPlayerMoveEventFn();
    }
  }
}
