import adventurerIdle00 from '../assets/Adventurer/Individual Sprites/adventurer-idle-00.png';
import adventurerIdle01 from '../assets/Adventurer/Individual Sprites/adventurer-idle-01.png';
import adventurerIdle02 from '../assets/Adventurer/Individual Sprites/adventurer-idle-02.png';
import adventurerIdle03 from '../assets/Adventurer/Individual Sprites/adventurer-idle-03.png';

import adventurerRun00 from '../assets/Adventurer/Individual Sprites/adventurer-run-00.png'
import adventurerRun01 from '../assets/Adventurer/Individual Sprites/adventurer-run-01.png'
import adventurerRun02 from '../assets/Adventurer/Individual Sprites/adventurer-run-02.png'
import adventurerRun03 from '../assets/Adventurer/Individual Sprites/adventurer-run-03.png'
import adventurerRun04 from '../assets/Adventurer/Individual Sprites/adventurer-run-04.png'
import adventurerRun05 from '../assets/Adventurer/Individual Sprites/adventurer-run-05.png'

import adventurerAttack_1_00 from '../assets/Adventurer/Individual Sprites/adventurer-attack1-00.png'
import adventurerAttack_1_01 from '../assets/Adventurer/Individual Sprites/adventurer-attack1-01.png'
import adventurerAttack_1_02 from '../assets/Adventurer/Individual Sprites/adventurer-attack1-02.png'
import adventurerAttack_1_03 from '../assets/Adventurer/Individual Sprites/adventurer-attack1-03.png'
import adventurerAttack_1_04 from '../assets/Adventurer/Individual Sprites/adventurer-attack1-04.png'

import advendurerDie_0 from '../assets/Adventurer/Individual Sprites/adventurer-die-00.png';
import advendurerDie_1 from '../assets/Adventurer/Individual Sprites/adventurer-die-01.png';
import advendurerDie_2 from '../assets/Adventurer/Individual Sprites/adventurer-die-02.png';
import advendurerDie_3 from '../assets/Adventurer/Individual Sprites/adventurer-die-03.png';
import advendurerDie_4 from '../assets/Adventurer/Individual Sprites/adventurer-die-04.png';
import advendurerDie_5 from '../assets/Adventurer/Individual Sprites/adventurer-die-05.png';
import advendurerDie_6 from '../assets/Adventurer/Individual Sprites/adventurer-die-06.png';

import guardIdle from '../assets/Medieval Warrior Pack 3/Sprites/Idle.png';
import guardAttack from '../assets/Medieval Warrior Pack 3/Sprites/Attack1.png';
import guardRun from '../assets/Medieval Warrior Pack 3/Sprites/Run.png';
import guardDeath from '../assets/Medieval Warrior Pack 3/Sprites/Death.png';

import slimeIdle_0 from '../assets/Slime/Individual Sprites/slime-idle-0.png';
import slimeIdle_1 from '../assets/Slime/Individual Sprites/slime-idle-1.png';
import slimeIdle_2 from '../assets/Slime/Individual Sprites/slime-idle-2.png';
import slimeIdle_3 from '../assets/Slime/Individual Sprites/slime-idle-3.png';

import slimeMove_0 from '../assets/Slime/Individual Sprites/slime-move-0.png';
import slimeMove_1 from '../assets/Slime/Individual Sprites/slime-move-1.png';
import slimeMove_2 from '../assets/Slime/Individual Sprites/slime-move-2.png';
import slimeMove_3 from '../assets/Slime/Individual Sprites/slime-move-3.png';

import slimeDie_0 from '../assets/Slime/Individual Sprites/slime-die-0.png';
import slimeDie_1 from '../assets/Slime/Individual Sprites/slime-die-1.png';
import slimeDie_2 from '../assets/Slime/Individual Sprites/slime-die-2.png';
import slimeDie_3 from '../assets/Slime/Individual Sprites/slime-die-3.png';

import slimeAttack_0 from '../assets/Slime/Individual Sprites/slime-attack-0.png';
import slimeAttack_1 from '../assets/Slime/Individual Sprites/slime-attack-1.png';
import slimeAttack_2 from '../assets/Slime/Individual Sprites/slime-attack-2.png';
import slimeAttack_3 from '../assets/Slime/Individual Sprites/slime-attack-3.png';
import slimeAttack_4 from '../assets/Slime/Individual Sprites/slime-attack-4.png';

