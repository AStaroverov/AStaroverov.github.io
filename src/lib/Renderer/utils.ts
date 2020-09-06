import { Layer, TLayerProps } from '../Layers/Layer';

export function getPropsFromLayers (layers: Layer[]): TLayerProps[] {
  return layers.map(getPropsFromLayer);
}

export function getPropsFromLayer (layer: Layer): TLayerProps {
  return {
    name: layer.name,
    index: layer.index
  };
}
