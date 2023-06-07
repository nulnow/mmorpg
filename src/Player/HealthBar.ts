import { GameObject } from '../Rendering/GameObject';
import { Camera } from '../Camera/Camera';
import { IEntityWithHealth } from '../IEntityWithHealth';
import { IDrawableEntity } from '../Rendering/IDrawableEntity';

export class HealthBar extends GameObject {
  protected entityWithHealth: (IEntityWithHealth & IDrawableEntity);

  public constructor(entityWithHealth: (IEntityWithHealth & IDrawableEntity)) {
    super();
    this.entityWithHealth = entityWithHealth;
  }

  public draw(context: CanvasRenderingContext2D, camera: Camera) {
    const parentRelativeBox = camera.getRelativeCoordinates(this.entityWithHealth.getGameObject().getBox());
    const parentRelativeRect = parentRelativeBox.getRect();
    const health = this.entityWithHealth.getHealth()
    const percent = health.getPercent();
    const WIDTH = 100;
    const HEIGHT = 10;

    const processedHealth = Math.ceil(health.getValue());
    const toDraw = processedHealth === 0 ? '' : processedHealth;

    context.save();
    context.fillStyle = 'rgba(152,0,0,0.57)';
    context.fillRect(parentRelativeRect.left, parentRelativeRect.top, WIDTH * percent > WIDTH ? WIDTH : WIDTH * percent, HEIGHT)

    context.strokeStyle = processedHealth === 0 ? 'rgba(215,215,215,0.73)' : 'rgba(255,0,0,0.51)';
    context.beginPath();
    context.rect(parentRelativeRect.left, parentRelativeRect.top, WIDTH, HEIGHT);
    context.stroke();

    context.fillStyle = '#ffffff';
    context.font = "10px sans-serif";
    context.fillText(toDraw.toString(), parentRelativeRect.left, parentRelativeRect.top + 9);

    context.restore();
  }
}
