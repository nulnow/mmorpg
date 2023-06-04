import { Entity } from './Entity';
import { NetworkController } from './NetworkController';
import { UIController } from './UI/UIController';
import { EntityManager } from './EntityManager';
import { PlayerEntity } from './Player/PlayerEntity';
import { InputController } from './InputController';
import { GameMap } from './GameMap';
import { Scene } from './types';
import { ResourceLoader } from './ResourceLoader';
import { MusicPlayer } from './MusicPlayer';
import { MapWall } from './Buildings/MapWall';
import { FollowPlayerCamera } from './Camera/FollowPlayerCamera';
import { Position } from './Rendering/Position';
import { BedEntity } from './Buildings/BedEntity';
import { SlimeEntity } from './Enemies/slime/SlimeEntity';
import { QuestEntity } from './Quests/QuestEntity';
import { UIEntity } from './UI/UIEntity';
import { GuardEntity } from './Enemies/Guard/GuardEntity';

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

const timeSpeedInput = document.getElementById('timeSpeedInput') as HTMLInputElement;
let timeSpeed = 1;
function setTimeSpeed(ts: number) {
  document.getElementById('timeSpeedValue')!.innerText = ts.toString();
  timeSpeed = ts;
  timeSpeedInput.value = ts.toString();
}

timeSpeedInput!.oninput = (event: any) => {
  setTimeSpeed(parseFloat(event.target.value));

};
timeSpeedInput.value = timeSpeed.toString();
document.getElementById('resetTimeButton')!.onclick = () => {
  setTimeSpeed(1);
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const speedInput = document.getElementById('speedInput') as HTMLInputElement;
const attackSpeedInput = document.getElementById('attackSpeedInput') as HTMLInputElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// const context = canvas.getContext("2d");

const debug = document.getElementById("debug");
let debugMODE = true;

// export function main() {
//   const entityManager = new EntityManager();
//
//   const uiEntity = new Entity();
//   const uiController = new UIController();
//   uiEntity.addComponent(uiController);
//   entityManager.addEntity(uiEntity, 'ui');
//
//   const networkEntity = new Entity();
//   const networkController = new NetworkController();
//   networkEntity.addComponent(networkController);
//   entityManager.addEntity(networkEntity, 'network');
// }

class Game {
  private isSetUp = false;
  public getIsSetUp(): boolean {
    return this.isSetUp;
  }
  private scene!: Scene;
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly requestAnimationFrame: typeof window.requestAnimationFrame;
  private readonly cancelAnimationFrame: typeof window.cancelAnimationFrame;

  private entityManager!: EntityManager;

  private interval: number = -1;

  constructor(
    canvas: HTMLCanvasElement,
    requestAnimationFrame: typeof window.requestAnimationFrame,
    cancelAnimationFrame: typeof window.cancelAnimationFrame,
  ) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d")!;
    this.requestAnimationFrame = requestAnimationFrame;
    this.cancelAnimationFrame = cancelAnimationFrame;
  }

  private flowersMap = (() => {
    const flowers: {i: number, j: number}[] = [];
    for (let i = -canvasWidth; i < canvasWidth * 2; i++) {
      for (let j = -canvasHeight; j < canvasHeight*2; j++) {
        if (Math.random() < 0.000025) {
          flowers.push({
            i, j
          });
        }
      }
    }

    return flowers;
  })();

  private tick(timeElapsed: number): void {
    this.entityManager.update(timeElapsed);
  }

  private draw(timeElapsed: number, timeElapsedReal: number): void {
    this.context.imageSmoothingEnabled = false;
    this.context.clearRect(0, 0, canvasWidth, canvasHeight);
    this.context.beginPath();
    this.context.rect(0, 0, canvasWidth, canvasHeight);
    this.context.fillStyle = '#3f4941';
    this.context.fill();

    const camera = this.scene.camera;
    this.context.filter = camera.getFilter();

    this.flowersMap.forEach(({i: x, j: y}) => {
      const relativePosition = camera.getRelativePosition(new Position(x, y, 0));
      this.context.drawImage(
        ResourceLoader.getLoadedAssets().flower,
        relativePosition.x,
        relativePosition.y,
        20, 20
      );
    });

    // const allEntities = this.scene.entities;
    // allEntities.forEach((entity) => {
    //   entity.update(timeElapsed);
    // });

    const visibleEntity = this.scene.entities.filter(entity => {
      return camera.isVisibleDrawableEntity(entity as any);
    });

    visibleEntity.forEach(entity => {
      // if (!camera.isVisible(entity)) {
      //   return;
      // }


      // const relationalEntityCoordinates = camera.getBox().calculateRelationRect(entity.getBox());
      // console.log(camera);
      // console.log(relationalEntityCoordinates);

      if (entity.getGameObject) {
        // const relationalEntityCoordinates = entity.getGameObject().getBox().getRect();

        entity.getGameObject().draw(this.context, camera);
        // if (player.getCurrentState() === 'attack1') {
        //   const center = box.getCenter();
        //   this.context.save();
        //   this.context.strokeStyle = 'rgba(255,0,0,0.32)';
        //   this.context.beginPath();
        //   this.context.arc(
        //     center.x,
        //     center.y,
        //     100,
        //     0,
        //     2 * Math.PI,
        //   );
        //   this.context.stroke();
        //   this.context.restore();
        // }

        // const player = entity as PlayerEntity;
        // const gameObject = player.getGameObject();
        //
        // const currentSprite = gameObject.getCurrentSprite();

        // const sprite = player.get.getCurrentSprite();


        // this.context.fillStyle = entity.COLOR;
        // this.context.strokeStyle =  entity.COLOR;
        // this.context.beginPath();
        // this.context.rect(
        //   relationalEntityCoordinates.left,
        //   relationalEntityCoordinates.top,
        //   relationalEntityCoordinates.width,
        //   relationalEntityCoordinates.height,
        // );
        // this.context.stroke();
      } else {
        // this.context.lineWidth = 1;
        // this.context.fillStyle = entity.COLOR;
        // this.context.strokeStyle =  '#000';
        // this.context.beginPath();
        // this.context.rect(
        //   relationalEntityCoordinates.left,
        //   relationalEntityCoordinates.top,
        //   relationalEntityCoordinates.width,
        //   relationalEntityCoordinates.height,
        // );
        // this.context.fill();
      }
    });

    if (this.i % 20 === 0) {
      this.fps = Math.round(1000 / timeElapsedReal);
    }

    this.context.save();
    this.context.fillStyle = '#ffffff';
    this.context.font = "25px sans-serif";
    this.context.fillText(`FPS: ${this.fps}`, 10, 30);
    this.context.fillText('Attack: E, Move: WASD', 10, 70);

    this.context.restore();
  }

  private i = 0;
  private fps = 0;
  private prevDOMHighResTimeStamp = 0;
  public run(): void {
    if (!MusicPlayer.getIsPlaying()) {
      MusicPlayer.playMainTheme();
    }
    this.i++;
    if (this.i === 1000) {
      this.i = 0;
    }

    this.interval = this.requestAnimationFrame((timeStamp) => {
      const timeElapsedReal = timeStamp - this.prevDOMHighResTimeStamp
      const timeElapsed = timeElapsedReal * timeSpeed;
      this.prevDOMHighResTimeStamp = timeStamp;
      this.draw(timeElapsed, timeElapsedReal);
      this.tick(timeElapsed, timeElapsedReal);

      // if (debugMODE && debug && (this.i % 10 === 0)) {
      //   debug.innerText = 'FPS: ' + String(Math.round(1000 / timeElapsedReal));
      // }

      this.run();
    });
  }

  public stop(): void {
    this.cancelAnimationFrame(this.interval);
  }

  public async setUp() {
    if (this.isSetUp) {
      console.error('Game is already set up!');
      return;
    }
    this.scene = {
      camera: null as any,
      entities: [],
    };
    this.entityManager = new EntityManager(this.scene);
    await ResourceLoader.loadGameAssets();

    const uiEntity = new UIEntity();
    const uiController = new UIController();
    uiEntity.addComponent(uiController);
    this.entityManager.addEntity(uiEntity, 'ui');

    const networkEntity = new Entity();
    const networkController = new NetworkController();
    networkEntity.addComponent(networkController);
    this.entityManager.addEntity(networkEntity, 'network');

    const map = new GameMap(this.scene);
    this.entityManager.addEntity(map, 'map');

    const mapWall = new MapWall(800, 600);
    this.entityManager.addEntity(mapWall, 'mapWall');
    this.scene.entities.push(mapWall);

    const bed = new BedEntity();
    this.entityManager.addEntity(bed, 'bed');
    this.scene.entities.push(bed);

    const questEntity = new QuestEntity();
    this.entityManager.addEntity(questEntity, 'quests');

    const player = new PlayerEntity();
    speedInput.value = player.getSpeed() + '';
    attackSpeedInput.value = player.getAttackSpeed() + '';

    speedInput!.oninput = (event: any) => {
      player.emitter.emit('speed_change', event.target.value)
    };
    attackSpeedInput!.oninput = (event: any) => {
      player.emitter.emit('attack_speed_change', event.target.value)
    };

    const inputController = new InputController();
    player.addComponent(inputController);
    this.entityManager.addEntity(player, 'player');

    const camera = new FollowPlayerCamera(canvasWidth, canvasHeight, player);
    this.entityManager.addEntity(camera, 'camera');
    this.scene.camera = camera;

    // const fieldEntity = new Entity();

    for (let j = 0; j < 3; j++) {
      const slime = new SlimeEntity(200 * Math.random() + 200, 200 * Math.random() + 200);
      this.entityManager.addEntity(slime);
      this.scene.entities.push(slime);
    }

    for (let j = 0; j < 3; j++) {
      const guard = new GuardEntity(200 * Math.random() + 600, 200 * Math.random() + 600);
      this.entityManager.addEntity(guard);
      this.scene.entities.push(guard);
    }

    this.scene.entities.push(player);

    // for (let j = 0; j < 5; j++) {
    //   if (j === 3 || j === 4) continue;
    //   const enemyEntity = new Entity();
    //   enemyEntity.getBox().move(150, 50 * (j + 1));
    //   this.scene.entities.push(enemyEntity);
    // }

    // for (let j = 0; j < 5; j++) {
    //   if (j === 3 || j === 4) {
    //     continue;
    //   }
    //   const enemyEntity = new Entity();
    //   enemyEntity.getBox().move(450, 50 * (j + 1));
    //   this.scene.entities.push(enemyEntity);
    // }

    // for (let j = 0; j < 10; j++) {
    //   const enemyEntity = new Entity();
    //   enemyEntity.getBox().move(50 * (j), 300);
    //   this.scene.entities.push(enemyEntity);
    // }

    // for (let j = 0; j < 10; j++) {
    //   const enemyEntity = new Entity();
    //   enemyEntity.getBox().move(50 * (j), 450);
    //   this.scene.entities.push(enemyEntity);
    // }

    this.isSetUp = true;
  }
}

const game = new Game(
  canvas,
  window.requestAnimationFrame.bind(window),
  window.cancelAnimationFrame.bind(window),
);

const state = document.getElementById('state')!;
const startButton = document.getElementById('start')!;
const stopButton = document.getElementById('stop')!;

state.innerText = 'started';
startButton.onclick = async function () {
  state.innerText = 'started';
  state.style.color = '#22ff00';
  if (!game.getIsSetUp()) {
    await game.setUp();
  }
  game.run();
  document.getElementById('start-stop-buttons')!.style.top = '0px';
  document.getElementById('start-stop-buttons')!.style.right = '0px';
  startButton.classList.add('none');
  stopButton.classList.remove('none');
}
stopButton.onclick = function () {
  state.innerText = 'stopped';
  state.style.color = '#ff0000';
  debug!.innerText = '';
  MusicPlayer.pause();
  game.stop();
  startButton.classList.remove('none');
  stopButton.classList.add('none');
}
state.innerText = 'stopped';
state.style.color = '#ff0000';
