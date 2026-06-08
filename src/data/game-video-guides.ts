import type { IslandTour } from '../types';

/** Curated YouTube guides per game hub — newest first on /{game}/guides. */
const videoGuidesByGame: Record<string, IslandTour[]> = {
  'neverness-to-everness': [
    {
      slug: 'sunni-island-100-percent',
      title: 'Sunward Island 100% exploration',
      gameSlug: 'neverness-to-everness',
      youtubeId: 'ZNsTNWLttyM',
      channel: 'Gaming with Abyss',
      publishedAt: '2026-06-03',
      summary:
        'All Oracle Stones, Gifts from 21, check-ins, and nine Strange Tales on Sunward Island — ideal after you finish the Dreamwalk Corridor story beat.',
      tags: ['Sunward Island', 'Collectibles'],
    },
    {
      slug: 'v11-update-overview',
      title: 'Everything in the 1.1 update (8 minutes)',
      gameSlug: 'neverness-to-everness',
      youtubeId: 'FfPz4GsuPis',
      channel: 'Styxir',
      publishedAt: '2026-05-24',
      summary:
        'Quick tour of Dreamwalk Corridor — Sunward Island, Lacrimosa and Chaos banners, Porsche collab, events, and QoL changes from the May special program.',
      tags: ['1.1', 'Sunward Island'],
    },
    {
      slug: 'pink-paws-heist-loot',
      title: 'Pink Paws heist — golden bosses & loot rooms',
      gameSlug: 'neverness-to-everness',
      youtubeId: '2uqR1_3tIwQ',
      channel: 'Community guide',
      publishedAt: '2026-05-01',
      summary:
        'Full Pink Paws Bank HQ run: vault routes, golden boss spawns, and loot room locations for maximum Fons per heist.',
      tags: ['Pink Paws', 'Fons'],
    },
    {
      slug: 'fons-vaults-and-heist',
      title: 'Complete Fons guide (vaults, heist & cafe)',
      gameSlug: 'neverness-to-everness',
      youtubeId: 'n_ddHNxQb1I',
      channel: 'Mimo Realm',
      publishedAt: '2026-04-28',
      summary:
        'Long-form money guide covering hospital vaults, Pink Paws heist unlock at City Tycoon 10, cafe passive income, and stamina routes.',
      tags: ['Fons', 'Pink Paws'],
    },
    {
      slug: 'anomaly-commissions-cartridges',
      title: 'Beginner guide — anomaly commissions & Console gear',
      gameSlug: 'neverness-to-everness',
      youtubeId: 'xE5OrssThoc',
      channel: 'Gacha Gamer',
      publishedAt: '2026-04-20',
      summary:
        'How to track 4-star anomaly commissions on the map for free S Arcs, plus Rabbit Hole cartridges, modules, and early Console tips.',
      tags: ['Anomalies', 'Cartridges'],
    },
    {
      slug: 'free-s-rank-arcs',
      title: 'All free S-Rank Arc farming guide',
      gameSlug: 'neverness-to-everness',
      youtubeId: 'Nb_S7vjfpNU',
      channel: 'Zeeebo Gaming',
      publishedAt: '2026-04-15',
      summary:
        'Walkthrough of every farmable S-Rank Arc in patch 1.0 — anomaly commissions, weekly bosses, and City Tycoon rewards without gacha pulls.',
      tags: ['Arcs', 'Farming'],
    },
  ],
  'animal-crossing-new-horizons': [
    {
      slug: 'june-2026-checklist',
      title: 'What to do in June (2026)',
      gameSlug: 'animal-crossing-new-horizons',
      youtubeId: '708EOzzZbWQ',
      channel: 'NintenTalk',
      publishedAt: '2026-06-01',
      summary:
        'June on your island — Wedding Season on Harv\'s Island, summer shells, Nook Shopping seasonal items, and critters worth catching before they rotate out.',
      tags: ['June', 'Events'],
    },
    {
      slug: 'wedding-season-complete',
      title: 'Wedding Season — Heart Crystals & items',
      gameSlug: 'animal-crossing-new-horizons',
      youtubeId: '3gFt3gbAfJ8',
      channel: 'alexis on tv',
      publishedAt: '2022-06-01',
      summary:
        'Full Wedding Season walkthrough: daily ceremony and reception flow, how Reese scores your decor, and trading Heart Crystals with Cyrus.',
      tags: ['Wedding Season', 'Heart Crystals'],
    },
  ],
  'stardew-valley': [
    {
      slug: 'gourmet-chef-all-recipes',
      title: 'Gourmet Chef — all 81 recipes (2025 update)',
      gameSlug: 'stardew-valley',
      youtubeId: 'YGyUMhgo59k',
      channel: 'Meat City Gaming',
      publishedAt: '2026-01-30',
      summary:
        'A calm checklist for cooking every dish once — Queen of Sauce Sundays, friendship mail, shops, and Ginger Island oddballs, with Cook and Sous Chef milestones along the way.',
      tags: ['Cooking', 'Queen of Sauce'],
    },
    {
      slug: 'npc-favorite-food-irl',
      title: 'Every villager’s favorite dish — cooked IRL',
      gameSlug: 'stardew-valley',
      youtubeId: 'lSbKJvBhacg',
      channel: 'Everhearth Inn',
      publishedAt: '2025-04-18',
      summary:
        'The official Stardew cookbook brought to life — pepper poppers, pumpkin soup, and every NPC’s loved gift on a real plate, with honest tasting notes and cozy kitchen energy.',
      tags: ['Recipes', 'Cookbook'],
    },
    {
      slug: '400-aesthetic-mods',
      title: '400+ aesthetic Stardew mods',
      gameSlug: 'stardew-valley',
      youtubeId: 'tIXBecHPC54',
      channel: 'cozy girly',
      publishedAt: '2025-08-21',
      summary:
        'A cozy tour of 400+ aesthetic mods — UI, buildings, environment, fashion, animals, and QoL picks, with a full spreadsheet linked in the description.',
      tags: ['Aesthetic', 'Mods'],
    },
    {
      slug: 'favourite-cottagecore-mods-16',
      title: 'Favourite 1.6 mods — aesthetic cottagecore',
      gameSlug: 'stardew-valley',
      youtubeId: 'uEfzDt3gRWc',
      channel: 'morifae',
      publishedAt: '2024-07-16',
      summary:
        'Morifae’s go-to cottagecore loadout for 1.6 — medieval buildings, earthy recolor, cuter animals, reflections, furniture, and SVE picks with Nexus links in the chapters.',
      tags: ['Cottagecore', 'Aesthetic'],
    },
    {
      slug: 'farm-start-2026',
      title: 'Starting a new farm right in 2026',
      gameSlug: 'stardew-valley',
      youtubeId: 'aud8igTbY0k',
      channel: 'ezlilyy',
      publishedAt: '2026-01-09',
      summary:
        'Farm layout perks, early crops and machines, and how to avoid year-one burnout — a calm reset guide while we wait for 1.7 news.',
      tags: ['Beginner', 'Year 1'],
    },
    {
      slug: 'ultimate-16-guide',
      title: 'Ultimate 1.6 guide — beginner to perfection',
      gameSlug: 'stardew-valley',
      youtubeId: 'wkg77At1UU4',
      channel: 'Poxial',
      publishedAt: '2025-07-09',
      summary:
        'One long-form reference for 1.6: farm picks, Community Center rhythm, skills, and late-game goals split into beginner, intermediate, and expert chapters.',
      tags: ['1.6', 'Community Center'],
    },
  ],
};

function sortIslandToursNewestFirst(tours: IslandTour[]): IslandTour[] {
  return [...tours].sort((a, b) => {
    const aDate = a.publishedAt ?? '';
    const bDate = b.publishedAt ?? '';
    if (aDate !== bDate) return bDate.localeCompare(aDate);
    return a.title.localeCompare(b.title);
  });
}

export function getVideoGuidesByGame(slug: string): IslandTour[] {
  const tours = videoGuidesByGame[slug];
  if (!tours) return [];
  return sortIslandToursNewestFirst(tours);
}

/** @deprecated Use getVideoGuidesByGame('neverness-to-everness') */
export function getNteVideoGuides(): IslandTour[] {
  return getVideoGuidesByGame('neverness-to-everness');
}
