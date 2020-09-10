import { Layer } from '../Layers/Layer';
import { scheduler, Task } from '../Scheduler';
import { createRootTaskQueue } from './createRootTaskQueue';
import { MessageType, typedListenMessage, typedPostMessage } from '../Worker/messageType';
import { getRootParentData } from './getRootParentData';
import { Layers } from '../Layers/Layers';
import { getPropsFromLayers } from './utils';
import { TComponentData } from './types';
import { CoreComponent } from './CoreComponent';

export async function render (
  rootData: TComponentData
): Promise<DedicatedWorkerGlobalScope> {
  return await new Promise((resolve, reject) => {
    const self: DedicatedWorkerGlobalScope = globalThis.document === undefined
      ? globalThis
      : globalThis.__workerContext__;

    typedListenMessage(self, MessageType.INIT, ({ data }) => {
      // @ts-expect-error
      const layers: Layer[] = data.payload.canvases.map(
        (canvas, index) => {
          return new Layer(
            data.payload.layersProps[index], canvas
          );
        }
      );
      const layersManager = new Layers(layers, {
        onSortLayers: (layers: Layer[]) => {
          typedPostMessage(
            self,
            MessageType.SORT_LAYERS,
            getPropsFromLayers(layers)
          );
        }
      });

      const rootTaskQueue = createRootTaskQueue();
      const parentData = getRootParentData(rootTaskQueue, layersManager);
      // eslint-disable-next-line new-cap
      const root = new rootData.type(parentData as CoreComponent, rootData.props);

      rootTaskQueue.add(new Task(() => {
        layers.forEach(l => {
          l.isDirty = l.willDirty;
          l.willDirty = false;
        });
      }, null));

      rootTaskQueue.add(root.__data.task);
      rootTaskQueue.add(root.__data.childQueue);

      scheduler.add(rootTaskQueue);
      scheduler.start();

      root.performRender();

      resolve(self);
    });
  });
}
