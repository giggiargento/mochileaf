import type { ImageMetadata } from 'astro';

export type GameAssetSet = {
  /** Home + /games card (16:10) */
  card?: ImageMetadata;
};

const gameAssets: Record<string, GameAssetSet> = {};

export function getGameCardAsset(slug: string): ImageMetadata | undefined {
  return gameAssets[slug]?.card;
}
