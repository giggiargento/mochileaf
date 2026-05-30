import type { IslandTour } from '../types';

const gameSlug = 'neverness-to-everness';

/** Curated NTE guides on YouTube — opens in a new tab. */
export const nteVideoGuides: IslandTour[] = [
  {
    slug: 'free-s-rank-arcs',
    title: 'All free S-Rank Arc farming guide',
    gameSlug,
    youtubeId: 'Nb_S7vjfpNU',
    channel: 'Zeeebo Gaming',
    summary:
      'Walkthrough of every farmable S-Rank Arc in patch 1.0 — anomaly commissions, weekly bosses, and City Tycoon rewards without gacha pulls.',
    tags: ['Arcs', 'Farming'],
  },
  {
    slug: 'anomaly-commissions-cartridges',
    title: 'Beginner guide — anomaly commissions & Console gear',
    gameSlug,
    youtubeId: 'xE5OrssThoc',
    channel: 'Gacha Gamer',
    summary:
      'How to track 4-star anomaly commissions on the map for free S Arcs, plus Rabbit Hole cartridges, modules, and early Console tips.',
    tags: ['Anomalies', 'Cartridges'],
  },
  {
    slug: 'pink-paws-heist-loot',
    title: 'Pink Paws heist — golden bosses & loot rooms',
    gameSlug,
    youtubeId: '2uqR1_3tIwQ',
    channel: 'Community guide',
    summary:
      'Full Pink Paws Bank HQ run: vault routes, golden boss spawns, and loot room locations for maximum Fons per heist.',
    tags: ['Pink Paws', 'Fons'],
  },
  {
    slug: 'fons-vaults-and-heist',
    title: 'Complete Fons guide (vaults, heist & cafe)',
    gameSlug,
    youtubeId: 'n_ddHNxQb1I',
    channel: 'Mimo Realm',
    summary:
      'Long-form money guide covering hospital vaults, Pink Paws heist unlock at City Tycoon 10, cafe passive income, and stamina routes.',
    tags: ['Fons', 'Pink Paws'],
  },
];

export function getNteVideoGuides(): IslandTour[] {
  return nteVideoGuides;
}

export function getVideoGuidesByGame(slug: string): IslandTour[] {
  if (slug === gameSlug) return nteVideoGuides;
  return [];
}
