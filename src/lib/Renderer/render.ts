import { Layer } from '../Layers/Layer';
import { scheduler, Task } from '../Scheduler';
import { createRootTaskQueue } from './createRootTaskQueue';
import { MessageType, typedListenMessage, typedPostMessage } from '../Worker/messageType';
import { getRootParentData } from './getRootParentData';
import { Layers } from '../Layers/Layers';
import { getPropsFromLayers } from './utils';
import { TComponentData } from '../types';
import { CoreComponent, DATA } from '../Components/CoreComponent';
import { zeroizeRenderIndex } from './renderIndex';

export function render (
  workerScope: DedicatedWorkerGlobalScope,
  rootComponentData: TComponentData
): void {
  typedListenMessage(workerScope, MessageType.INIT, ({ data }) => {
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
          workerScope,
          MessageType.SORT_LAYERS,
          getPropsFromLayers(layers)
        );
      }
    });

    const rootTaskQueue = createRootTaskQueue();
    const parentData = getRootParentData(rootTaskQueue, layersManager);
    // eslint-disable-next-line new-cap
    const root = new rootComponentData.type(parentData as unknown as CoreComponent, rootComponentData.props);

    rootTaskQueue.add(new Task(() => {
      zeroizeRenderIndex();
      layers.forEach(l => {
        l.isDirty = l.willDirty;
        l.willDirty = false;
      });
    }, null));

    rootTaskQueue.add(root[DATA].taskQueue);

    scheduler.add(rootTaskQueue);
    scheduler.start();

    root.performRender();
  });
}
