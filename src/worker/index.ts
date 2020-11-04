import { init } from './init';
import { Layer } from '../../lib/Renderer/src/layers/Layer';
import { render } from '../../lib/Renderer/src/render';
import { Root } from '../components/Root';

async function main (): Promise<void> {
  const {
    workerScope,
    canvases,
    devicePixelRatio
  } = await init();

  render(workerScope, new Root(devicePixelRatio, {
    under: new Layer(canvases[0], 0),
    main: new Layer(canvases[1], 1),
    above: new Layer(canvases[2], 2),
    static: new Layer(canvases[3], 3),
    keys: [
      'static',
      'under',
      'main',
      'above'
    ]
  }));
}

main();
