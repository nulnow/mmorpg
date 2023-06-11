import { Camera } from './Camera';
import { PlayerEntity } from '../Player/PlayerEntity';
import { UnsubscribeFn } from '../EventEmitter';
import { addScreenOrientationChangeEventHandler, removeScreenOrientationChangeEventHandler } from '../JSHACKS';

export class FollowPlayerCamera extends Camera {
  private unsubscribeFromPlayerMoveEventFn: UnsubscribeFn | null = null;

  public constructor(width: number, height: number, private player: PlayerEntity, private params?: { maxWidth: number, maxHeight: number, minWidth: number, minHeight: number }) {
    super(width, height);
  }

  private syncWithPlayer = (): void => {
    const topLeft = this.getBox().getTopLeft();
    const playerCenter = this.player.getGameObject().getBox().getCenter();

    // TODO
    let nextX = playerCenter.x - (window.innerWidth / 2);
    let nextY = playerCenter.y - (window.innerHeight / 2);

    if (this.params) {
      if (nextX <= 0) {
        nextX = 0;
      }

      if (nextX + window.innerWidth >= this.params.maxWidth) {
        nextX = this.params.maxWidth - window.innerWidth;
      }

      if (nextY <= 0) {
        nextY = 0;
      }

      if (nextY + window.innerHeight >= this.params.maxHeight) {
        nextY = this.params.maxHeight - window.innerHeight;
      }
    }

    topLeft.x = nextX;
    topLeft.y = nextY;
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
