import { Position } from '../Rendering/Position';
import { ResourceLoader } from '../ResourceLoader';
import { UIEntity } from '../UI/UIEntity';
import { TreeEntity } from '../Buildings/TreeEntity';
import { MapWall } from '../Buildings/MapWall';
import { BedEntity } from '../Buildings/BedEntity';
import { PlayerEntity } from '../Player/PlayerEntity';
import { FollowPlayerCamera } from '../Camera/FollowPlayerCamera';
import { SlimeEntity } from '../Enemies/Slime/SlimeEntity';
import { GuardEntity } from '../Enemies/Guard/GuardEntity';
import { DeathEntity } from '../Buildings/DeathEntity';
import { QuestEntity } from '../Quests/QuestEntity';
import { DeathQuestEntity } from '../Quests/DeathQuest/DeathQuestEntity';
import { GameMap } from './GameMap';
import { TeleportEntity } from '../TeleportEntity';
import { StairsLocation } from '../Locations/StairsLocation';
import { Game } from '../Game';
import { UnsubscribeFn } from '../EventEmitter';
import { HOME_MAP_NAMED_LOCATIONS, HOME_MAP_TREES_POSITIONS } from './HomeMapCONSTANTS';
import { Box } from '../Rendering/Box';
import { SkeletonEntity } from '../Enemies/Skeleton/SkeletonEntity';

export class HomeMap extends GameMap {
  public constructor(private game: Game) {
    super(game.getCanvas());
  }

  private flowersMap = (() => {
    const flowers: {i: number, j: number}[] = [];
    for (let i = -1000; i < 1000 * 2; i++) {
      for (let j = -1000; j < 1000*2; j++) {
        if (Math.random() < 0.000025) {
          flowers.push({
            i, j
          });
        }
      }
    }

    return flowers;
  })();

