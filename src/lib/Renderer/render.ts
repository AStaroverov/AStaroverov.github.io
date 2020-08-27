import {Layer} from "../Layers/Layer";
import {Layers} from "../Layers/Layers";
import {scheduler, Task} from "../Scheduler";
import {rootTaskQueue} from "./TaskQueue";

export function render(
  container: HTMLElement,
  rootData: any,
  layers: Layer[],
): void {
  const ls = new Layers(container, layers);

  layers.forEach((layer) => {
    container.appendChild(layer.canvas);
  });

  const parentData = getRootParentData(ls);
  const root = new rootData.klass(parentData, rootData.props);

  rootTaskQueue.add(new Task(() => {
    layers.forEach(l => {
      l.isDirty = l.willDirty;
      l.willDirty = false;
    })
  }, null));

  rootTaskQueue.add(root.__comp.task);
  rootTaskQueue.add(root.__comp.childQueue);

  scheduler.add(rootTaskQueue);
  scheduler.start();

  root.performRender();
}

type TFakeParentData = {
  layers: Layers,
  context: any, // public context
  __comp: {
    schedule: VoidFunction,
  },
}

function getRootParentData (layers: Layers): TFakeParentData {
  return {
    layers,
    context: {}, // public context
    __comp: {
      schedule: rootTaskQueue.schedule.bind(rootTaskQueue),
    }
  }
}
