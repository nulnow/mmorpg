import { DrawableEntity } from './Rendering/DrawableEntity';
import { Box } from './Rendering/Box';
import { UnsubscribeFn } from './EventEmitter';
import { PlayerEntity } from './Player/PlayerEntity';
import { GameObject } from './Rendering/GameObject';

export class TeleportEntity extends DrawableEntity {
  private unsubscribeFromPlayerMoveFn: UnsubscribeFn | null = null;
  private boxOut: Box;

  public constructor(
    boxIn: Box,
    boxOut: Box,
  ) {
    super();
    this.gameObject = new GameObject();
    this.gameObject.setBox(boxIn);
    this.getGameObject().setColor('rgba(255,0,0,0.04)');

    const outGameObject = new GameObject();
    outGameObject.setBox(boxOut);
    outGameObject.setColor('rgba(0,60,255,0.02)');

    this.gameObject.addChild(outGameObject);
    this.boxOut = boxOut;
  }

  public initEntity() {
    super.initEntity();
    this.unsubscribeFromPlayerMoveFn = this.getEntityManager().emitter.subscribe('player_move', (player: PlayerEntity) => {
      if (player.getGameObject().getBox().isCollide(this.getGameObject().getBox())) {
        player.getGameObject().getBox().setTopLeft(
          this.boxOut.getTopLeft().copy()
        );
      }
    });
  }

  public destroy() {
    super.destroy();
    if (this.unsubscribeFromPlayerMoveFn) {
      this.unsubscribeFromPlayerMoveFn();
    }
  }
}
