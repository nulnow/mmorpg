import { EventEmitter, UnsubscribeFn } from '../EventEmitter';

export class Animator {
  private emitter: EventEmitter = new EventEmitter();
  private sprites: HTMLImageElement[] = [];
  private speed: number = 0;

  private currentAnimationId = 0;
  private timeSpent = 0;

  public setSpeed(speed: number): void {
    this.speed = speed;
  }

  public setSprites(sprites: HTMLImageElement[]) {
    this.sprites = sprites;
  }

  public getCurrentSprite(): HTMLImageElement {
    const SPRITE_TIME_MS = (1000 / this.speed);

    if (this.timeSpent >= SPRITE_TIME_MS) {
      this.currentAnimationId++;

      this.currentAnimationId %= this.sprites.length;
      this.timeSpent = 0;
      this.emitter.emit('animation_end', null);
    }

    return this.sprites[this.currentAnimationId];
  }

  public onAnimationEndOnce(subscriber: () => void): UnsubscribeFn {
    return this.emitter.subscribe('animation_end', subscriber);
  }

  public update(timeElapsed: number): void {
    this.timeSpent += timeElapsed;
  }
}
