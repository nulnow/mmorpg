import { Camera } from '../Camera/Camera';
import { DrawableEntity } from '../Rendering/DrawableEntity';
import { PlayerEntity } from './PlayerEntity';
import { BaseEnemyEntity } from '../Enemies/BaseEnemy/BaseEnemyEntity';
import { fireBlueFilter, fireGreenFilter, firePurpleFilter, FireShieldEntity } from '../Buildings/FireShieldEntity';
import { TreeEntity } from '../Buildings/TreeEntity';
import { FireAttackEntity } from '../Buildings/FireAttackEntity';
import { FireEntity } from '../Buildings/FireEntity';

export class MiniMap {
  public constructor() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  private open = false;
  private onKeyDown = (event: KeyboardEvent): void => {
    if (event.code === 'KeyM') {
      this.open = !this.open;
    }
  };

  public destroy() {
    document.removeEventListener('keyup', this.onKeyDown);
  }

  public draw(context: CanvasRenderingContext2D, camera: Camera) {
    const entityManager = camera.getEntityManager();
    if (!entityManager) {
      return;
    }



    if (this.open) {
      this.drawOpen(context, camera);
    }

    this.drawMini(context, camera);
  }

  private drawMini(context: CanvasRenderingContext2D, camera: Camera): void {
    const entityManager = camera.getEntityManager();

    const WIDTH = 200;
    const HEIGHT = 200;
    const MAX_DISTANCE = 1000;
    const SCALE = 0.1;

    const X_OFFSET = window.innerWidth - WIDTH;
    const Y_OFFSET = 0;

    const OBJ_X_OFFSET = X_OFFSET + WIDTH / 2;
    const OBJ_Y_OFFSET = Y_OFFSET + HEIGHT / 2

    const RADIUS = 3;

    context.save();
    context.beginPath();
    context.strokeStyle = 'rgba(0,0,0,0.44)';
    context.rect(X_OFFSET, Y_OFFSET, WIDTH, HEIGHT);
    context.fillStyle = 'rgba(0,0,0,0.57)';
    // context.fillStyle = 'rgba(0,0,0,0)';
    context.fill();
    context.stroke();
    context.closePath();
    context.restore();

    const cameraCenter = camera.getBox().getCenter();
    const entities = entityManager.findEntities(cameraCenter, MAX_DISTANCE);

    context.lineWidth = 0.1;

    for (const entity of entities) {
      context.beginPath();
      const drawableEntity = entity as DrawableEntity;
      const drawableEntityCenter = drawableEntity.getGameObject().getBox().getCenter();

      if (drawableEntity instanceof PlayerEntity) {
        context.strokeStyle = 'rgba(0,81,255,0.52)';
        context.fillStyle = 'rgba(0,60,255,0.38)';
      } else if (drawableEntity instanceof BaseEnemyEntity) {
        context.strokeStyle = 'rgba(255,0,0,0.52)';
        context.fillStyle = 'rgba(255,0,0,0.38)';
      } else  if (entity instanceof FireEntity) {
        if ((entity instanceof FireShieldEntity) || (entity instanceof FireAttackEntity)) {
          if (entity.filter === firePurpleFilter) {
            context.strokeStyle = 'rgb(230,0,255)';
            context.fillStyle = 'rgb(123,0,255)';
          } else if (entity.filter === fireGreenFilter) {
            context.strokeStyle = 'rgb(0,255,81)';
            context.fillStyle = 'rgb(0,255,178)';
          } else if (entity.filter === fireBlueFilter) {
            context.strokeStyle = 'rgb(0,255,247)';
            context.fillStyle = 'rgb(0,102,255)';
          } else {
            context.strokeStyle = 'rgb(255,153,0)';
            context.fillStyle = 'rgb(255,68,0)';
          }
        } else {
          context.strokeStyle = 'rgb(255,153,0)';
          context.fillStyle = 'rgb(255,68,0)';
        }
      } else if (entity instanceof TreeEntity) {
        context.strokeStyle = 'rgba(154,63,0,0.52)';
        context.fillStyle = 'rgba(45,189,0,0.43)';
      } else {
        context.strokeStyle = 'rgba(255,255,255,0.52)';
        context.fillStyle = 'rgba(255,255,255,0.38)';
      }

      const vector = drawableEntityCenter.getVector(cameraCenter);
      vector.scale(SCALE);
      context.arc(OBJ_X_OFFSET + vector.x, OBJ_Y_OFFSET + vector.y, RADIUS, 2, Math.PI * 2);
      context.stroke();
      context.fill();
      context.closePath();
    }

    context.restore();
  }

