import { TRect } from '../lib/Renderer/src/types';
import { BaseComponent } from '../lib/Renderer/src/BaseComponent';
import { LayersManager } from '../lib/Renderer/src/layers/LayersManager';
import { Layer } from '../lib/Renderer/src/layers/Layer';
import { CameraService } from '../lib/Renderer/src/components/Camera/serviece';
import { Deferred } from 'ts-deferred';

export type TLayers = {
  under: Layer
  main: Layer
  above: Layer
};

export type TContext = {
  root: BaseComponent
  camera: CameraService
  size: TRect
  devicePixelRatio: number
  layersManager: LayersManager<TLayers>
  deferStartAnimation: Deferred<void>
};
