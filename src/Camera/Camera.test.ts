import { describe, expect, it } from 'vitest'
import { Camera } from './Camera';
import { Position } from '../Rendering/Position';
import { PlayerEntity } from '../Player/PlayerEntity';
import { EnemyEntity } from '../Enemies/EnemyEntity';

// The two tests marked with concurrent will be run in parallel
describe('Camera', () => {
  it('getRelativePosition', async () => {
    const camera = new Camera(400, 300);
    camera.getBox().move(100, 100);
    const position = new Position(0, 0, 0);

    const relativePosition = camera.getRelativePosition(position);
    expect(relativePosition.x).toBe(-100);
    expect(relativePosition.y).toBe(-100);
  });

  it('getRelativeCoordinates', () => {
    const camera = new Camera(400, 300);

    const player = new PlayerEntity();
    const slime = new EnemyEntity();

    camera.getBox().setCenter(player.getGameObject().getBox().getCenter());
  });
})