  private drawOpen(context: CanvasRenderingContext2D, camera: Camera): void {
    const entityManager = camera.getEntityManager();

    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;
    const MAX_DISTANCE = 20000;
    const SCALE = 0.1;

    const X_OFFSET = window.innerWidth - WIDTH;
    const Y_OFFSET = 0;

    const OBJ_X_OFFSET = X_OFFSET + WIDTH / 2;
    const OBJ_Y_OFFSET = Y_OFFSET + HEIGHT / 2

    const RADIUS = 3;

    context.save();
    context.beginPath();
    context.strokeStyle = 'rgba(0,0,0,0.44)';
    context.rect(X_OFFSET, Y_OFFSET, WIDTH, HEIGHT);
    context.fillStyle = 'rgba(0,0,0,0.66)';
    // context.fillStyle = 'rgba(0,0,0,0)';
    context.fill();
    context.stroke();
    context.closePath();
    context.restore();

    const cameraCenter = camera.getBox().getCenter();
    const entities = entityManager.findEntities(cameraCenter, MAX_DISTANCE);

    context.lineWidth = 0.1;

    for (const entity of entities) {
      context.beginPath();
      const drawableEntity = entity as DrawableEntity;
      const drawableEntityCenter = drawableEntity.getGameObject().getBox().getCenter();

      if (drawableEntity instanceof PlayerEntity) {
        context.strokeStyle = 'rgba(0,81,255,0.52)';
        context.fillStyle = 'rgba(0,60,255,0.38)';
      } else if (drawableEntity instanceof BaseEnemyEntity) {
        context.strokeStyle = 'rgba(255,0,0,0.52)';
        context.fillStyle = 'rgba(255,0,0,0.38)';
      } else  if (entity instanceof FireEntity) {
        if ((entity instanceof FireShieldEntity) || (entity instanceof FireAttackEntity)) {
          if (entity.filter === firePurpleFilter) {
            context.strokeStyle = 'rgb(230,0,255)';
            context.fillStyle = 'rgb(123,0,255)';
          } else if (entity.filter === fireGreenFilter) {
            context.strokeStyle = 'rgb(0,255,81)';
            context.fillStyle = 'rgb(0,255,178)';
          } else if (entity.filter === fireBlueFilter) {
            context.strokeStyle = 'rgb(0,255,247)';
            context.fillStyle = 'rgb(0,102,255)';
          } else {
            context.strokeStyle = 'rgb(255,153,0)';
            context.fillStyle = 'rgb(255,68,0)';
          }
        } else {
          context.strokeStyle = 'rgb(255,153,0)';
          context.fillStyle = 'rgb(255,68,0)';
        }
      } else if (entity instanceof TreeEntity) {
        context.strokeStyle = 'rgba(154,63,0,0.52)';
        context.fillStyle = 'rgba(45,189,0,0.43)';
      } else {
        context.strokeStyle = 'rgba(255,255,255,0.52)';
        context.fillStyle = 'rgba(255,255,255,0.38)';
      }

      const vector = drawableEntityCenter.getVector(cameraCenter);
      vector.scale(SCALE);
      context.arc(OBJ_X_OFFSET + vector.x, OBJ_Y_OFFSET + vector.y, RADIUS, 2, Math.PI * 2);
      context.stroke();
      context.fill();
      context.closePath();
    }

    context.restore();
  }
}
