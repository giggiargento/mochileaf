import { getCharactersByGame } from '../lib/content/characters';
import type { Character } from '../types';

const gameSlug = 'animal-crossing-new-horizons';

/** Card/list size — run npm run villagers:optimize-images after sync. */
export const villagerPortrait = (slug: string, size: 128 | 256 = 128) =>
  `/images/games/${gameSlug}/villagers/${slug}-${size}.webp`;

/** All ACNH villagers for the directory — alphabetical by name. */
export function getAcnhVillagers(): Character[] {
  return getCharactersByGame(gameSlug).sort((a, b) => a.name.localeCompare(b.name, 'en'));
}
