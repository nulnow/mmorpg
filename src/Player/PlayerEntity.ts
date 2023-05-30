import { Entity } from '../Entity';
import { InputController } from '../InputController';
import { GameMap } from '../GameMap';
import { Box } from '../Rendering/Box';
import { UnsubscribeFn } from '../EventEmitter';
import { ResourceLoader } from '../ResourceLoader';
import { Position } from '../Rendering/Position';
import { MusicPlayer } from '../MusicPlayer';

export class PlayerEntity extends Entity {
  private timeSpentTODO = 0;
  private currentAnimationId = 0;

  private health = 100;
  public getHealth(): number {
    return this.health;
  }

  private rot: 'left' | 'right' = 'right';
  public getRot(): 'left' | 'right' {
    return this.rot;
  }
  private currentState = 'idle';
  public getCurrentState() {
    return this.currentState;
  }
  private states = {
    idle: {
      spriteInSec: 6,
      sprites: ResourceLoader.getLoadedAssets().adventurer.idle,
    },
    run: {
      spriteInSec: 6,
      sprites: ResourceLoader.getLoadedAssets().adventurer.run,
    },
    attack1: {
      spriteInSec: 12,
      single: true,
      next: 'idle',
      sprites: ResourceLoader.getLoadedAssets().adventurer.attack1,
    },
  };

  public constructor() {
    super();
    this.setBox(new Box(
      new Position(50, 50, 0),
      new Position(200, 200, 0),
    ));
  }

  private setState(stateName: string): void {
    if (stateName === 'attack1') {
      MusicPlayer.playAttackOnce();
    }
    this.timeSpentTODO = 0;
    this.currentAnimationId = 0;
    this.currentState = stateName;
  }

  public getCurrentSprite() {
    const spriteInSec = (() => {
      if (this.currentState === 'attack1') {
        return this.attackSpeed;
      }
      if (this.currentState === 'run') {
        return this.states[this.currentState].spriteInSec! + this.speed / 40;
      }

      return this.states[this.currentState].spriteInSec!;
    })();
    const SPRITE_TIME_MS = (1000 / spriteInSec);
    if (this.timeSpentTODO >= SPRITE_TIME_MS) {
      this.currentAnimationId++;
      if (this.currentAnimationId >= this.states[this.currentState].sprites!.length && this.states[this.currentState].single) {
        this.setState(this.states[this.currentState].next);
      }
      this.currentAnimationId %= this.states[this.currentState].sprites!.length;
      this.timeSpentTODO = 0;
    }

    const sprite = this.states[this.currentState].sprites[this.currentAnimationId];
    if (this.rot === 'left') {
      return ResourceLoader.flipImage(sprite, this.getBox().getRect());
    }
    return sprite;
  }

  private inputController!: InputController;
  private speed = 100;
  public getSpeed(): number {
    return this.speed;
  }
  private attackSpeed = 15;
  public getAttackSpeed(): number {
    return this.attackSpeed;
  }
  private static readonly COLLISION_CHECK_DISTANCE_PX = 1000;

  public COLOR = "rgba(255,0,98,0)";

  private unsubscribeFromSpeedChange!: UnsubscribeFn;

  public initEntity(): void {
    this.inputController = this.getComponentByName('InputController') as any as InputController;

    this.unsubscribeFromSpeedChange = this.emitter.subscribe('speed_change', (value) => {
      this.speed = value;
    });
    this.emitter.subscribe('attack_speed_change', (value) => {
      this.attackSpeed = value;
    });

    super.initEntity();
  }

  public destroy() {
    super.destroy();
    this.unsubscribeFromSpeedChange();
  }

  public update(timeElapsed: number): void {
    super.update(timeElapsed);
    this.timeSpentTODO += timeElapsed;

    if (this.currentState !== 'attack1' && this.inputController.isOneOfMovementKeysIsPressed()) {
      const length = (this.speed * timeElapsed) / 1000;
      let x = 0;
      let y = 0;

      if (this.inputController.isTopPressed()) {
        y -= length;
      }

      if (this.inputController.isRightPressed()) {
        x += length;
        this.rot = 'right'
      }

      if (this.inputController.isBottomPressed()) {
        y += length;
      }

      if (this.inputController.isLeftPressed()) {
        x -= length;
        this.rot = 'left'
      }

      const nextBox = this.getBox().copy();
      nextBox.move(x, y);

      const collisions = this.findCollisions(nextBox);

      if (collisions.length === 0) {
        this.getBox().move(x, y);
      }

      if (this.currentState !== 'run') {
        this.setState('run');
        MusicPlayer.playSteps();
      }
    } else {
      if (this.currentState !== 'idle' && this.currentState !== 'attack1') {
        this.setState('idle');
        MusicPlayer.pausePlayingSteps();
      }
    }

    if (this.currentState !== 'run' && this.inputController.isAttack1Pressed() && this.currentState !== 'attack1') {
      this.setState('attack1');
      MusicPlayer.pausePlayingSteps();
    }
  }

  private findCollisions(boxToFindCollisionsWith: Box = this.getBox()): Entity[] {
    const gameMap = this.getEntityManager().getEntityByName('map') as any as GameMap;
    const entities = gameMap
      .findEntities(boxToFindCollisionsWith.getCenter(), PlayerEntity.COLLISION_CHECK_DISTANCE_PX)
      .filter(entity => entity !== this);

    return entities.filter((entity) => {
      const box = entity.getBox();

      return boxToFindCollisionsWith.isCollide(box);
    });
  }
}
