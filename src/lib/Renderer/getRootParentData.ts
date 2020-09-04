import {RootTaskQueue} from "./TaskQueue";
import {Layers} from "../Layers/Layers";

type TFakeParentData = {
  layers: Layers,
  context: any, // public context
  __comp: {
    schedule: VoidFunction,
  },
}

export function getRootParentData (layers: Layers, rootTaskQueue: RootTaskQueue): TFakeParentData {
  return {
    layers,
    context: {}, // public context
    __comp: {
      schedule: rootTaskQueue.schedule.bind(rootTaskQueue),
    }
  }
}
