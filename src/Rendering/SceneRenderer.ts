import { Scene } from '../types';
import { IDrawableEntity } from './IDrawableEntity';
import { EntityManager } from '../EntityManager';

export class SceneRenderer {
  private started: boolean = false;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;

  public constructor(
    private width: number,
    private height: number,
    private scene: Scene,
    private entityManager: EntityManager,
  ) {}

  public getCanvas() {
    return this.canvas;
  }

  public start() {
    if (this.started) {
      return;
    }
    this.started = true;

    if (!this.canvas) {
      this.canvas = this.createCanvas();
      this.context = this.canvas.getContext("2d");
    }

    this.run();
  }

  public stop() {
    this.started = false;
  }

  private prevDOMHighResTimeStamp = 0;
  private run() {
    if (!this.started) {
      return;
    }

    requestAnimationFrame((timestamp: number) => {
      const timeElapsed = timestamp - this.prevDOMHighResTimeStamp;
      this.prevDOMHighResTimeStamp = timestamp;
      this.context?.clearRect(0, 0, this.width, this.height);
      this.scene.entities.forEach(entity => {
        const drawableEntity = entity as any as IDrawableEntity;
        drawableEntity.getGameObject().draw(this.context!, this.scene.camera)
      });
      this.entityManager.update(timeElapsed);
      this.run();
    });
  }

  private createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.getContext('2d')!.imageSmoothingEnabled = false;
    return canvas;
  }
}
