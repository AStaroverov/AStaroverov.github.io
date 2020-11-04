import { TRect } from '../lib/Renderer/src/types';
import { BaseComponent } from '../lib/Renderer/src/BaseComponent';
import { Layer } from '../lib/Renderer/src/layers/Layer';
import { CameraService } from '../lib/Renderer/src/components/Camera/serviece';
import { Deferred } from 'ts-deferred';

export type TLayers = {
  static: Layer
  under: Layer
  main: Layer
  above: Layer
  keys: Array<Exclude<keyof TLayers, 'keys'>>
};

export type TContext = {
  layers: TLayers
  root: BaseComponent
  camera: CameraService
  size: TRect
  devicePixelRatio: number
  deferStartAnimation: Deferred<void>
};
