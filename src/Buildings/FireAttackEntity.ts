import { FireEntity } from './FireEntity';
import { GameMap } from '../GameMap';
import { IEntityWithHealth } from '../IEntityWithHealth';
import { EnemyEntity } from '../Enemies/EnemyEntity';
import { PlayerEntity } from '../Player/PlayerEntity';

const MAX_DISTANCE = 300;

export class FireAttackEntity extends FireEntity {
  public constructor(
    x: number,
    y: number,
    private rotation: number = 0,
    private speed: number = 500,
    width: number = 30,
    height: number = 30,
  ) {
    super(x, y, width, height);
    this.gameObject.setIsCollidable(false);
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

  public reset(): void {
    this.travelledDistance = 0;
    this.stoppedAtCollisionTimeMs = 0;
  }

  private travelledDistance = 0;
  private stoppedAtCollisionTimeMs = 0;
  private MAX_FIRE_TIME_MS = 1000;

  public update(timeElapsed: number) {
    super.update(timeElapsed);

    const length = (this.speed * timeElapsed) / 1000;
    const x = length * Math.cos(this.rotation);
    const y = length * Math.sin(this.rotation);

    const nextBox = this.getGameObject().getBox().copy();
    nextBox.move(x, y);

    const collisions = this.findCollisions(nextBox);

    if (!collisions.length) {
      this.getGameObject().getBox().move(x, y);
      this.travelledDistance += length;
    } else {
      this.stoppedAtCollisionTimeMs += timeElapsed;
      if (this.stoppedAtCollisionTimeMs >= this.MAX_FIRE_TIME_MS) {
        this.getEntityManager().removeEntity(this);
      }
    }

    const player = this.getEntityManager().getEntityByName('player') as PlayerEntity;

    if (this.travelledDistance >= MAX_DISTANCE) {
      this.getEntityManager().removeEntity(this);
    }

    const gameMap = this.getEntityManager().getEntityByName('map') as GameMap;
    const entities = gameMap
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
