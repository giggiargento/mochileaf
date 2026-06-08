import type { ImageMetadata } from 'astro';
import acnhHubHero from '../assets/games/animal-crossing-new-horizons/hub-hero.png';
import nteCardHero from '../assets/games/neverness-to-everness/card-hero.png';

export type GameAssetSet = {
  /** Home + /games card (16:10) */
  card?: ImageMetadata;
};

const gameAssets: Record<string, GameAssetSet> = {
  'animal-crossing-new-horizons': {
    card: acnhHubHero,
  },
  'neverness-to-everness': {
    card: nteCardHero,
  },
};

export function getGameCardAsset(slug: string): ImageMetadata | undefined {
  return gameAssets[slug]?.card;
}
