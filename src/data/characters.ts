import type { Character } from '../types';

export const characters: Character[] = [
  {
    slug: 'elara',
    name: 'Elara',
    role: 'Forest Warden',
    element: 'Nature',
    gameSlug: 'whisperwood',
    description:
      'A quiet guardian who speaks with ancient trees. Her lantern guides lost travelers home.',
    tier: 'S',
  },
  {
    slug: 'finn',
    name: 'Finn',
    role: 'Lantern Keeper',
    element: 'Light',
    gameSlug: 'whisperwood',
    description:
      'Cheerful and warm, Finn crafts lanterns that hold memories of cherished moments.',
    tier: 'A',
  },
  {
    slug: 'mira',
    name: 'Mira',
    role: 'Mist Weaver',
    element: 'Water',
    gameSlug: 'whisperwood',
    description:
      'She paints the morning fog with soft colors, revealing hidden paths at dawn.',
    tier: 'A',
  },
  {
    slug: 'rowan',
    name: 'Rowan',
    role: 'Root Scholar',
    element: 'Earth',
    gameSlug: 'whisperwood',
    description:
      'Bookish and kind, Rowan documents every mushroom and melody found in the grove.',
    tier: 'B',
  },
];

export function getCharactersByGame(gameSlug: string): Character[] {
  return characters.filter((c) => c.gameSlug === gameSlug);
}

export function getCharacter(gameSlug: string, slug: string): Character | undefined {
  return characters.find((c) => c.gameSlug === gameSlug && c.slug === slug);
}
