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

import flower from '../assets/flower.png'

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
    },
    flower: flower,
  };
  private static loadedAssets = {
    adventurer: {
      idle: [] as HTMLImageElement[],
      run: [] as HTMLImageElement[],
      attack1: [] as HTMLImageElement[],
    },
    flower: null as any,
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

  static async loadGameAssets() {
    this.loadedAssets.adventurer.idle = await Promise.all(this.rawAssets.adventurer.idle.map((src) => this.loadImage(src)));
    this.loadedAssets.adventurer.run = await Promise.all(this.rawAssets.adventurer.run.map((src) => this.loadImage(src)));
    this.loadedAssets.adventurer.attack1 = await Promise.all(this.rawAssets.adventurer.attack1.map((src) => this.loadImage(src)));
    this.loadedAssets.flower = await this.loadImage(this.rawAssets.flower)
  }
}
