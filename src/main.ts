import { Entity } from './Entity';
import { NetworkController } from './NetworkController';
import { UIController } from './UIController';
import { EntityManager } from './EntityManager';
import { PlayerEntity } from './Player/PlayerEntity';
import { InputController } from './InputController';
import { Camera } from './Camera';
import { GameMap } from './GameMap';
import { Scene } from './types';
import { ResourceLoader } from './ResourceLoader';
import { MusicPlayer } from './MusicPlayer';

const canvasWidth = 800;
const canvasHeight = 600;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const speedInput = document.getElementById('speedInput') as HTMLInputElement;
const attackSpeedInput = document.getElementById('attackSpeedInput') as HTMLInputElement;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
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

  private readonly entityManager: EntityManager = new EntityManager();

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
    for (let i = 0; i < canvasWidth; i++) {
      for (let j = 0; j < canvasHeight; j++) {
        if (Math.random() < 0.00005) {
          flowers.push({
            i, j
          });
        }
      }
    }

    return flowers;
  })();

  private draw(timeElapsed: number): void {
    this.context.imageSmoothingEnabled = false;
    this.context.clearRect(0, 0, canvasWidth, canvasHeight);
    this.context.beginPath();
    this.context.rect(0, 0, canvasWidth, canvasHeight);
    this.context.fillStyle = '#3f4941';
    this.context.fill();

    this.flowersMap.forEach(({i, j}) => {
      this.context.drawImage(
        ResourceLoader.getLoadedAssets().flower,
        i,
        j,
        20, 20
      )
    });

    // const camera = this.scene.camera;
    const entities = this.scene.entities;

    entities.forEach(entity => {
      // if (!camera.isVisible(entity)) {
      //   return;
      // }


      // const relationalEntityCoordinates = camera.getBox().calculateRelationRect(entity.getBox());
      // console.log(camera);
      // console.log(relationalEntityCoordinates);

      const box = entity.getBox();
      const relationalEntityCoordinates = box.getRect();

      if (entity instanceof PlayerEntity) {
        const player = entity as PlayerEntity;
        if (player.getCurrentState() === 'attack1') {
          const center = box.getCenter();
          this.context.save();
          this.context.strokeStyle = 'rgba(255,0,0,0.32)';
          this.context.beginPath();
          this.context.arc(
            center.x,
            center.y,
            100,
            0,
            2 * Math.PI,
          );
          this.context.stroke();
          this.context.restore();
        }
        const sprite = player.getCurrentSprite();
        if (sprite instanceof HTMLImageElement) {
          this.context.save();

          this.context.drawImage(
            sprite,
            relationalEntityCoordinates.left,
            relationalEntityCoordinates.top,
            relationalEntityCoordinates.width,
            relationalEntityCoordinates.height,
          );
          this.context.restore();
        } else {
          console.error('Sprite is not an instance of HTMLImageElement', sprite);
        }

        this.context.fillStyle = entity.COLOR;
        this.context.strokeStyle =  entity.COLOR;
        this.context.beginPath();
        this.context.rect(
          relationalEntityCoordinates.left,
          relationalEntityCoordinates.top,
          relationalEntityCoordinates.width,
          relationalEntityCoordinates.height,
        );
        this.context.stroke();
      } else {
        this.context.lineWidth = 1;
        this.context.fillStyle = entity.COLOR;
        this.context.strokeStyle =  '#000';
        this.context.beginPath();
        this.context.rect(
          relationalEntityCoordinates.left,
          relationalEntityCoordinates.top,
          relationalEntityCoordinates.width,
          relationalEntityCoordinates.height,
        );
        this.context.fill();
      }

      entity.update(timeElapsed);
    });
  }

  private i = 0;
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
      const timeElapsed = timeStamp - this.prevDOMHighResTimeStamp;
      this.prevDOMHighResTimeStamp = timeStamp;
      this.draw(timeElapsed);

      if (debugMODE && debug && (this.i % 10 === 0)) {
        debug.innerText = 'FPS: ' + String(Math.round(1000 / timeElapsed));
      }

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
    await ResourceLoader.loadGameAssets();

    const uiEntity = new Entity();
    const uiController = new UIController();
    uiEntity.addComponent(uiController);
    this.entityManager.addEntity(uiEntity, 'ui');

    const networkEntity = new Entity();
    const networkController = new NetworkController();
    networkEntity.addComponent(networkController);
    this.entityManager.addEntity(networkEntity, 'network');

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

    const camera = new Camera(canvasWidth, canvasHeight);
    this.entityManager.addEntity(camera, 'camera');

    this.scene = {
      camera: camera,
      entities: [],
    };

    const map = new GameMap(this.scene);
    this.entityManager.addEntity(map, 'map');

    this.scene.entities.push(player);

    // for (let j = 0; j < 5; j++) {
    //   const enemyEntity = new Entity();
    //   enemyEntity.getBox().move(0, 50 * (j + 1));
    //   this.scene.entities.push(enemyEntity);
    // }
    //
    // for (let j = 0; j < 10; j++) {
    //   const enemyEntity = new Entity();
    //   enemyEntity.getBox().move(j * 50, 50);
    //   this.scene.entities.push(enemyEntity);
    // }
    //
    // for (let j = 0; j < 5; j++) {
    //   if (j === 3 || j === 4) continue;
    //   const enemyEntity = new Entity();
    //   enemyEntity.getBox().move(150, 50 * (j + 1));
    //   this.scene.entities.push(enemyEntity);
    // }
    //
    // for (let j = 0; j < 5; j++) {
    //   if (j === 3 || j === 4) {
    //     continue;
    //   }
    //   const enemyEntity = new Entity();
    //   enemyEntity.getBox().move(450, 50 * (j + 1));
    //   this.scene.entities.push(enemyEntity);
    // }
    //
    // for (let j = 0; j < 10; j++) {
    //   const enemyEntity = new Entity();
    //   enemyEntity.getBox().move(50 * (j), 300);
    //   this.scene.entities.push(enemyEntity);
    // }
    //
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
  MusicPlayer.playMainTheme();
  game.run();
}
stopButton.onclick = function () {
  state.innerText = 'stopped';
  state.style.color = '#ff0000';
  debug!.innerText = '';
  MusicPlayer.pause();
  game.stop();
}
