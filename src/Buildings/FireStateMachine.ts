import { State } from '../StateMachine/State';
import { ResourceLoader } from '../ResourceLoader';
import { FiniteStateMachine } from '../StateMachine/FiniteStateMachine';
import { FireEntity } from './FireEntity';
import { Sprite, SpriteFilter } from '../Rendering/Sprite';

export class FireBurningState extends State {
  protected sprites = new Sprite(ResourceLoader.getLoadedAssets().fireSprite, { cols: 2, rows: 2, size: 4 });
  protected speed = 6;
  protected fsm: FireStateMachine;

  public constructor(fsm: FireStateMachine) {
    super(fsm)
    this.fsm = fsm;
    this.gameObject = this.fsm.getFire().getGameObject();
    if (this.fsm.getFilter()) {
      this.sprites.setFilter(this.fsm.getFilter()!);
    }
  }

  public onEnter() {
    this.speed += (3 * Math.random());
    super.onEnter();
  }

  public update(timeElapsed: number) {
    super.update(timeElapsed);
  }
}

export class FireStateMachine extends FiniteStateMachine {
  protected fire: FireEntity;
  protected filter?: SpriteFilter
  public getFilter(): SpriteFilter | undefined {
    return this.filter;
  }

  public getFire(): FireEntity {
    return this.fire;
  }

  public constructor(fire: FireEntity, filter?: SpriteFilter) {
    super();
    this.filter = filter;

    this.fire = fire;
    this.addState(FireBurningState as any);

    this.setState(FireBurningState as any);
  }
}
