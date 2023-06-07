import { Component } from './Component';

export class InputController extends Component {
  private readonly pressedKeys = new Map<string, boolean>();

  public isOneOfMovementKeysIsPressed(): boolean { return this.isTopPressed() || this.isRightPressed() || this.isBottomPressed() || this.isLeftPressed(); }
  public isTopPressed(): boolean { return !!this.pressedKeys.get('KeyW') || !!this.pressedKeys.get('ArrowUp'); }
  public isRightPressed(): boolean { return !!this.pressedKeys.get('KeyD') || !!this.pressedKeys.get('ArrowRight'); }
  public isBottomPressed(): boolean { return !!this.pressedKeys.get('KeyS') || !!this.pressedKeys.get('ArrowDown'); }
  public isLeftPressed(): boolean { return !!this.pressedKeys.get('KeyA') || !!this.pressedKeys.get('ArrowLeft'); }
  public isAttack1Pressed(): boolean { return !!this.pressedKeys.get('KeyE'); }

  private keyDownHandler = (event: KeyboardEvent): void => { this.pressedKeys.set(event.code, true); };
  private keyUpHandler = (event: KeyboardEvent): void => { this.pressedKeys.set(event.code, false); };

  private windowFocusOutHandler = (): void => {
    this.pressedKeys.forEach((_, key) => {
      this.pressedKeys.set(key, false);
    });
  };

  public init(): void {
    super.init();
    document.addEventListener('keydown', this.keyDownHandler);
    Array.from(document.querySelectorAll('#mobile-controls [data-key]')).forEach(div => {
      div.addEventListener('mousedown', (event) => {
        event.preventDefault();
        this.pressedKeys.set(div.getAttribute("data-key")!, true);
      });

      div.addEventListener('mouseup', (event) => {
        event.preventDefault();
        this.pressedKeys.set(div.getAttribute("data-key")!, false);
      });

      div.addEventListener('touchstart', (event) => {
        event.preventDefault();
        this.pressedKeys.set(div.getAttribute("data-key")!, true);
      });

      div.addEventListener('touchend', (event) => {
        event.preventDefault();
        this.pressedKeys.set(div.getAttribute("data-key")!, false);
      });
    });

    document.addEventListener('keyup', this.keyUpHandler);
    document.addEventListener('focusout', this.windowFocusOutHandler);
  }

  public destroy(): void {
    super.destroy();
    document.removeEventListener('keydown', this.keyDownHandler);
    document.removeEventListener('keyup', this.keyUpHandler);
    document.removeEventListener('focusout', this.windowFocusOutHandler);
  }

  public update(timeElapsed: number): void {
    super.update(timeElapsed);
  }
}
