import { GiantTree } from '../Buildings/GiantTree';
import { PlayerEntity } from '../Player/PlayerEntity';
import { FireEntity } from '../Buildings/FireEntity';
import { InputController } from '../InputController';
import { FollowPlayerCamera } from '../Camera/FollowPlayerCamera';
import { GameMap } from './GameMap';
import { Position } from '../Rendering/Position';
import { Game } from '../Game';
import { UnsubscribeFn } from '../EventEmitter';

export class GiantTreeMap extends GameMap {
  private giantTree!: GiantTree;

  public constructor(private game: Game) {
    super(game.getCanvas());
  }

  public initialize() {
    super.initialize();
    const entityManager = this.getEntityManager();

    const giantTree = new GiantTree(0, 0, 2.6);
    this.giantTree = giantTree;
    entityManager.addToScene(giantTree);
    entityManager.addEntity(giantTree);

    const fire1 = new FireEntity(300, giantTree.getHeight__TODO_DELETE_IT() - 480, 150, 150);
    entityManager.addToScene(fire1);
    entityManager.addEntity(fire1);

    const fire2 = new FireEntity(800, giantTree.getHeight__TODO_DELETE_IT() - 230, 150, 150);
    entityManager.addToScene(fire2);
    entityManager.addEntity(fire2);
  }

  private unsubscribeFromPlayerMoveFn: UnsubscribeFn | null = null;
  public attachPlayer(player: PlayerEntity): this {
    const entityManager = this.getEntityManager();
    const giantTree = this.giantTree;

    player.getGameObject().getBox().setTopLeft(new Position(400, giantTree.getHeight__TODO_DELETE_IT() - 1800, 0));
    entityManager.addEntity(player, 'player');
    entityManager.addToScene(player);

    // player.emitter.subscribe('dead_and_modal_closed', () => {
    //   player.respawn();
    // });

    // const inputController = new InputController();
    // player.addComponent(inputController);
    // entityManager.addEntity(player, 'player');

    const camera = new FollowPlayerCamera(window.innerWidth, window.innerHeight, player, {
      minHeight: 0,
      minWidth: 0,
      maxWidth: giantTree.getWidth___TODO_DELETE_IT(),
      maxHeight: giantTree.getHeight__TODO_DELETE_IT(),
    });
    entityManager.addEntity(camera, 'camera');
    this.getScene().camera = camera;

    this.unsubscribeFromPlayerMoveFn = entityManager.emitter.subscribe('player_move', (player: PlayerEntity) => {
      if (player.getGameObject().getBox().isCollide(this.giantTree.getLeftBottomExit())) {
        this.game.setHomeMap('top');
      }
    });

    return this;
  }

  public removePlayer(): this {
    if (this.unsubscribeFromPlayerMoveFn) {
      this.unsubscribeFromPlayerMoveFn();
    }
    return super.removePlayer();
  }
}
