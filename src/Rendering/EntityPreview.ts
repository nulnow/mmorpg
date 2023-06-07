import { SceneRenderer } from './SceneRenderer';
import { EntityManager } from '../EntityManager';
import { Camera } from '../Camera/Camera';
import { Scene } from '../types';
import { Entity } from '../Entity';

export class EntityPreview {
  private element: HTMLElement | null = null;
  private sceneRenderer: SceneRenderer | null = null;
  private destroyed = false;

  public constructor(
    private entity: Entity,
  ) {}

  public mount(id: string): void {
    const WIDTH = 100;
    const HEIGHT = 100;

    this.element = document.getElementById(id);

    const camera = new Camera(WIDTH, HEIGHT);

    const scene: Scene = {
      camera: camera,
      entities: [],
    };

    const entityManager = new EntityManager(scene);

    scene.entities.push(this.entity);
    entityManager.addEntity(this.entity);

    const sceneRenderer = new SceneRenderer(WIDTH, HEIGHT, scene, entityManager);

    sceneRenderer.start();
    this.element?.appendChild(sceneRenderer.getCanvas()!);

    this.sceneRenderer = sceneRenderer;
  }

  public destroy(): void {
    if (this.destroyed) {
      console.error('Calling destroy on already destroyed EntityPreview');
      return;
    }

    this.sceneRenderer!.stop();
    this.element!.removeChild(this.sceneRenderer!.getCanvas()!);

    this.destroyed = true;
  }
}
