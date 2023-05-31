import { Camera } from './Camera/Camera';
import { Entity } from './Entity';

export type Message = unknown;

export type Scene = {
  camera: Camera;
  entities: Entity[];
}
