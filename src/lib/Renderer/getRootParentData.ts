import { RootTaskQueue } from './createRootTaskQueue';
import { Layers } from '../Layers/Layers';
import { DATA } from '../Components/CoreComponent';

interface TFakeParentData {
  layers: Layers
  context: any // public context
  [DATA]: {
    schedule: VoidFunction
  }
}

export function getRootParentData (rootTaskQueue: RootTaskQueue, layers: Layers): TFakeParentData {
  return {
    layers,
    context: {}, // public context
    [DATA]: {
      schedule: rootTaskQueue.schedule.bind(rootTaskQueue)
    }
  };
}
