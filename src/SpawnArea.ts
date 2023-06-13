import { Entity } from './Entity';
import { Spawner } from './Spawner';
import { Box } from './Rendering/Box';
import { Position } from './Rendering/Position';
import { BaseEnemyEntity } from './Enemies/BaseEnemy/BaseEnemyEntity';
import { UnsubscribeFn } from './EventEmitter';
import { removeOneFromArray } from './JSHACKS';
import { GAME_EVENTS } from './GAME_EVENTS';

export class SpawnArea extends Entity {
  private liveEntities: BaseEnemyEntity[] = [];
  private deadEntities: BaseEnemyEntity[] = [];

  private unsubscribeFromEnemyDeathFn: UnsubscribeFn | null = null;

  public constructor(
    private box: Box,
    private spawner: Spawner,
    private maxCount: number,
    private CHECK_INTERVAL: number,
    private CLEAR_DEATH_ENTITIES_CHECK_INTERVAL: number,
  ) {
    super();
    this.timeSinceLastEntitiesCountCheck = CHECK_INTERVAL;
  }

  public initEntity() {
    super.initEntity();

    this.unsubscribeFromEnemyDeathFn =
      this.getEntityManager().emitter.subscribe(GAME_EVENTS.KILLED_EVENT, ({ who }: { who: Entity }) => {
        const length = this.liveEntities.length;
        removeOneFromArray(this.liveEntities, (e) => e !== who);
        const newLenght = this.liveEntities.length;
        if (length !== newLenght) {
          this.deadEntities.push(who as any);
        }
      });
  }

  private respawnEntities(): void {
    const rect = this.box.getRect();
    const count = this.maxCount - this.liveEntities.length;

    for (let i = 0; i < count; i++) {
      const entity = this.spawner.spawn();
      const x = rect.left + Math.random() * rect.width;
      const y = rect.top + Math.random() * rect.height;
      entity.getGameObject().getBox().setTopLeft(
        new Position(x, y),
      );
      this.getEntityManager().addEntity(entity);
      this.getEntityManager().addToScene(entity);
      this.liveEntities.push(entity);
    }
  }

  public clearDeadEntities(): void {
    for (const deadEntity of this.deadEntities) {
      this.getEntityManager().removeEntity(deadEntity);
    }
  }

  public destroy() {
    super.destroy();
    if (this.unsubscribeFromEnemyDeathFn) {
      this.unsubscribeFromEnemyDeathFn();
    }
  }

  private timeSinceLastEntitiesCountCheck;
  private timeSinceLastClearDeathEntititesCheck = 0;
  public update(timeElapsed: number) {
    super.update(timeElapsed);
    this.timeSinceLastEntitiesCountCheck += timeElapsed;
    this.timeSinceLastClearDeathEntititesCheck += timeElapsed;

    if (this.timeSinceLastEntitiesCountCheck >= this.CHECK_INTERVAL) {
      this.respawnEntities();
      this.timeSinceLastEntitiesCountCheck = 0;
    }

    if (this.timeSinceLastClearDeathEntititesCheck >= this.CLEAR_DEATH_ENTITIES_CHECK_INTERVAL) {
      this.clearDeadEntities();
      this.timeSinceLastClearDeathEntititesCheck = 0;
    }
  }
}
