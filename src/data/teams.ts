import type { Team } from '../types';

const gameSlug = 'neverness-to-everness';

export const teams: Team[] = [
  {
    slug: 'turbid-burn-core',
    name: 'Turbid Burn core',
    gameSlug,
    memberSlugs: ['baicang', 'daffodil', 'fadia', 'sakiri'],
    focus: 'Break + Incantation',
    summary:
      'Baicang anchors defenses while Daffodil drives Break and Turbid Burn. Fadia keeps ETD-4 synergy alive; Sakiri adds Incantation burst when windows open.',
    tags: ['Meta', 'Break', 'Endgame'],
    difficulty: 'hard',
  },
  {
    slug: 'chiz-starter-free',
    name: 'Chiz F2P starter',
    gameSlug,
    memberSlugs: ['chiz', 'mint', 'jiuyuan', 'hotori'],
    focus: 'Cosmos / free roster',
    summary:
      'No gacha required for the main DPS — level Chiz through City Tycoon. Mint and Jiuyuan cover utility; Hotori adds Cosmos damage until you pull stronger carries.',
    tags: ['F2P', 'Beginner', 'Cosmos'],
    difficulty: 'easy',
  },
  {
    slug: 'cosmos-burst',
    name: 'Cosmos burst',
    gameSlug,
    memberSlugs: ['zero-female', 'hotori', 'xun', 'nanally'],
    focus: 'Cosmos resonance',
    summary:
      'Stack Cosmos units for consistent elemental alignment. Nanally stabilizes the line while the three DPS units trade burst turns.',
    tags: ['Cosmos', 'Burst'],
    difficulty: 'medium',
  },
  {
    slug: 'anima-sustain',
    name: 'Anima sustain',
    gameSlug,
    memberSlugs: ['nanally', 'jiuyuan', 'aurelia', 'sakiri'],
    focus: 'Survival + reactions',
    summary:
      'Double Anima support with Aurelia on the front. Sakiri provides damage once buffs are online — forgiving for story and long anomalies.',
    tags: ['Anima', 'Safe', 'Story'],
    difficulty: 'easy',
  },
  {
    slug: 'etd-4-theme',
    name: 'ETD-4 squad',
    gameSlug,
    memberSlugs: ['baicang', 'fadia', 'skia', 'daffodil'],
    focus: 'Faction flavor',
    summary:
      'Theme team built around Bureau of Anomaly Control members. Not always the absolute fastest clear, but satisfying synergy and shared story buffs where applicable.',
    tags: ['Theme', 'Incantation'],
    difficulty: 'medium',
  },
  {
    slug: 'lakshana-control',
    name: 'Lakshana control',
    gameSlug,
    memberSlugs: ['hathor', 'haniel', 'sakiri', 'jiuyuan'],
    focus: 'Lakshana + Incantation',
    summary:
      'Hathor and Haniel slow the fight down; Jiuyuan patches HP. Sakiri converts control time into Incantation damage spikes.',
    tags: ['Lakshana', 'Control'],
    difficulty: 'medium',
  },
  {
    slug: 'psyche-flex',
    name: 'Psyche flex',
    gameSlug,
    memberSlugs: ['fadia', 'edgar', 'daffodil', 'nanally'],
    focus: 'Mixed Psyche / Chaos',
    summary:
      'Early-account friendly when Psyche units are what you have. Swap Edgar for Sakiri or Hotori as pulls arrive.',
    tags: ['Early game', 'Psyche'],
    difficulty: 'easy',
  },
  {
    slug: 'double-zero-cosmos',
    name: 'Twin Zero lineup',
    gameSlug,
    memberSlugs: ['zero-male', 'zero-female', 'hotori', 'hathor'],
    focus: 'Cosmos hypercarry',
    summary:
      'For accounts that run both Zeros: alternate burst windows with Hotori and Hathor covering weak phases. Energy management matters — don’t spam skills off cooldown.',
    tags: ['Cosmos', 'Whale', 'Burst'],
    difficulty: 'hard',
  },
];

export function getTeamsByGame(slug: string): Team[] {
  return teams.filter((t) => t.gameSlug === slug);
}

export function getTeam(gameSlug: string, teamSlug: string): Team | undefined {
  return teams.find((t) => t.gameSlug === gameSlug && t.slug === teamSlug);
}
