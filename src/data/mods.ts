import type { Mod } from '../types';

export const mods: Mod[] = [
  {
    slug: 'smapi',
    name: 'SMAPI (Stardew Modding API)',
    gameSlug: 'stardew-valley',
    category: 'framework',
    summary:
      'The essential loader most PC mods rely on. Install this first, then add content and quality-of-life mods on top.',
    tags: ['PC', 'Essential', 'Framework'],
    url: 'https://smapi.io/',
  },
  {
    slug: 'content-patcher',
    name: 'Content Patcher',
    gameSlug: 'stardew-valley',
    category: 'framework',
    summary:
      'Lets other mods change dialogue, events, and data without replacing game files — a backbone for larger content packs.',
    tags: ['PC', 'Framework'],
    url: 'https://www.nexusmods.com/stardewvalley/mods/1915',
  },
  {
    slug: 'stardew-valley-expanded',
    name: 'Stardew Valley Expanded',
    gameSlug: 'stardew-valley',
    category: 'content',
    summary:
      'A large fan-made expansion with new areas, quests, and characters. Best for players who want dozens more hours in the valley.',
    tags: ['Content', 'Expansion'],
    url: 'https://www.nexusmods.com/stardewvalley/mods/3753',
  },
  {
    slug: 'lookup-anything',
    name: 'Lookup Anything',
    gameSlug: 'stardew-valley',
    category: 'quality-of-life',
    summary:
      'Hold a key to see gift tastes, schedules, and crop details on screen — perfect when you do not want to tab out to a wiki.',
    tags: ['QoL', 'Reference'],
    url: 'https://www.nexusmods.com/stardewvalley/mods/509',
  },
  {
    slug: 'ui-info-suite',
    name: 'UI Info Suite',
    gameSlug: 'stardew-valley',
    category: 'quality-of-life',
    summary:
      'Adds a small on-screen clock, weather, and optional luck readout so you can plan your day without opening menus.',
    tags: ['QoL', 'HUD'],
    url: 'https://www.nexusmods.com/stardewvalley/mods/5098',
  },
];

export function getModsByGame(gameSlug: string): Mod[] {
  return mods.filter((m) => m.gameSlug === gameSlug);
}