import fireSprite from '../assets/Fire_AnimatedPixel/Fire_Spreadsheet.png';

import cobblestone from '../assets/cobblestone2.png';
import bed from '../assets/bed.png';

import flower from '../assets/flower.png'
import { Sprite } from './Rendering/Sprite';

export class ResourceLoader {
  private static rawAssets = {
    adventurer: {
      idle: [
        adventurerIdle00,
        adventurerIdle01,
        adventurerIdle02,
        adventurerIdle03
      ],
      run: [
        adventurerRun00,
        adventurerRun01,
        adventurerRun02,
        adventurerRun03,
        adventurerRun04,
        adventurerRun05,
      ],
      attack1: [
        adventurerAttack_1_00,
        adventurerAttack_1_01,
        adventurerAttack_1_02,
        adventurerAttack_1_03,
        adventurerAttack_1_04,
      ],
      die: [
        advendurerDie_0,
        advendurerDie_1,
        advendurerDie_2,
        advendurerDie_3,
        advendurerDie_4,
        advendurerDie_5,
        advendurerDie_6,
      ],
      dead: [
        advendurerDie_5,
        advendurerDie_6,
      ],
    },
    slime: {
      idle: [
        slimeIdle_0,
        slimeIdle_1,
        slimeIdle_2,
        slimeIdle_3,
      ],
      attack: [
        slimeAttack_0,
        slimeAttack_1,
        slimeAttack_2,
        slimeAttack_3,
        slimeAttack_4,
      ],
      move: [
        slimeMove_0,
        slimeMove_1,
        slimeMove_2,
        slimeMove_3,
      ],
      die: [
        slimeDie_0,
        slimeDie_1,
        slimeDie_2,
        slimeDie_3,
      ],
    },
    guard: {
      idle: guardIdle,
      attack: guardAttack,
      run: guardRun,
      death: guardDeath,
    },
    fireSprite: fireSprite,
    flower: flower,
    cobblestone: cobblestone,
    bed: bed,
  };
  private static loadedAssets = {
    adventurer: {
      idle: [] as HTMLImageElement[],
      run: [] as HTMLImageElement[],
      attack1: [] as HTMLImageElement[],
      die: [] as HTMLImageElement[],
      dead: [] as HTMLImageElement[],
    },
    slime: {
      idle: [] as HTMLImageElement[],
      move: [] as HTMLImageElement[],
      die: [] as HTMLImageElement[],
      attack: [] as HTMLImageElement[],
    },
    guard: {
      idle: null as any as Sprite,
      attack: null as any as Sprite,
      run: null as any as Sprite,
      death: null as any as Sprite,
    },
    fireSprite: null as any as Sprite,
    flower: null as any,
    cobblestone: null as any,
    bed: null as any,
  };
  public static getLoadedAssets() {
    return this.loadedAssets;
  }

  private static flippedImagesMap = new Map<HTMLImageElement, HTMLImageElement>();
  public static flipImage(image: HTMLImageElement, rect: { width: number, height: number }): HTMLImageElement {
    if (this.flippedImagesMap.has(image)) {
      return this.flippedImagesMap.get(image)!;
    }

    const canvas = document.createElement('canvas');
    canvas.width = rect.width;
    canvas.height = rect.height;
    const canvasContext = canvas.getContext('2d')!;
    canvasContext.imageSmoothingEnabled = false;

    canvasContext.translate(rect.width, 0);
    canvasContext.scale(-1, 1);
    canvasContext.drawImage(image, 0, 0, rect.width, rect.height);
    const flippedImage = new Image();
    flippedImage.src = canvas.toDataURL();

    this.flippedImagesMap.set(image, flippedImage);

    return flippedImage;
  }

