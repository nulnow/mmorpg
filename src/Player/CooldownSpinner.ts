import { GameObject } from '../Rendering/GameObject';
import { Camera } from '../Camera/Camera';
import { PlayerEntity } from './PlayerEntity';

export class CooldownSpinner extends GameObject {
  protected player: PlayerEntity;

  public constructor(player: PlayerEntity) {
    super();
    this.player = player;
  }

  public draw(context: CanvasRenderingContext2D, camera: Camera) {
    // if (false) {
    //   const parentRelativeBox = camera.getRelativeCoordinates(this.entityWithHealth.getGameObject().getBox());
    //   const parentRelativeRect = parentRelativeBox.getRect();
    //   const health = this.entityWithHealth.getHealth()
    //   const percent = health.getPercent();
    //   const WIDTH = 100;
    //   const HEIGHT = 10;
    //
    //   const processedHealth = Math.ceil(health.getValue());
    //   const toDraw = processedHealth === 0 ? '' : processedHealth;
    //
    //   context.save();
    //   context.fillStyle = 'rgba(152,0,0,0.57)';
    //   context.fillRect(parentRelativeRect.left, parentRelativeRect.top, WIDTH * percent > WIDTH ? WIDTH : WIDTH * percent, HEIGHT)
    //
    //   context.strokeStyle = processedHealth === 0 ? 'rgba(215,215,215,0.73)' : 'rgba(255,0,0,0.51)';
    //   context.beginPath();
    //   context.rect(parentRelativeRect.left, parentRelativeRect.top, WIDTH, HEIGHT);
    //   context.stroke();
    //
    //   context.fillStyle = '#ffffff';
    //   context.font = "10px sans-serif";
    //   context.fillText(toDraw.toString(), parentRelativeRect.left, parentRelativeRect.top + 9);
    //
    //   context.restore();
    // }

    const parentTopLeft = this.player.getGameObject().getBox().getTopLeft();
    const relativePosition = camera.getRelativePosition(parentTopLeft);

    const percent = this.player.getTimeFromLastFireShieldActivation() / this.player.getFIRE_SHIELD_DELAY_MS();
    if (percent > 1) {
      return;
    }
    const endAngle = Math.PI * 2 * percent;

    context.save();
    context.beginPath();
    context.strokeStyle = 'rgba(255,255,255,0.69)';
    context.lineWidth = 2;
    const RADIUS = 3;
    context.arc(relativePosition.x - RADIUS * 4, relativePosition.y + RADIUS * 2, 5, 0, endAngle);
    context.stroke();
    context.restore();
  }
}
