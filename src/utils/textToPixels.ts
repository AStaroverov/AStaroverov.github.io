import { Pxxl } from '../../lib/Pxxl/build/pxxl';
import { TPoint } from '../../lib/Renderer/src/types';

export type TWordPoint = TPoint & { row: number, column: number };
export type TTextToPixels = { getPixels: (text: string) => TWordPoint[] };

const promises = new Map<string, Promise<TTextToPixels>>();
const cache = new Map<string, TTextToPixels>();

async function getTextToPixelsByFont (font: string): Promise<TTextToPixels> {
  if (!cache.has(font)) {
    if (!promises.has(font)) {
      promises.set(font, new Promise<TTextToPixels>((resolve) => {
        Pxxl.LoadFont(`./fonts/${font}`, resolve);
      }));

      cache.set(font, await promises.get(font)!);
    } else {
      await promises.get(font);
    }
  }

  return cache.get(font)!;
}

export async function textToPixels (text: string, font: string = 'c64.bdf'): Promise<TWordPoint[]> {
  return (await getTextToPixelsByFont(font)).getPixels(text);
}
