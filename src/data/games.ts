import type { Game } from '../types';

export const games: Game[] = [
  {
    slug: 'whisperwood',
    name: 'Whisperwood',
    tagline: 'A gentle adventure through misty forests',
    description:
      'Explore lantern-lit groves, befriend woodland spirits, and uncover stories woven into every leaf.',
    accent: 'sage',
    coverGradient: 'from-sage-200/80 via-mist-100 to-cream-50',
    featured: true,
    status: 'active',
  },
  {
    slug: 'stardew-haven',
    name: 'Stardew Haven',
    tagline: 'Cozy farming beneath a painted sky',
    description:
      'Tend your garden, share tea with neighbors, and watch seasons drift by in watercolor warmth.',
    accent: 'honey',
    coverGradient: 'from-honey-200/80 via-blossom-100 to-cream-50',
    featured: true,
    status: 'active',
  },
  {
    slug: 'moonlit-tides',
    name: 'Moonlit Tides',
    tagline: 'Serene sailing on bioluminescent seas',
    description:
      'Chart quiet shores, collect sea glass memories, and listen to the ocean hum lullabies.',
    accent: 'mist',
    coverGradient: 'from-mist-200/80 via-lavender-100 to-cream-50',
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
