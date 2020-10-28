import { init } from './init';
import { LayersManager } from '../../lib/Renderer/src/layers/LayersManager';
import { Layer } from '../../lib/Renderer/src/layers/Layer';
import { render } from '../../lib/Renderer/src/render';
import { Root } from '../components/Root';

async function main (): Promise<void> {
  const {
    workerScope,
    canvases,
    devicePixelRatio
  } = await init();

  const layersManager = new LayersManager({
    under: new Layer(canvases[0]),
    main: new Layer(canvases[1]),
    above: new Layer(canvases[2])
  });

  render(workerScope, new Root(layersManager, devicePixelRatio));
}

main();
