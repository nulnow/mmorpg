import { FollowPlayerCamera } from '../Camera/FollowPlayerCamera';
import { PlayerEntity } from '../Player/PlayerEntity';
import { Stairs } from '../Buildings/Stairs';
import { SlimeSpawner } from '../Spawner';
import { SpawnArea } from '../SpawnArea';

export class StairsLocation extends Stairs {
  private static SCALE = 1.5;

  private slimeSpawnArea: SpawnArea | null = null;

  public constructor(x: number, y: number) {
    super(x, y, StairsLocation.SCALE);
  }

  public initEntity() {
    super.initEntity();

    const slimeSpawner = new SlimeSpawner();
    this.slimeSpawnArea = new SpawnArea(
      this.getStairsSpawnArea(),
      slimeSpawner,
      8, 20000, 34000
    );
    this.getEntityManager().addEntity(this.slimeSpawnArea);
    this.getEntityManager().addEntity(slimeSpawner);
  }

  private isPlayerEntered = false;

  private onPlayerEnter(): void {
    const followPlayerCamera = this.getEntityManager().getEntityByName('camera') as FollowPlayerCamera;
    followPlayerCamera.params = {
      minWidth: this.x,
      minHeight: this.y,

      maxWidth: this.x + this.getWidth___TODO_DELETE_IT(),
      maxHeight: this.y + this.getHeight__TODO_DELETE_IT() + 200,
    };
  }

  private onPlayerExit(): void {
    const followPlayerCamera = this.getEntityManager().getEntityByName('camera') as FollowPlayerCamera;
    followPlayerCamera.params = undefined;
    followPlayerCamera.syncWithPlayer();
  }

  public update(timeElapsed: number) {
    super.update(timeElapsed);
    const player = this.getEntityManager().getEntityByName('player') as PlayerEntity;

    if (!player) {
      return;
    }

    const playerCollision = player.getGameObject().getBox().isCollide(this.getGameObject().getBox());
    if (playerCollision && !this.isPlayerEntered) {
      this.isPlayerEntered = true;
      this.onPlayerEnter();
    } else if (!playerCollision && this.isPlayerEntered) {
      this.isPlayerEntered = false;
      this.onPlayerExit();
    }
  }

  public destroy() {
    super.destroy();
  }
}
