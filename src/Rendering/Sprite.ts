import { TrippleMap } from '../JSHACKS';
import { ResourceLoader } from '../ResourceLoader';

export type SpriteConfig = {
  rows: number;
  cols: number;
  size: number;

  rowIndex?: number;
}

export type SpriteFilter = (context: CanvasRenderingContext2D) => void;

export class Sprite {
  public constructor(
    private sprites: HTMLImageElement,
    private config: SpriteConfig,
  ) {
    this.warmCaches();
  }

  private static cache = new TrippleMap<number, SpriteFilter | null, unknown, HTMLImageElement>();
  private filter?: SpriteFilter;
  public setFilter(filter: SpriteFilter) {
    this.filter = filter;
  }

  private warmCaches(): this {
    for (let i = 0; i < this.getLength(); i++) {
      this.getSpriteByIndex(i);
    }
    return this;
  }

  public getLength(): number {
    return this.config.size;
  }

  public getSpriteByIndex(index: number): HTMLImageElement {
    const fromCache = Sprite.cache.get(index, (this.filter ?? null), this.config);
    if (!!fromCache) {
      return fromCache;
    }

    const { width, height } = this.sprites;

    const colWidth = width / this.config.cols;
    const rowHeight = height / this.config.rows;

    const canvas = document.createElement('canvas');
    canvas.width = colWidth;
    canvas.height = rowHeight;
    const canvasContext = canvas.getContext('2d')!;
    canvasContext.imageSmoothingEnabled = false;

    if (this.filter) {
      this.filter(canvasContext);
    }

    let rowIndex;
    let colIndex;
    if (this.config.rowIndex !== undefined) {
      rowIndex = this.config.rowIndex;
      colIndex = index;
    } else {
      rowIndex = Math.floor(index / this.config.cols);
      colIndex = index - (rowIndex * this.config.cols);
    }

    const xOffset = colIndex * colWidth;
    const yOffset = rowIndex * rowHeight;

    canvasContext.drawImage(
      this.sprites,
      xOffset,
      yOffset,
      colWidth,
      rowHeight,
      0,
      0,
      colWidth,
      rowHeight
    );
    const image = new Image();
    image.src = canvas.toDataURL();

    Sprite.cache.set(index, this.filter ?? null, this.config, image);

    return image;
  }
}
