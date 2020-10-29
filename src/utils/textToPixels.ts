import { Pxxl } from '../lib/Pxxl/dist/pxxl';
import { TPoint } from '../../lib/Renderer/src/types';

export type TWordPoint = TPoint & { row: number, column: number };
export type TTextToPixels = { getPixels: (text: string) => TWordPoint[] };

const cache = new Map<string, TTextToPixels>();

async function getTextToPixelsByFont (font: string): Promise<TTextToPixels> {
  if (!cache.has(font)) {
    cache.set(font, await new Promise<TTextToPixels>((resolve) => {
      Pxxl.LoadFont(`/dist/fonts/${font}`, resolve);
    }));
  }

  return cache.get(font)!;
}

export async function textToPixels (text: string, font: string = 'c64.bdf'): Promise<TWordPoint[]> {
  return (await getTextToPixelsByFont(font)).getPixels(text);
}
