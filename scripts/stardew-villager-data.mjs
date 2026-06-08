import { BACHELORS } from './stardew-villager-data/bachelors.mjs';
import { BACHELORETTES } from './stardew-villager-data/bachelorettes.mjs';
import { TOWNSFOLK } from './stardew-villager-data/townsfolk.mjs';

/** All giftable Pelican Town villagers — https://stardewvalleywiki.com/Villagers */
export const STARDEW_VILLAGERS = [...BACHELORETTES, ...BACHELORS, ...TOWNSFOLK].sort((a, b) =>
  a.name.localeCompare(b.name, 'en'),
);

export const STARDEW_VILLAGER_SLUGS = STARDEW_VILLAGERS.map((v) => v.slug);
