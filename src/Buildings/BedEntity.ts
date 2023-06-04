import { GameObject } from '../Rendering/GameObject';
import { Box } from '../Rendering/Box';
import { Position } from '../Rendering/Position';
import { ResourceLoader } from '../ResourceLoader';
import { DrawableEntity } from '../Rendering/DrawableEntity';
import { PlayerEntity } from '../Player/PlayerEntity';
import { UIEntity } from '../UI/UIEntity';

export class BedEntity extends DrawableEntity {
  protected gameObject: GameObject;
  // protected color = '#000';

  public constructor() {
    super();
    this.gameObject = new GameObject();
    this.setUp();
  }

  private setUp(): void {
    const image = ResourceLoader.getLoadedAssets().bed;

    const bed = new GameObject();
    bed.setBox(new Box(
      new Position(20, 490, 0),
      140, 70
    ));
    bed.setImage(image);
    bed.setIsCollidable(true);
    this.gameObject.addChild(bed);
  }

  public getGameObject(): GameObject {
    return this.gameObject;
  }

  private healed = false;
  public update(timeElapsed: number) {
    super.update(timeElapsed);
    if (!this.healed) {
      const player = this.getEntityManager().getEntityByName('player') as any as PlayerEntity;

      const selfTopLeft = this.gameObject.getChildren()[0].getBox().getTopLeft();
      const playerTopLeft = player.getGameObject().getBox().getTopLeft();


      if (!selfTopLeft || !playerTopLeft) {
        return;
      }

      const distanceToPlayer = selfTopLeft.distance(playerTopLeft);

      if (distanceToPlayer < 150) {
        player.setHealth(1000);
        this.healed = true;
        const uiEntity = this.getEntityManager().getEntityByName('ui') as UIEntity;
        uiEntity.showModal({
          title: 'You were healed!',
          body: ''
        })
      }
    }

  }
}
