import {Layer} from "../Layers/Layer";
import {scheduler, Task} from "../Scheduler";
import {rootTaskQueue} from "./TaskQueue";
import {workerMessages} from "./workerMessages";
import {getRootParentData} from "./getRootParentData";
import {Layers} from "../Layers/Layers";

export function renderFromWorker(
  rootData: any,
): Promise<void> {
  return new Promise((resolve, reject) => {
    addEventListener('message', ({ data }) => {
      if (data.type === workerMessages.INIT) {
        const layers = data.payload.canvases.map(
          (canvas, index) => {
            return new Layer(
              data.payload.layersProps[index], canvas
            );
          }
        );
        const ls = new Layers(layers);
        const parentData = getRootParentData(ls, rootTaskQueue);
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

        resolve();
      }
    });
  });
}
