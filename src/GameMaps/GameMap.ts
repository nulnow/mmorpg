import { Camera } from '../Camera/Camera';
import { EntityManager } from '../EntityManager';
import { Scene } from '../types';
import { UnsubscribeFn } from '../EventEmitter';
import { removeOneFromArray } from '../JSHACKS';
import { DrawableEntity } from '../Rendering/DrawableEntity';
import { PlayerEntity } from '../Player/PlayerEntity';

export type DrawMapHook = (context: CanvasRenderingContext2D, camera: Camera) => void;

export abstract class GameMap {
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  public getCanvas(): HTMLCanvasElement {
    return this.canvas!;
  }
  public setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
  }

  private entityManager: EntityManager | null = null;
  public getEntityManager(): EntityManager {
    return this.entityManager!;
  }
  public setEntityManager(entityManager: EntityManager): void {
    this.entityManager = entityManager;
  }

  protected scene: Scene | null = null;
  public getScene(): Scene {
    return this.scene!;
  }
  public setScene(scene: Scene): void {
    this.scene = scene;
  }

  public initialize(): void {
    const scene: Scene = {
      // TODO
      camera: new Camera(window.innerWidth, window.innerHeight),
      entities: [],
    };
    this.setScene(scene);
    const entityManager = new EntityManager(scene);
    this.setEntityManager(entityManager);
  }

  private fps = 0;
  private drawHooks = {
    before: [] as DrawMapHook[],
    beforeEntities: [] as DrawMapHook[],
    afterEntities: [] as DrawMapHook[],
    after: [] as DrawMapHook[],
  };
  public addHook(key: 'before' | 'beforeEntities' | 'afterEntities' | 'after', hook: DrawMapHook): UnsubscribeFn {
    this.drawHooks[key].push(hook);

    return () => {
      this.removeHook(key, hook);
    };
  }
  public removeHook(key: 'before' | 'beforeEntities' | 'afterEntities' | 'after', hook: DrawMapHook): void {
    removeOneFromArray(this.drawHooks[key], (h) => h === hook);
  }

  public draw(timeElapsed: number, timeElapsedReal: number): void {
    const context = this.context!;
    const camera = this.scene!.camera;

    for (const hook of this.drawHooks.before) {
      hook(context, camera);
    }

    context.imageSmoothingEnabled = false;
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.beginPath();
    context.rect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = '#3f4941';
    context.fill();

    context.filter = camera.getFilter();

    for (const hook of this.drawHooks.beforeEntities) {
      hook(context, camera);
    }

    for (let j = 0; j < this.scene!.entities.length; j++) {
      const entity = this.scene!.entities[j];
      if (this.scene!.camera.isVisibleDrawableEntity(entity as any)) {
        if ((entity as DrawableEntity).getGameObject) {
          (entity as DrawableEntity).getGameObject().draw(context, camera);
        }
      }
    }

    for (const hook of this.drawHooks.afterEntities) {
      hook(context, camera);
    }

    if (this.i % 20 === 0) {
      this.fps = Math.round(1000 / timeElapsedReal);
    }

    context.save();
    context.fillStyle = '#ffffff';
    context.font = "15px monospace";
    context.fillText(`FPS: ${this.fps}`, 10, 30);
    context.fillText('Attack: E, Q, X. Move: WASD', 10, 50);

    const player = this.entityManager!.getEntityByName('player');
    if (player) {
      const playerTopLeft = (player as PlayerEntity).getGameObject().getBox().getTopLeft();
      context.font = "10px monospace";
      context.fillText(`x:${Math.floor(playerTopLeft.x)} y:${Math.floor(playerTopLeft.y)}`, 10, 70);
    }


    context.restore();
    if (this.drawHooks.after.length) {
      for (const hook of this.drawHooks.after) {
        hook(context, camera);
      }
    }
  }

  private i = 0;
  public tick(timeElapsed: number): void {
    this.i++;
    this.entityManager!.update(timeElapsed);
  }

  public destroy(): void {}
}