  static async loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.src = src;
      image.onload = () => {
        resolve(image);
        this.flipImage(image, {
          width: image.width,
          height: image.height,
        });
      };
      image.onerror = reject;
    });
  }

  private static patternMap = new Map<HTMLImageElement, CanvasPattern>()
  public static pattern(image: HTMLImageElement, context: CanvasRenderingContext2D): CanvasPattern {
    if (this.patternMap.has(image)) {
      return this.patternMap.get(image)!;
    }

    const pattern = context.createPattern(image, '')!;
    this.patternMap.set(image, pattern);

    return pattern;
  }

  private static compressedImagesMap = new Map<HTMLImageElement, HTMLImageElement>();
  public static compressSquareImage(image: HTMLImageElement): HTMLImageElement {
    if (this.compressedImagesMap.has(image)) {
      return this.compressedImagesMap.get(image)!;
    }
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const context = canvas.getContext('2d')!;
    context.imageSmoothingEnabled = false;
    context.drawImage(image, 0, 0, 100, 100);
    const compressedImage = new Image();
    compressedImage.src = canvas.toDataURL();

    this.compressedImagesMap.set(image, compressedImage);
    return compressedImage;
  }

  public static getImageFromPattern(patternOrImage: CanvasPattern | HTMLImageElement, width: number, height: number): HTMLImageElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d')!;

    let pattern: CanvasPattern;
    if (patternOrImage instanceof CanvasPattern) {
      pattern = patternOrImage;
    } else {
      pattern = this.pattern(patternOrImage as HTMLImageElement, context);
    }
    context.imageSmoothingEnabled = false;
    context.fillStyle = pattern;
    context.fillRect(
      0,
      0,
      width,
      height,
    );
    const image = new Image();
    image.src = canvas.toDataURL();

    return image;
  }

  static async loadGameAssets() {
    this.loadedAssets.adventurer.idle = await Promise.all(this.rawAssets.adventurer.idle.map((src) => this.loadImage(src)));
    this.loadedAssets.adventurer.run = await Promise.all(this.rawAssets.adventurer.run.map((src) => this.loadImage(src)));
    this.loadedAssets.adventurer.attack1 = await Promise.all(this.rawAssets.adventurer.attack1.map((src) => this.loadImage(src)));
    this.loadedAssets.adventurer.die = await Promise.all(this.rawAssets.adventurer.die.map((src) => this.loadImage(src)));
    this.loadedAssets.adventurer.dead = await Promise.all(this.rawAssets.adventurer.dead.map((src) => this.loadImage(src)));

    this.loadedAssets.slime.idle = await Promise.all(this.rawAssets.slime.idle.map((src) => this.loadImage(src)));
    this.loadedAssets.slime.move = await Promise.all(this.rawAssets.slime.move.map((src) => this.loadImage(src)));
    this.loadedAssets.slime.die = await Promise.all(this.rawAssets.slime.die.map((src) => this.loadImage(src)));
    this.loadedAssets.slime.attack = await Promise.all(this.rawAssets.slime.attack.map((src) => this.loadImage(src)));

    this.loadedAssets.flower = await this.loadImage(this.rawAssets.flower)
    this.loadedAssets.bed = await this.loadImage(this.rawAssets.bed)
    this.loadedAssets.cobblestone = this.compressSquareImage(await this.loadImage(this.rawAssets.cobblestone))
    this.loadedAssets.fireSprite = new Sprite(await this.loadImage(this.rawAssets.fireSprite), { cols: 2, rows: 2, size: 4 });

    this.loadedAssets.guard.idle = new Sprite(await this.loadImage(this.rawAssets.guard.idle), { cols: 10, rows: 1, size: 10 });
    this.loadedAssets.guard.attack = new Sprite(await this.loadImage(this.rawAssets.guard.attack), { cols: 4, rows: 1, size: 4 });
    this.loadedAssets.guard.run = new Sprite(await this.loadImage(this.rawAssets.guard.run), { cols: 6, rows: 1, size: 6 });
    this.loadedAssets.guard.death = new Sprite(await this.loadImage(this.rawAssets.guard.death), { cols: 9, rows: 1, size: 9 });
  }
}

class ImageProcessor {
  private static getNewCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;

    return [canvas, context];
  }

  private static zoomMap = new Map<HTMLImageElement, Map<number, HTMLImageElement>>()
  public static zoom(image: HTMLImageElement, zoom: number): HTMLImageElement {
    if (this.zoomMap.has(image) && this.zoomMap.get(image)!.has(zoom)) {
      return this.zoomMap.get(image)!.get(zoom)!
    }

    const [canvas, context] = this.getNewCanvas();
    const { width, height } = image;

    const newWidth = width - zoom * 2;
    const newHeight = height - zoom * 2;

    canvas.width = newWidth;
    canvas.height = newHeight;

    context.drawImage(
      image,
      zoom,
      zoom,
      width,
      height,
      0,
      0,
      width,
      height,
    );

    const newImage = new Image();
    newImage.src = canvas.toDataURL();

    if (!this.zoomMap.has(image)) {
      this.zoomMap.set(image, new Map());
    }

    this.zoomMap.get(image)!.set(zoom, newImage);

    return newImage;
  }
}
