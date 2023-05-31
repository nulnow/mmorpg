export type SpriteConfig = {
  rows: number;
  cols: number;
  size: number;
}

export class Sprite {
  public constructor(
    private sprites: HTMLImageElement,
    private config: SpriteConfig,
  ) {}

  private cache = new Map<number, HTMLImageElement>()

  public getLength(): number {
    return this.config.size;
  }

  public getSpriteByIndex(index: number): HTMLImageElement {
    if (this.cache.has(index)) {
      return this.cache.get(index)!;
    }

    const { width, height } = this.sprites;

    const colWidth = width / this.config.cols;
    const rowHeight = height / this.config.cols;

    const canvas = document.createElement('canvas');
    canvas.width = colWidth;
    canvas.height = rowHeight;
    const canvasContext = canvas.getContext('2d')!;
    canvasContext.imageSmoothingEnabled = false;

    const rowIndex = Math.floor(index / this.config.cols);
    const colIndex = index - (rowIndex * this.config.cols);

    const xOffset = colIndex * colWidth;
    const yOffset = rowIndex * rowHeight;

    canvasContext.drawImage(this.sprites, xOffset, yOffset, colWidth, rowHeight, 0, 0, colWidth, rowHeight);
    const image = new Image();
    image.src = canvas.toDataURL();

    this.cache.set(index, image);

    return image;
  }
}
