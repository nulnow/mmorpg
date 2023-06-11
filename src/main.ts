import { Entity } from './Entity';
import { NetworkController } from './NetworkController';
import { EntityManager } from './EntityManager';
import { PlayerEntity } from './Player/PlayerEntity';
import { InputController } from './InputController';
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
import { EntityPreview } from './Rendering/EntityPreview';
import { DeathEntity } from './Buildings/DeathEntity';
import { DeathQuestEntity } from './Quests/DeathQuest/DeathQuestEntity';
import { TreeEntity } from './Buildings/TreeEntity';
import { Camera } from './Camera/Camera';
import { DrawableEntity } from './Rendering/DrawableEntity';
import { removeOneFromArray } from './JSHACKS';
import { UnsubscribeFn } from './EventEmitter';
import { Stairs } from './Buildings/Stairs';
import { FireEntity } from './Buildings/FireEntity';
import { GiantTree } from './Buildings/GiantTree';
import { GameMap } from './GameMaps/GameMap';
import { GiantTreeMap } from './GameMaps/GiantTreeMap';
import { HomeMap } from './GameMaps/HomeMap';
import { StairsMap } from './GameMaps/StairsMap';

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

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
window.addEventListener('resize', () => {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Game {
  private readonly canvas: HTMLCanvasElement;
  private gameMap: GameMap | null = null;

  private interval: number = -1;

  constructor(
    canvas: HTMLCanvasElement,
  ) {
    this.canvas = canvas;
  }

  private setGameMap(gameMap: GameMap): void {
    if (this.gameMap) {
      this.gameMap.destroy();
    }

    gameMap.initialize();

    this.gameMap = gameMap;
  }

  private tick(timeElapsed: number, timeElapsedReal: number): void {
    this.gameMap!.tick(timeElapsed);
  }

  private draw(timeElapsed: number, timeElapsedReal: number): void {
    this.gameMap!.draw(timeElapsed, timeElapsedReal);
  }

  private prevDOMHighResTimeStamp = 0;
  public run(): void {
    this.interval = requestAnimationFrame((timeStamp) => {
      const timeElapsedReal = timeStamp - this.prevDOMHighResTimeStamp
      const timeElapsed = timeElapsedReal * timeSpeed;
      this.prevDOMHighResTimeStamp = timeStamp;
      this.draw(timeElapsed, timeElapsedReal);
      this.tick(timeElapsed, timeElapsedReal);
      this.run();
    });
  }

  public stop(): void {
    cancelAnimationFrame(this.interval);
  }

  public setUp() {
    const homeMap = new HomeMap();
    homeMap.setCanvas(this.canvas);
    this.setGameMap(homeMap);

    // const testMap = new StairsMap();
    // testMap.setCanvas(this.canvas);
    // this.setGameMap(testMap);

    // const treeMap = new GiantTreeMap();
    // treeMap.setCanvas(this.canvas);
    // this.setGameMap(treeMap);
  }
}

// if (!MusicPlayer.getIsPlaying()) {
//   MusicPlayer.playMainTheme();
// }

(async () => {
  const loading = document.getElementById('resource-loader')!;
  const logs = loading.querySelector('.logs')!;
  let count = ResourceLoader.getResourceCount();
  let loaded = 0;
  ResourceLoader.emitter.subscribe('logs', ({ status, name }) => {
    if (status === 'loading') {
      logs.innerHTML += `<p data-name="${name}" style="line-height: 10%;"><span data-status style="font-family: monospace"> <span style="color: yellow">LOADING</span> </span>: ${name}</p>`;
      logs.scrollTo(0, logs.scrollHeight);
    }
    if (status === 'loaded') {
      loaded++;
      let percent = Math.floor((loaded / count) * 100);
      logs.querySelector(`[data-name="${name}"] [data-status]`)!.innerHTML = ` <span style="color: lime">DONE&nbsp;&nbsp;&nbsp;</span> `;
      loading.querySelector('[data-percent]')!.innerHTML = percent.toString();
    }
  });
  await ResourceLoader.loadGameAssets();
  loading.style.display = 'none';

  const entityPreview = new EntityPreview(new PlayerEntity(0, 0));
  entityPreview.mount('select-hero')

  const game = new Game(
    canvas,
  );

  const state = document.getElementById('state')!;
  const startButton = document.getElementById('start')!;
  const stopButton = document.getElementById('stop')!;

  state.innerText = 'started';
  startButton.onclick = async function () {
    entityPreview.destroy();
    state.innerText = 'started';
    state.style.color = '#22ff00';

    game.setUp();
    MusicPlayer.playMainTheme();

    game.run();
    document.getElementById('start-stop-buttons')!.style.top = '0px';
    document.getElementById('start-stop-buttons')!.style.right = '0px';
    startButton.classList.add('none');
    stopButton.classList.remove('none');
    document.getElementById('quests')!.classList.remove('none');
    document.getElementById('mobile-controls')!.classList.remove('none');
    document.getElementById('heroes')!.classList.add('none');
  }
  stopButton.onclick = function () {
    state.innerText = 'stopped';
    state.style.color = '#ff0000';
    MusicPlayer.pause();
    game.stop();
    startButton.classList.remove('none');
    stopButton.classList.add('none');
  }
  state.innerText = 'stopped';
  state.style.color = '#ff0000';
})();
