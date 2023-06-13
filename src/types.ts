import { Camera } from './Camera/Camera';
import { Entity } from './Entity';

export type Message = unknown;

export type Scene = {
  camera: Camera;
  entities: Entity[];
};

export type MarkupPoint = {
  x: number;
  y: number;
};

export type MarkupRect = [MarkupPoint, MarkupPoint];
