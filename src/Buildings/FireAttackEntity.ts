import { FireEntity } from './FireEntity';
import { IEntityWithHealth } from '../IEntityWithHealth';
import { EnemyEntity } from '../Enemies/EnemyEntity';
import { PlayerEntity } from '../Player/PlayerEntity';
import { MusicPlayer } from '../MusicPlayer';
import { SpriteFilter } from '../Rendering/Sprite';

const MAX_DISTANCE = 1300;

export class FireAttackEntity extends FireEntity {
  public static readonly DEFAULT_SPEED = 800;
  public static readonly DEFAULT_WIDTH = 60;
  public static readonly DEFAULT_HEIGHT = 60;

  private fireBallPlayer = MusicPlayer.createFireBallPlayer();
  private firePlayer = MusicPlayer.createFirePlayer();

  public constructor(
    x: number,
    y: number,
    private rotation: number = 0,
    private speed: number = FireAttackEntity.DEFAULT_SPEED,
    width: number = FireAttackEntity.DEFAULT_WIDTH,
    height: number = FireAttackEntity.DEFAULT_HEIGHT,
    filter?: SpriteFilter,
  ) {
    super(x, y, width, height, filter);
    this.gameObject.setIsCollidable(false);
  }

  public initEntity() {
    super.initEntity();
    setTimeout(() => {
      this.fireBallPlayer.play();
    }, Math.random() * 200);
  }

  public getAttackRange(): number {
    return 130;
  }

  public getAttackDamage(): number {
    return 50;
  }

  public getAttackSpeed(): number {
    return 1;
  }

  private travelledDistance = 0;
  private stoppedAtCollisionTimeMs = 0;
  private MAX_FIRE_TIME_MS = 60000 * 1;

  private exploded = false;
  private stopped = false;
  public update(timeElapsed: number) {
    super.update(timeElapsed);

    const length = (this.speed * timeElapsed) / 1000;
    const x = length * Math.cos(this.rotation);
    const y = length * Math.sin(this.rotation);

    const nextBox = this.getGameObject().getBox().copy();
    nextBox.move(x, y);

    const collisions = this.findCollisions(nextBox);

    if (!collisions.length && !this.stopped) {
      this.getGameObject().getBox().move(x, y);
      this.travelledDistance += length;
    } else {
      this.stopped = true;
      this.fireBallPlayer.pause();
      this.firePlayer.play();
      this.stoppedAtCollisionTimeMs += timeElapsed;

      if (!this.exploded) {
        this.exploded = true;
        setTimeout(() => {
          MusicPlayer.createFireballExplosionPlayer().play();
        }, Math.random() * 200);
      }

      // let percent = 1 - this.stoppedAtCollisionTimeMs / (this.MAX_FIRE_TIME_MS  || 1);

      if (this.stoppedAtCollisionTimeMs >= this.MAX_FIRE_TIME_MS) {
        this.firePlayer.pause();
        this.getEntityManager().removeEntity(this);
      }
    }

    const player = this.getEntityManager().getEntityByName('player') as PlayerEntity;

    if (this.travelledDistance >= MAX_DISTANCE) {
      this.getEntityManager().removeEntity(this);
    }

    const entities = this.getEntityManager()
      .findEntities(this.getGameObject().getBox().getCenter(), this.getAttackRange(), entity =>
        (entity !== player)
        && !!(entity as any).getHealth
        && ((entity as any as IEntityWithHealth).getHealth().getValue() > 0)
      )

    const damage = this.getAttackDamage() * this.getAttackSpeed() * (timeElapsed / 1000);

    for (const e of entities) {
      (e as EnemyEntity).damage(damage, player);
    }
  }

  public destroy() {
    super.destroy();
    this.firePlayer.pause();
  }
}
