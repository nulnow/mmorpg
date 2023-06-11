import { FireEntity } from './FireEntity';
import { IEntityWithHealth } from '../IEntityWithHealth';
import { EnemyEntity } from '../Enemies/EnemyEntity';
import { PlayerEntity } from '../Player/PlayerEntity';
import { Rotation } from '../Rendering/Rotation';
import { MusicPlayer } from '../MusicPlayer';
import { SpriteFilter } from '../Rendering/Sprite';

export const firePurpleFilter: SpriteFilter = (context: CanvasRenderingContext2D) => {
  context.filter = 'hue-rotate(250deg)';
};

export const fireBlueFilter: SpriteFilter = (context: CanvasRenderingContext2D) => {
  context.filter = 'hue-rotate(180deg)';
};

export const fireGreenFilter: SpriteFilter = (context: CanvasRenderingContext2D) => {
  context.filter = 'hue-rotate(100deg)';
};

export class FireShieldEntity extends FireEntity {
  public constructor(
    private player: PlayerEntity,
    x: number,
    y: number,
    private speed: number = 0.002,
    width: number = 30,
    height: number = 30,
    filter?: SpriteFilter
  ) {
    super(x, y, width, height, filter);
    this.gameObject.setIsCollidable(false);

    // let globalCompositeOperation: string | null = null;
    // this.gameObject.addHook('before', (context, camera) => {
      // globalCompositeOperation = context.globalCompositeOperation;
      // context.globalCompositeOperation = "destination-in";
      // context.fillStyle = "#F00";
    // });

    // this.gameObject.addHook('after', (context, camera) => {
      // context.globalCompositeOperation = "source-over";
    // })
  }

  public initEntity() {
    super.initEntity();
    const fireBallPlayer = MusicPlayer.createFireBallPlayer();
    fireBallPlayer.setVolume(0.09);
    fireBallPlayer.play();
  }

  private distance = 70;
  public getDistance(): number {
    return this.distance;
  }
  public setDistance(distance: number): void {
    this.distance = distance;
  }

  public getAttackRange(): number {
    return 30;
  }

  public getAttackDamage(): number {
    return 50;
  }

  public getAttackSpeed(): number {
    return 1;
  }

  private rotation: Rotation = new Rotation(0);
  public getRotation(): Rotation {
    return this.rotation;
  }
  public setRotation(rotation: Rotation): void {
    this.rotation = rotation;
  }

  public update(timeElapsed: number) {

    super.update(timeElapsed);

    this.rotation.add(this.speed * timeElapsed);

    const playerTopLeft = this.player.getGameObject().getBox().getCenter();

    const x = Math.cos(this.rotation.get()) * this.distance + playerTopLeft.x - this.width / 2;
    const y = (Math.sin(this.rotation.get()) * 0.7 * this.distance + playerTopLeft.y - this.height / 2);

    const topLeft = this.gameObject.getBox().getTopLeft();
    topLeft.x = x;
    topLeft.y = y;

    // const collisions = this.findCollisions(nextBox);
    //
    // if (!collisions.length) {
    //   this.getGameObject().getBox().move(x, y);
    //   this.travelledDistance += length;
    // } else {
    //   this.stoppedAtCollisionTimeMs += timeElapsed;
    //   if (this.stoppedAtCollisionTimeMs >= this.MAX_FIRE_TIME_MS) {
    //     this.getEntityManager().removeEntity(this);
    //   }
    // }

    const player = this.getEntityManager().getEntityByName('player') as PlayerEntity;

    // if (this.travelledDistance >= MAX_DISTANCE) {
    //   this.getEntityManager().removeEntity(this);
    // }

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
}
