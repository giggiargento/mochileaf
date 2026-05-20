import type { IslandTour } from '../types';

const gameSlug = 'animal-crossing-new-horizons';

/** Curated island tours on YouTube — opens in a new tab. */
export const acnhIslandTours: IslandTour[] = [
  {
    slug: 'best-islands-compilation',
    title: 'Touring the best islands (compilation)',
    gameSlug,
    youtubeId: 'aRubGryPHO0',
    channel: 'Crossing Channel',
    summary:
      'Long-form tour of standout community islands — layout ideas, themed districts, and photo spots.',
    tags: ['Compilation', 'Inspiration'],
  },
  {
    slug: 'calla-cove-natural',
    title: 'Moody, overgrown natural island (Calla Cove 2.0)',
    gameSlug,
    youtubeId: 'iIaohY1kkQs',
    channel: 'Katie Cozyway',
    summary:
      'Forest paths, layered greenery, and calm neighborhoods — strong reference for natural builds.',
    tags: ['Natural', 'Overgrown'],
  },
  {
    slug: 'natural-views',
    title: 'Beautiful natural views island tour',
    gameSlug,
    youtubeId: 'w0K--wQAkD4',
    channel: 'Katie Cozyway',
    summary:
      'Clifftop vistas and soft landscaping — good for learning sightlines and visitor flow.',
    tags: ['Views', 'Landscaping'],
  },
  {
    slug: 'lilac-forestcore',
    title: 'Lilac accented forestcore tour',
    gameSlug,
    youtubeId: 'tASsQhjGylg',
    channel: 'Katie Cozyway',
    summary:
      'Purple florals with woodland paths — dreamy color palette without loud clutter.',
    tags: ['Forestcore', 'Pastel'],
  },
  {
    slug: 'cocotopia-pastel',
    title: 'Cocotopia — pastel island tour',
    gameSlug,
    youtubeId: 'klSetmrd9fY',
    channel: 'Marit Plays',
    summary:
      'Soft pastels and custom designs — helpful if you want a candy-bright island tone.',
    tags: ['Pastel', 'Custom design'],
  },
];

export function getIslandToursByGame(slug: string): IslandTour[] {
  return acnhIslandTours.filter((t) => t.gameSlug === slug);
}
