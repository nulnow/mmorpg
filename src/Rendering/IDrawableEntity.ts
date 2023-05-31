import { GameObject } from './GameObject';

export interface IDrawableEntity {
  getGameObject(): GameObject;
}
