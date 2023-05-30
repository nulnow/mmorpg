import { Box } from './Box';
import { FiniteStateMachine } from '../StateMachine/FiniteStateMachine';

export abstract class GameObject {
  protected box: Box;
  protected children: GameObject[];
  protected fsm: FiniteStateMachine;

  protected constructor(fsm: FiniteStateMachine) {
    this.fsm = fsm;
  }

  public getAllTheBoxes(): Box[] {
    const boxes = [this.box];

    this.children.forEach((child) => {
      const childBoxes = child.getAllTheBoxes();
      childBoxes.forEach(box => {
        boxes.push(box);
      });
    });

    return boxes;
  }

  public getChildren(): GameObject[] {
    return this.children;
  }

  public addChild(child: GameObject) {
    this.children.push(child);
  }

  public removeChild(child: GameObject) {
    this.children = this.children.filter(c => c !== child);
  }

  public update(timeElapsed: number) {
    this.fsm.update(timeElapsed);

    this.getChildren().forEach(child => {
      child.update(timeElapsed);
    });
  }

  public getCurrentSprite(): HTMLImageElement {
    return this.fsm.getCurrentState().getCurrentSprite();
  };
}
