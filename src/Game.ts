import { HomeMap } from './GameMaps/HomeMap';
import { GiantTreeMap } from './GameMaps/GiantTreeMap';
import { GameMap } from './GameMaps/GameMap';
import { PlayerEntity } from './Player/PlayerEntity';
import { InputController } from './InputController';
import { HOME_MAP_NAMED_LOCATIONS } from './GameMaps/HomeMapCONSTANTS';
import { Position } from './Rendering/Position';
import { SkeletonEntity } from './Enemies/Skeleton/SkeletonEntity';
import { FollowPlayerCamera } from './Camera/FollowPlayerCamera';
import { Camera } from './Camera/Camera';

class TestMap extends GameMap {
  public constructor(game: Game) {
    super(game.getCanvas());
  }

  public initialize() {
    super.initialize();

    const skeleton = new SkeletonEntity(window.innerWidth/ 2, window.innerHeight / 2);

    this.getEntityManager().addEntity(skeleton);
    this.getEntityManager().addToScene(skeleton);
  }

  public attachPlayer(player: PlayerEntity): this {
    player.getGameObject().getBox().setTopLeft(new Position());
    this.getEntityManager().addEntity(player, 'player');
    this.getEntityManager().addToScene(player);

    // const camera = new Camera(window.innerWidth, window.innerHeight);
    const camera = new FollowPlayerCamera(window.innerWidth, window.innerHeight, player);
    this.getEntityManager().addEntity(camera, 'camera');
    this.getScene().camera = camera;

    return this;
  }

}

export class Game {
  private readonly canvas: HTMLCanvasElement;
  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  private interval: number = -1;

  public testMap: TestMap;
  public homeMap: HomeMap;
  public giantTreeMap: GiantTreeMap;
  public currentGameMap: GameMap | null = null;

  public constructor(
    canvas: HTMLCanvasElement,
  ) {
    this.canvas = canvas;

    this.testMap = new TestMap(this);
    this.homeMap = new HomeMap(this);
    this.giantTreeMap = new GiantTreeMap(this);

    this.testMap.initialize();
    this.homeMap.initialize();
    this.giantTreeMap.initialize();
  }

  public setGiantTreeMap(namedLocation: 'top' | 'bottom' = 'bottom'): this {
    this.setGameMap(this.giantTreeMap, namedLocation);
    return this;
  }

  public setHomeMap(namedLocation: keyof typeof HOME_MAP_NAMED_LOCATIONS = 'home'): this {
    this.setGameMap(this.homeMap, namedLocation);
    return this;
  }

  private setGameMap(gameMap: GameMap, namedLocation?: string): this {
    let player: PlayerEntity;

    if (this.currentGameMap) {
      player = this.currentGameMap!.getEntityManager().getEntityByName('player') as PlayerEntity;
      this.currentGameMap!.removePlayer();
    } else {
      player = new PlayerEntity(0, 0);
      const inputController = new InputController();
      player.addComponent(inputController);
    }

    player.handleClear();
    gameMap.attachPlayer(player, namedLocation);
    this.currentGameMap = gameMap;

    return this;
  }

  private tick(timeElapsed: number, timeElapsedReal: number): void {
    this.currentGameMap!.tick(timeElapsed);
  }

  private draw(timeElapsed: number, timeElapsedReal: number): void {
    this.currentGameMap!.draw(timeElapsed, timeElapsedReal);
  }

  private prevDOMHighResTimeStamp = 0;
  public run(): void {
    this.interval = requestAnimationFrame((timeStamp) => {
      const timeElapsedReal = timeStamp - this.prevDOMHighResTimeStamp
      const timeElapsed = timeElapsedReal;
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
    this.setGameMap(this.homeMap);
    // this.setGameMap(this.testMap);
  }
}
