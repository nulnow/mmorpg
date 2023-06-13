import { EventEmitter, UnsubscribeFn } from '../EventEmitter';
import { GameObject } from './GameObject';
import { ResourceLoader } from '../ResourceLoader';
import { Sprite } from './Sprite';

export class Animator {
  private emitter: EventEmitter = new EventEmitter();
  private sprites: HTMLImageElement[] | Sprite = [];
  private speed: number = 0;
  private gameObject: GameObject;
  private currentAnimationId = 0;
  private timeSpent = 0;

  public setSpeed(speed: number): this {
    this.speed = speed;

    return this;
  }

  public setSprites(sprites: HTMLImageElement[] | Sprite): this {
    this.sprites = sprites;

    return this;
  }

  public warmCache(): this {
    if (this.sprites instanceof Sprite && this.gameObject) {
      const box = this.gameObject.getBox();
      const rect = box.getRect();

      for (let i = 0; i < this.sprites.getLength(); i++) {
        ResourceLoader.flipImage(this.sprites.getSpriteByIndex(i), rect, this.sprites);
      }
    }

    return this;
  }

  public getGameObject(): GameObject {
    return this.gameObject;
  }

  public setGameObject(gameObject: GameObject): this {
    this.gameObject = gameObject;

    return this;
  }

  public getCurrentSprite(): HTMLImageElement {
    const SPRITE_TIME_MS = (1000 / this.speed);

    let length: number = 0;
    if (this.sprites instanceof Sprite) {
      length = this.sprites.getLength();
    } else {
      length = this.sprites.length;
    }
    if (this.timeSpent >= SPRITE_TIME_MS) {
      this.currentAnimationId++;
      if (this.currentAnimationId === length) {
        this.emitter.emit('animation_end', null);
      }
      this.currentAnimationId %= length;
      this.timeSpent = 0;
    }
    // TODO Refactor
    if (!this.gameObject || this.gameObject.getIsRightToLeft()) {
      if (this.sprites instanceof Sprite) {
        if (this.gameObject && this.gameObject.getRotation().isLeft()) {
          const box = this.gameObject.getBox();
          const rect = box.getRect();

          // console.log('here1')
          return ResourceLoader.flipImage(this.sprites.getSpriteByIndex(this.currentAnimationId), rect);
        }

        // console.log('here2')
        return this.sprites.getSpriteByIndex(this.currentAnimationId);
      } else {
        if (this.gameObject && this.gameObject.getRotation().isLeft()) {
          const box = this.gameObject.getBox();
          const rect = box.getRect();

          // console.log('here3')
          return ResourceLoader.flipImage(this.sprites[this.currentAnimationId], rect);
        }

        // console.log('here4')
        return this.sprites[this.currentAnimationId];
      }
    } else {
      if (this.sprites instanceof Sprite) {

        if (this.gameObject && this.gameObject.getRotation().isRight()) {
          return this.sprites.getSpriteByIndex(this.currentAnimationId);
        }

        const box = this.gameObject.getBox();
        const rect = box.getRect();

        // console.log('here5')
        return ResourceLoader.flipImage(this.sprites.getSpriteByIndex(this.currentAnimationId), rect, this.sprites);
      } else {
        if (this.gameObject && this.gameObject.getRotation().isRight()) {
          const box = this.gameObject.getBox();
          const rect = box.getRect();

          // console.log('here7')
          return ResourceLoader.flipImage(this.sprites[this.currentAnimationId], rect);
        }

        // console.log('here8')
        return this.sprites[this.currentAnimationId];
      }
    }
  }

  public onAnimationEndOnce(subscriber: () => void): UnsubscribeFn {
    return this.emitter.subscribe('animation_end', () => {
      subscriber();
    });
  }

  public update(timeElapsed: number): void {
    this.timeSpent += timeElapsed;
  }
}
