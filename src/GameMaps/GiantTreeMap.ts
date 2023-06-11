import { GiantTree } from '../Buildings/GiantTree';
import { PlayerEntity } from '../Player/PlayerEntity';
import { FireEntity } from '../Buildings/FireEntity';
import { InputController } from '../InputController';
import { FollowPlayerCamera } from '../Camera/FollowPlayerCamera';
import { GameMap } from './GameMap';

export class GiantTreeMap extends GameMap {
  public initialize() {
    super.initialize();

    const entityManager = this.getEntityManager();

    const giantTree = new GiantTree(0, 0, 2.6);
    entityManager.addToScene(giantTree);
    entityManager.addEntity(giantTree);

    const player = new PlayerEntity(400, giantTree.getHeight__TODO_DELETE_IT() - 1800);
    entityManager.addToScene(player);

    const fire1 = new FireEntity(300, giantTree.getHeight__TODO_DELETE_IT() - 480, 150, 150);
    entityManager.addToScene(fire1);
    entityManager.addEntity(fire1);

    const fire2 = new FireEntity(800, giantTree.getHeight__TODO_DELETE_IT() - 230, 150, 150);
    entityManager.addToScene(fire2);
    entityManager.addEntity(fire2);

    player.emitter.subscribe('dead_and_modal_closed', () => {
      player.respawn();
    });

    const inputController = new InputController();
    player.addComponent(inputController);
    entityManager.addEntity(player, 'player');

    const camera = new FollowPlayerCamera(window.innerWidth, window.innerHeight, player, {
      minHeight: 0,
      minWidth: 0,
      maxWidth: giantTree.getWidth___TODO_DELETE_IT(),
      maxHeight: giantTree.getHeight__TODO_DELETE_IT(),
    });

    entityManager.addEntity(camera, 'camera');
    this.getScene().camera = camera;
  }
}
