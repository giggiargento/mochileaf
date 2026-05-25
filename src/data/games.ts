import type { Game } from '../types';

export const games: Game[] = [
  {
    slug: 'animal-crossing-new-horizons',
    name: 'Animal Crossing: New Horizons',
    shortName: 'ACNH',
    tagline: 'Island life, villager neighbors, and dreamy tours',
    description:
      'Decor inspiration galleries, popular villagers, handy items, and cozy island tours — all at a calm pace.',
    accent: 'blossom',
    coverGradient: 'from-blossom-200/80 via-mist-100 to-cream-50',
    featured: true,
    status: 'active',
  },
  {
    slug: 'stardew-valley',
    name: 'Stardew Valley',
    tagline: 'Farming, friendship, and quiet seasons in Pelican Town',
    description:
      'Grow crops, explore the mines, befriend villagers, and restore the community center at your own pace — a cozy farming life sim loved worldwide.',
    accent: 'honey',
    coverGradient: 'from-honey-200/80 via-blossom-100 to-cream-50',
    coverImage: '/images/games/stardew-valley/cover.jpg',
    featured: true,
    status: 'active',
  },
  {
    slug: 'neverness-to-everness',
    name: 'Neverness to Everness',
    shortName: 'NTE',
    tagline: 'Urban fantasy action — teams, elements, and calm meta notes',
    description:
      'Fan hub for NTE: roster notes, team comps, and starter guides — cozy pacing, no spreadsheet panic.',
    accent: 'lavender',
    coverGradient: 'from-lavender-200/80 via-mist-100 to-cream-50',
    coverImage: '/images/games/neverness-to-everness/cover.jpg',
    cardImage: '/images/games/neverness-to-everness/card.jpg',
    featured: true,
    status: 'active',
  },
  {
    slug: 'petal-dreams',
    name: 'Petal Dreams',
    tagline: 'Coming soon — a garden of floating islands',
    description:
      'A new world of soft petals and sky bridges is taking shape. Join the newsletter to be first.',
    accent: 'blossom',
    coverGradient: 'from-blossom-200/80 via-lavender-100 to-cream-50',
    featured: false,
    status: 'coming-soon',
  },
];

export function getGame(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

export function getFeaturedGames(): Game[] {
  return games.filter((g) => g.featured && g.status === 'active');
}
