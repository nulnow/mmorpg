import { Position } from '../Rendering/Position';
import { ResourceLoader } from '../ResourceLoader';
import { UIEntity } from '../UI/UIEntity';
import { Entity } from '../Entity';
import { NetworkController } from '../NetworkController';
import { Stairs } from '../Buildings/Stairs';
import { TreeEntity } from '../Buildings/TreeEntity';
import { MapWall } from '../Buildings/MapWall';
import { BedEntity } from '../Buildings/BedEntity';
import { PlayerEntity } from '../Player/PlayerEntity';
import { InputController } from '../InputController';
import { FollowPlayerCamera } from '../Camera/FollowPlayerCamera';
import { SlimeEntity } from '../Enemies/Slime/SlimeEntity';
import { GuardEntity } from '../Enemies/Guard/GuardEntity';
import { DeathEntity } from '../Buildings/DeathEntity';
import { QuestEntity } from '../Quests/QuestEntity';
import { DeathQuestEntity } from '../Quests/DeathQuest/DeathQuestEntity';
import { GameMap } from './GameMap';

export class HomeMap extends GameMap {
  public constructor() {
    super();
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

    const uiEntity = new UIEntity();
    entityManager.addEntity(uiEntity, 'ui');

    const networkEntity = new Entity();
    const networkController = new NetworkController();
    networkEntity.addComponent(networkController);
    entityManager.addEntity(networkEntity, 'network');

    const stairs = new Stairs(11000, 0, 1.5);
    entityManager.addToScene(stairs);
    entityManager.addEntity(stairs);

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

    const player = new PlayerEntity(12000 - 200, 1250);
    player.emitter.subscribe('dead_and_modal_closed', () => {
      player.respawn();
    });

    for (let j = 0; j < 3; j++) {
      const slime = new SlimeEntity(12000 - 100 + Math.random() * 300, 1250 - 100 + Math.random() * 300);
      entityManager.addEntity(slime);
      entityManager.addToScene(slime);
    }

    const inputController = new InputController();
    player.addComponent(inputController);
    entityManager.addEntity(player, 'player');

    const camera = new FollowPlayerCamera(window.innerWidth, window.innerHeight, player);
    entityManager.addEntity(camera, 'camera');
    this.getScene().camera = camera;

    // const fieldEntity = new Entity();

    // for (let i = 0; i < 1; i++) {
    //   for (let j = -1000; j < 1000; j++) {
    //     if (j % 50 !== 0) continue;
    //     // TOP
    //     const fire1 = new FireEntity(j, -1000 - ((i + 1) * 30), 150, 150);
    //     // fire1.getGameObject().setIsCollidable(true);
    //     this.entityManager.addEntity(fire1);
    //     this.scene.entities.push(fire1);
    //
    //     // BOTTOM
    //     const fire2 = new FireEntity(j, 1000  + ((i + 1) * 30), 150, 150);
    //     // fire2.getGameObject().setIsCollidable(true);
    //     this.entityManager.addEntity(fire2);
    //     this.scene.entities.push(fire2);
    //
    //     // LEFT
    //     const fire3 = new FireEntity(-1000  - ((i + 1) * 30), j, 150, 150);
    //     // fire3.getGameObject().setIsCollidable(true);
    //     this.entityManager.addEntity(fire3);
    //     this.scene.entities.push(fire3);
    //
    //     // RIGHT
    //     const fire4 = new FireEntity(1000 + ((i + 1) * 30), j, 150, 150);
    //     // fire4.getGameObject().setIsCollidable(true);
    //     this.entityManager.addEntity(fire4);
    //     this.scene.entities.push(fire4);
    //   }
    // }

    const getRandomDiff = () => (0.5 - Math.random()) * 500;

    for (let i = 0; i < 10; i++) {
      for (let j = -2000; j < 2000; j++) {
        if (j % 500 !== 0) continue;
        const MULT = 200;
        // TOP
        const tree1 = new TreeEntity(j + getRandomDiff(), -1000 - ((i + 1) * MULT) + getRandomDiff(), 0, true, 2);
        // fire1.getGameObject().setIsCollidable(true);
        entityManager.addEntity(tree1);
        entityManager.addToScene(tree1);

        // BOTTOM
        const tree2 = new TreeEntity(j + getRandomDiff(), 1000  + ((i + 1) * MULT) + getRandomDiff(), 0, true, 2);
        // fire2.getGameObject().setIsCollidable(true);
        entityManager.addEntity(tree2);
        entityManager.addToScene(tree2);

        if (j > -1000 && j < 1000) {
          // LEFT
          const tree3 = new TreeEntity(-1000  - ((i + 1) * MULT) + getRandomDiff(), j + getRandomDiff(), 0, true, 2);
          // fire3.getGameObject().setIsCollidable(true);
          entityManager.addEntity(tree3);
          entityManager.addToScene(tree3);

          // RIGHT
          const tree4 = new TreeEntity(1000 + ((i + 1) * MULT) + getRandomDiff(), j + getRandomDiff(), 0, true, 2);
          // fire4.getGameObject().setIsCollidable(true);
          entityManager.addEntity(tree4);
          entityManager.addToScene(tree4);
        }
      }
    }

    for (let j = 0; j < 3; j++) {
      const slime = new SlimeEntity(200 * Math.random() + 200, 200 * Math.random() + 200);
      entityManager.addEntity(slime);
      entityManager.addToScene(slime);
    }

    for (let j = 0; j < 3; j++) {
      const guard = new GuardEntity(200 * Math.random() + 600, 200 * Math.random() + 600);
      entityManager.addEntity(guard);
      entityManager.addToScene(guard);
    }

    entityManager.addToScene(player);

    const death = new DeathEntity(800, 200);

    entityManager.addEntity(death, 'death');
    entityManager.addToScene(death);

    const questEntity = new QuestEntity();
    entityManager.addEntity(questEntity, 'quests');

    const deathQuest = new DeathQuestEntity();
    entityManager.addEntity(deathQuest, 'deathQuest');
  }
}
