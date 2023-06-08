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
import deathSprite from '../assets/death/death-idle-weapon.png';

import cobblestone from '../assets/cobblestone2.png';
import bed from '../assets/bed.png';
import treeSprite from '../assets/trees.gif';

import flower from '../assets/flower.png'

import mainTheme from '../assets/ruapporangespace_Aim_To_Head_-_EMPeror_71070745.mp3';
import steps from '../assets/sneaker-shoe-on-concrete-floor-fast-pace-1-www.FesliyanStudios.com.mp3';
import evilSlime from '../assets/evil-slime.mp3';
import movingSlime from '../assets/moving-slime.mp3';
import neutralSlime from '../assets/neutral-slime.mp3';
import sword from '../assets/Sword Whooshes Medium - QuickSounds.com.mp3';

import { Sprite } from './Rendering/Sprite';
import { EventEmitter } from './EventEmitter';
import { isMobileOrTablet } from './JSHACKS';

export class ResourceLoader {
  public static readonly emitter = new EventEmitter();

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
    deathSprite: deathSprite,
    treeSprite: treeSprite,
    flower: flower,
    cobblestone: cobblestone,
    bed: bed,
    sounds: {
      evilSlime: evilSlime,
      movingSlime: movingSlime,
      neutralSlime: neutralSlime,
      sword: sword,
      steps: steps,
      mainTheme: mainTheme,
    },
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
    deathSprite: null as any as Sprite,
    treeSprite: null as any as Sprite,
    flower: null as any,
    cobblestone: null as any,
    bed: null as any,
    sounds: {
      evilSlime: null as any as HTMLAudioElement,
      movingSlime: null as any as HTMLAudioElement,
      neutralSlime: null as any as HTMLAudioElement,
      sword: null as any as HTMLAudioElement,
      steps: null as any as HTMLAudioElement,
      mainTheme: null as any as HTMLAudioElement,
    },
  };
  public static getResourceCount() {
    const getCountRecursive = (o: any): number => {
      return Object.entries(o).reduce((acc, [, value]) => {
        if (Array.isArray(value)) {
          return acc + 1;
        }

        if (typeof value === 'object') {
          return acc + getCountRecursive(value);
        }

        return acc + 1;
      }, 0);
    };

    return getCountRecursive(this.rawAssets);
  }
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

  static async loadAudio(src: string): Promise<HTMLAudioElement> {
    return new Promise<HTMLAudioElement>((resolve, reject) => {
      const audio = new Audio();
      audio.src = src;
      audio.preload = "auto";
      audio.addEventListener('canplay', () => {
        resolve(audio);
        document.body.removeChild(audio);
      });
      audio.addEventListener('error', () => {
        reject();
        document.body.removeChild(audio);
      });
      audio.controls = false;
      document.body.appendChild(audio);
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

  public static async loadGameAssets() {
    const sleep = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

    const withLogging = async (name: string, fn: () => Promise<void>): Promise<void> => {
      const delay =  10;
      await sleep(delay);
      this.emitter.emit('logs', { status: 'loading', name: name });
      await fn();
      await sleep(delay);
      this.emitter.emit('logs', { status: 'loaded', name: name });
      await sleep(delay);
    };

    await withLogging('adventurer.idle', async () => {
      this.loadedAssets.adventurer.idle = await Promise.all(this.rawAssets.adventurer.idle.map((src) => this.loadImage(src)));
    });
    await withLogging('adventurer.run', async () => {
      this.loadedAssets.adventurer.run = await Promise.all(this.rawAssets.adventurer.run.map((src) => this.loadImage(src)));
    });
    await withLogging('adventurer.attack1', async () => {
      this.loadedAssets.adventurer.attack1 = await Promise.all(this.rawAssets.adventurer.attack1.map((src) => this.loadImage(src)));
    });
    await withLogging('adventurer.die', async () => {
      this.loadedAssets.adventurer.die = await Promise.all(this.rawAssets.adventurer.die.map((src) => this.loadImage(src)));
    });
    await withLogging('adventurer.dead', async () => {
      this.loadedAssets.adventurer.dead = await Promise.all(this.rawAssets.adventurer.dead.map((src) => this.loadImage(src)));
    });
    await withLogging('slime.idle', async () => {
      this.loadedAssets.slime.idle = await Promise.all(this.rawAssets.slime.idle.map((src) => this.loadImage(src)));
    });
    await withLogging('slime.move', async () => {
      this.loadedAssets.slime.move = await Promise.all(this.rawAssets.slime.move.map((src) => this.loadImage(src)));
    });
    await withLogging('slime.die', async () => {
      this.loadedAssets.slime.die = await Promise.all(this.rawAssets.slime.die.map((src) => this.loadImage(src)));
    });
    await withLogging('slime.attack', async () => {
      this.loadedAssets.slime.attack = await Promise.all(this.rawAssets.slime.attack.map((src) => this.loadImage(src)));
    });
    await withLogging('flower', async () => {
      this.loadedAssets.flower = await this.loadImage(this.rawAssets.flower)
    });
    await withLogging('bed', async () => {
      this.loadedAssets.bed = await this.loadImage(this.rawAssets.bed)
    });
    await withLogging('cobblestone', async () => {
      this.loadedAssets.cobblestone = this.compressSquareImage(await this.loadImage(this.rawAssets.cobblestone))
    });
    await withLogging('fireSprite', async () => {
      this.loadedAssets.fireSprite = new Sprite(await this.loadImage(this.rawAssets.fireSprite), { cols: 2, rows: 2, size: 4 });
    });
    await withLogging('death.idle', async () => {
      this.loadedAssets.deathSprite = new Sprite(await this.loadImage(this.rawAssets.deathSprite), { cols: 4, rows: 1, size: 4 });
    });
    await withLogging('guard.idle', async () => {
      this.loadedAssets.guard.idle = new Sprite(await this.loadImage(this.rawAssets.guard.idle), { cols: 10, rows: 1, size: 10 });
    });
    await withLogging('guard.attack', async () => {
      this.loadedAssets.guard.attack = new Sprite(await this.loadImage(this.rawAssets.guard.attack), { cols: 4, rows: 1, size: 4 });
    });
    await withLogging('guard.run', async () => {
      this.loadedAssets.guard.run = new Sprite(await this.loadImage(this.rawAssets.guard.run), { cols: 6, rows: 1, size: 6 });
    });
    await withLogging('guard.death', async () => {
      this.loadedAssets.guard.death = new Sprite(await this.loadImage(this.rawAssets.guard.death), { cols: 9, rows: 1, size: 9 });
    });
    await withLogging('treeSprite', async () => {
      this.loadedAssets.treeSprite = new Sprite(await this.loadImage(this.rawAssets.treeSprite), { cols: 3, rows: 5, size: 15 });
    });

    // TODO: FIX MOBILE SOUNDS
    if (!isMobileOrTablet()) {
      await withLogging('evilSlime', async () => {
        this.loadedAssets.sounds.evilSlime = await this.loadAudio(this.rawAssets.sounds.evilSlime);
      });
      await withLogging('neutralSlime', async () => {
        this.loadedAssets.sounds.neutralSlime = await this.loadAudio(this.rawAssets.sounds.neutralSlime);
      });
      await withLogging('movingSlime', async () => {
        this.loadedAssets.sounds.movingSlime = await this.loadAudio(this.rawAssets.sounds.movingSlime);
      });
      await withLogging('sword', async () => {
        this.loadedAssets.sounds.sword = await this.loadAudio(this.rawAssets.sounds.sword);
      });
      await withLogging('steps', async () => {
        this.loadedAssets.sounds.steps = await this.loadAudio(this.rawAssets.sounds.steps);
      });
      await withLogging('mainTheme', async () => {
        this.loadedAssets.sounds.mainTheme = await this.loadAudio(this.rawAssets.sounds.mainTheme);
      });
    }
  }
}
