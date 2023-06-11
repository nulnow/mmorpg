import { TrippleMap } from '../JSHACKS';

export type SpriteConfig = {
  rows: number;
  cols: number;
  size: number;

  from?: number;
  to?: number;
}

export type SpriteFilter = (context: CanvasRenderingContext2D) => void;

export class Sprite {
  public constructor(
    private sprites: HTMLImageElement,
    private config: SpriteConfig,
  ) {}

  private static cache = new TrippleMap<number, SpriteFilter | null, HTMLImageElement, HTMLImageElement>();
  private filter?: SpriteFilter;
  public setFilter(filter: SpriteFilter) {
    this.filter = filter;
  }

  public getLength(): number {
    return this.config.size;
  }

  public getSpriteByIndex(index: number): HTMLImageElement {
    const fromCache = Sprite.cache.get(index, this.filter ?? null, this.sprites);
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

    const rowIndex = Math.floor(index / this.config.cols);
    const colIndex = index - (rowIndex * this.config.cols);

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

    Sprite.cache.set(index, this.filter ?? null, this.sprites, image);

    return image;
  }
}
