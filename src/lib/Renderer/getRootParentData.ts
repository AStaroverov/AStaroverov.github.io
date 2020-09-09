import { RootTaskQueue } from './createRootTaskQueue';
import { Layers } from '../Layers/Layers';

interface TFakeParentData {
  layers: Layers
  context: any // public context
  __comp: {
    schedule: VoidFunction
  }
}

export function getRootParentData (rootTaskQueue: RootTaskQueue, layers: Layers): TFakeParentData {
  return {
    layers,
    context: {}, // public context
    __comp: {
      schedule: rootTaskQueue.schedule.bind(rootTaskQueue)
    }
  };
}
