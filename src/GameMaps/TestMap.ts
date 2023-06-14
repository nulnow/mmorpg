import { GameMap } from './GameMap';
import { SkeletonEntity } from '../Enemies/Skeleton/SkeletonEntity';
import { FireEntity } from '../Buildings/FireEntity';
import { PlayerEntity } from '../Player/PlayerEntity';
import { Position } from '../Rendering/Position';
import { FollowPlayerCamera } from '../Camera/FollowPlayerCamera';
import { Game } from '../Game';

export class TestMap extends GameMap {
  public constructor(game: Game) {
    super(game.getCanvas());
  }

  public initialize() {
    super.initialize();

    const skeleton = new SkeletonEntity(400, 400);
    skeleton.getGameObject().setRotation(0);
    this.getEntityManager().addEntity(skeleton);
    this.getEntityManager().addToScene(skeleton);

    const fire = new FireEntity(100, 100, 160, 160);
    this.getEntityManager().addEntity(fire);
    this.getEntityManager().addToScene(fire);
  }

  public attachPlayer(player: PlayerEntity): void {
    player.getGameObject().getBox().setTopLeft(new Position());
    this.getEntityManager().addEntity(player, 'player');
    this.getEntityManager().addToScene(player);

    // const camera = new Camera(window.innerWidth, window.innerHeight);
    const camera = new FollowPlayerCamera(window.innerWidth, window.innerHeight, player);
    this.getEntityManager().addEntity(camera, 'camera');
    this.getScene().camera = camera;
  }

}
