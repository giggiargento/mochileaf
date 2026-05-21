import type { ImageMetadata } from 'astro';
import acnhHubHero from '../assets/games/animal-crossing-new-horizons/hub-hero.png';
import nteCardHero from '../assets/games/neverness-to-everness/card-hero.png';

export type GameAssetSet = {
  /** Wide hub banner on /{game} */
  cover?: ImageMetadata;
  /** Home + /games card (16:10) */
  card?: ImageMetadata;
};

const gameAssets: Record<string, GameAssetSet> = {
  'animal-crossing-new-horizons': {
    cover: acnhHubHero,
    card: acnhHubHero,
  },
  'neverness-to-everness': {
    card: nteCardHero,
  },
};

export function getGameCoverAsset(slug: string): ImageMetadata | undefined {
  return gameAssets[slug]?.cover;
}

export function getGameCardAsset(slug: string): ImageMetadata | undefined {
  const set = gameAssets[slug];
  return set?.card ?? set?.cover;
}

export function gameHasOptimizedCover(slug: string): boolean {
  return !!getGameCoverAsset(slug);
}