  public initialize(): void {
    super.initialize();

    this.addHook('beforeEntities', (context: CanvasRenderingContext2D, camera) => {
      for (const {i: x, j: y} of this.flowersMap) {
        const relativePosition = camera.getRelativePosition(new Position(x, y, 0));
        context!.drawImage(
          ResourceLoader.getLoadedAssets().flower,
          relativePosition.x,
          relativePosition.y,
          20, 20
        );
      }
    });

    const entityManager = this.getEntityManager();

    // const uiEntity = new UIEntity();
    // entityManager.addEntity(uiEntity, 'ui');

    { // TREES
      const TREE_TYPE = 7;
      let tree = new TreeEntity(-40, -300, TREE_TYPE, Math.random() > 0.5, 2);
      entityManager.addEntity(tree, 'tree');
      entityManager.addToScene(tree);

      tree = new TreeEntity(-210, 80, TREE_TYPE, Math.random() > 0.5, 2);
      entityManager.addEntity(tree, 'tree');
      entityManager.addToScene(tree);

      tree = new TreeEntity(-200, -180, TREE_TYPE, Math.random() > 0.5, 2);
      entityManager.addEntity(tree, 'tree');
      entityManager.addToScene(tree);

      tree = new TreeEntity(-200, -180, TREE_TYPE, Math.random() > 0.5, 2);
      entityManager.addEntity(tree, 'tree');
      entityManager.addToScene(tree);

      tree = new TreeEntity(300, -380, TREE_TYPE, Math.random() > 0.5, 2);
      entityManager.addEntity(tree, 'tree');
      entityManager.addToScene(tree);

      tree = new TreeEntity(600, -340, TREE_TYPE, Math.random() > 0.5, 2);
      entityManager.addEntity(tree, 'tree');
      entityManager.addToScene(tree);
    }

    const mapWall = new MapWall(800, 600);
    entityManager.addEntity(mapWall, 'mapWall');
    entityManager.addToScene(mapWall);

    const bed = new BedEntity();
    entityManager.addEntity(bed, 'bed');
    entityManager.addToScene(bed);

    const stairsLocation = new StairsLocation(4000, 0);
    entityManager.addToScene(stairsLocation);
    entityManager.addEntity(stairsLocation);

    const teleportTopToBottom = new TeleportEntity(
      stairsLocation.getTopStairsTeleportBox().copy(),
      stairsLocation.getBottomStairsTeleportBox().copy().move(200, -200),
    );
    entityManager.addEntity(teleportTopToBottom);
    entityManager.addToScene(teleportTopToBottom);

    // const teleportBottomToTop = new TeleportEntity(
    //   stairsLocation.getBottomStairsTeleportBox().copy(),
    //   stairsLocation.getTopStairsTeleportBox().copy().move(200, 300),
    // );
    // entityManager.addEntity(teleportBottomToTop);
    // entityManager.addToScene(teleportBottomToTop);

    // const player = new PlayerEntity(
    //   stairsLocation.getGameObject().getBox().getCenter().x,
    //   stairsLocation.getGameObject().getBox().getCenter().y
    // );

    // for (let j = 0; j < 3; j++) {
    //   const slime = new SlimeEntity(12000 - 100 + Math.random() * 300, 1250 - 100 + Math.random() * 300);
    //   entityManager.addEntity(slime);
    //   entityManager.addToScene(slime);
    // }

    for (const treesPosition of HOME_MAP_TREES_POSITIONS) {
      const tree = new TreeEntity(treesPosition.x, treesPosition.y, 0, true, 2);
      entityManager.addEntity(tree);
      entityManager.addToScene(tree);
    }

    for (let j = 0; j < 1; j++) {
      const slime = new SkeletonEntity(200 * Math.random() + 200, 200 * Math.random() + 200);
      entityManager.addEntity(slime);
      entityManager.addToScene(slime);
    }

    for (let j = 0; j < 3; j++) {
      const guard = new GuardEntity(200 * Math.random() + 600, 200 * Math.random() + 600);
      entityManager.addEntity(guard);
      entityManager.addToScene(guard);
    }

    const death = new DeathEntity(800, 200);

    entityManager.addEntity(death, 'death');
    entityManager.addToScene(death);

    const questEntity = new QuestEntity();
    entityManager.addEntity(questEntity, 'quests');

    const deathQuest = new DeathQuestEntity();
    entityManager.addEntity(deathQuest, 'deathQuest');
  }

  private unsubscribeFromPlayerMoveFn: UnsubscribeFn | null = null;
  public attachPlayer(player: PlayerEntity, namedLocation?: keyof typeof HOME_MAP_NAMED_LOCATIONS): this {
    const entityManager = this.getEntityManager();

    let topLeft: Position;
    if (namedLocation) {
      topLeft = Box.fromMarkupRect(HOME_MAP_NAMED_LOCATIONS[namedLocation]).getTopLeft();
    }
    else {
      topLeft = Box.fromMarkupRect(HOME_MAP_NAMED_LOCATIONS.home).getTopLeft();
    }

    player.getGameObject().getBox().setTopLeft(topLeft);


    // const inputController = new InputController();
    // player.addComponent(inputController);

    entityManager.addEntity(player, 'player');
    player.emitter.subscribe('dead_and_modal_closed', () => {
      player.respawn();
    });

    const camera = new FollowPlayerCamera(window.innerWidth, window.innerHeight, player);
    entityManager.addEntity(camera, 'camera');
    this.getScene().camera = camera;

    entityManager.addToScene(player);

    this.unsubscribeFromPlayerMoveFn = this.getEntityManager().emitter.subscribe('player_move', (player: PlayerEntity) => {
      if (player.getGameObject().getBox().getTopLeft().y < -3000) {
        this.game.setGiantTreeMap();
      }
    });

    return this;
  }

  public removePlayer(): this {
    if (this.unsubscribeFromPlayerMoveFn) {
      this.unsubscribeFromPlayerMoveFn();
    }

    super.removePlayer();

    return this;
  }
}
