import { HomeMap } from './GameMaps/HomeMap';
import { GiantTreeMap } from './GameMaps/GiantTreeMap';
import { GameMap } from './GameMaps/GameMap';
import { PlayerEntity } from './Player/PlayerEntity';
import { HOME_MAP_NAMED_LOCATIONS } from './GameMaps/HomeMapCONSTANTS';
import { InputController } from './InputController';
import { TestMap } from './GameMaps/TestMap';

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

  public setGiantTreeMap(namedLocation: 'top' | 'bottom' = 'bottom'): void {
    this.setGameMap(this.giantTreeMap, namedLocation);
  }

  public setHomeMap(namedLocation: keyof typeof HOME_MAP_NAMED_LOCATIONS = 'home'): void {
    this.setGameMap(this.homeMap, namedLocation);
  }

  private setGameMap(gameMap: GameMap, namedLocation?: string): void {
    let player: PlayerEntity;

    if (this.currentGameMap) {
      player = this.currentGameMap!.getEntityManager().getEntityByName('player') as PlayerEntity;
      PlayerEntity.detachFronEntityManager(player);
    } else {
      player = new PlayerEntity(0, 0);
      const inputController = new InputController();
      player.addComponent(inputController);
    }

    PlayerEntity.attachToEntityManager(player, gameMap.getEntityManager())
    gameMap.attachPlayer(player, namedLocation);
    this.currentGameMap = gameMap;
  }

  private tick(timeElapsed: number, timeElapsedReal: number): void {
    // this.homeMap.tick(timeElapsed);
    // this.giantTreeMap.tick(timeElapsed);
    // this.testMap.tick(timeElapsed);

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
