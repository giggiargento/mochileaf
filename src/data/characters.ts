import type { Character } from '../types';
import { acnhVillagers } from './characters-acnh';
import { nteCharacters } from './characters-nte';

export const characters: Character[] = [
  ...acnhVillagers,
  {
    slug: 'pierre',
    name: 'Pierre',
    role: 'General Store Owner',
    gameSlug: 'stardew-valley',
    image: '/images/games/stardew-valley/characters/pierre.png',
    description:
      'Runs the town shop and competes with JojaMart prices. Loves garden-fresh produce and quiet evenings on the town square.',
  },
  {
    slug: 'robin',
    name: 'Robin',
    role: 'Carpenter',
    gameSlug: 'stardew-valley',
    image: '/images/games/stardew-valley/characters/robin.png',
    description:
      'Builds farm buildings and sells house upgrades. Friendly, practical, and always ready to sketch a new coop or barn.',
  },
  {
    slug: 'abigail',
    name: 'Abigail',
    role: 'Explorer & Adventurer',
    gameSlug: 'stardew-valley',
    image: '/images/games/stardew-valley/characters/abigail.png',
    description:
      'Spends rainy days in the mines and loves unusual minerals. A good friend if you enjoy combat, puzzles, and pumpkin-related gifts.',
  },
  {
    slug: 'sebastian',
    name: 'Sebastian',
    role: 'Programmer',
    gameSlug: 'stardew-valley',
    image: '/images/games/stardew-valley/characters/sebastian.png',
    description:
      'Lives in the basement, codes by night, and rides his motorcycle when the coast is clear. Responds well to patience and thoughtful gifts.',
  },
  {
    slug: 'lewis',
    name: 'Lewis',
    role: 'Mayor of Pelican Town',
    gameSlug: 'stardew-valley',
    image: '/images/games/stardew-valley/characters/lewis.png',
    description:
      'Keeps the community center project on track and hosts seasonal festivals. Loves local produce and a well-kept farm.',
  },
  {
    slug: 'emily',
    name: 'Emily',
    role: 'Salon Stylist',
    gameSlug: 'stardew-valley',
    image: '/images/games/stardew-valley/characters/emily.png',
    description:
      'Works at the saloon and practices crystal healing on the side. Bright, creative, and happiest when you bring gems or cloth.',
  },
  {
    slug: 'linus',
    name: 'Linus',
    role: 'Forager',
    gameSlug: 'stardew-valley',
    image: '/images/games/stardew-valley/characters/linus.png',
    description:
      'Lives in a tent north of town and respects the valley’s wild places. Appreciates foraged goods and kindness more than expensive gifts.',
  },
  ...nteCharacters,
];

export function getCharactersByGame(gameSlug: string): Character[] {
  return characters.filter((c) => c.gameSlug === gameSlug);
}

export function getCharacter(gameSlug: string, slug: string): Character | undefined {
  return characters.find((c) => c.gameSlug === gameSlug && c.slug === slug);
}
