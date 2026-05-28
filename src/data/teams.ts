import type { Team } from '../types';

const gameSlug = 'neverness-to-everness';

export const teams: Team[] = [
  {
    slug: 'hotori-nanally-jiuyuan-zero',
    name: 'Hotori + Zero sustain',
    gameSlug,
    members: [
      { slug: 'hotori', compRole: 'Main DPS' },
      { slug: 'nanally', compRole: 'Heal' },
      { slug: 'jiuyuan', compRole: 'Support' },
      { slug: 'zero-female', compRole: 'Burst' },
    ],
    focus: 'Cosmos sustain burst',
    summary:
      'Balanced comp with Hotori on-field damage, Zero (F) as burst finisher, and double sustain utility from Nanally + Jiuyuan.',
    synergies: [
      'Cosmos pair (Hotori + Zero) keeps offensive resonance active during swaps.',
      'Nanally + Jiuyuan stack sustain/utility so burst cycles are safer in long fights.',
    ],
    tags: ['Popular', 'Cosmos', 'Stable'],
    difficulty: 'easy',
  },
  {
    slug: 'hotori-nanally-jiuyuan-sakiri',
    name: 'Hotori + Sakiri hybrid',
    gameSlug,
    members: [
      { slug: 'hotori', compRole: 'Main DPS' },
      { slug: 'nanally', compRole: 'Heal' },
      { slug: 'jiuyuan', compRole: 'Support' },
      { slug: 'sakiri', compRole: 'Burst' },
    ],
    focus: 'Hybrid burst + sustain',
    summary:
      'A safe hybrid lineup: Hotori handles steady pressure while Sakiri spikes during buff windows from Jiuyuan and stable uptime from Nanally.',
    synergies: [
      'Double support core (Nanally + Jiuyuan) enables aggressive Hotori/Sakiri rotations.',
      'Hotori sustained DPS plus Sakiri burst covers both short and long encounters.',
    ],
    tags: ['Popular', 'Hybrid', 'Safe'],
    difficulty: 'medium',
  },
  {
    slug: 'baicang-sakiri-daffodil-haniel',
    name: 'Baicang Sakiri control break',
    gameSlug,
    members: [
      { slug: 'baicang', compRole: 'Tank' },
      { slug: 'sakiri', compRole: 'Main DPS' },
      { slug: 'daffodil', compRole: 'Break' },
      { slug: 'haniel', compRole: 'Control' },
    ],
    focus: 'Control + Break',
    summary:
      'Control-focused composition where Baicang and Haniel create stable windows for Daffodil break pressure and Sakiri finishing bursts.',
    synergies: [
      'Baicang front-line control plus Haniel slows fights and reduces risky openings.',
      'Daffodil Break setup amplifies Sakiri burst conversion.',
    ],
    tags: ['Popular', 'Control', 'Break'],
    difficulty: 'hard',
  },
  {
    slug: 'chiz-hathor-jiuyuan-haniel',
    name: 'Chiz Lakshana support shell',
    gameSlug,
    members: [
      { slug: 'chiz', compRole: 'Main DPS' },
      { slug: 'hathor', compRole: 'Support' },
      { slug: 'jiuyuan', compRole: 'Heal' },
      { slug: 'haniel', compRole: 'Control' },
    ],
    focus: 'Chiz carry + control shell',
    summary:
      'Chiz-centered carry team with Hathor/Haniel control tools and Jiuyuan sustain, strong for players wanting a safer but still high-uptime setup.',
    synergies: [
      'Lakshana pair (Hathor + Haniel) increases control consistency around Chiz uptime.',
      'Jiuyuan healing keeps Chiz in sustained DPS cycles with fewer defensive swaps.',
    ],
    tags: ['Popular', 'Chiz', 'Control'],
    difficulty: 'medium',
  },
  {
    slug: 'turbid-burn-core',
    name: 'Turbid Burn core',
    gameSlug,
    members: [
      { slug: 'baicang', compRole: 'Tank' },
      { slug: 'daffodil', compRole: 'Main DPS' },
      { slug: 'fadia', compRole: 'DMG boost' },
      { slug: 'sakiri', compRole: 'Burst' },
    ],
    focus: 'Break + Incantation',
    summary:
      'Baicang anchors defenses while Daffodil drives Break and Turbid Burn. Fadia keeps ETD-4 synergy alive; Sakiri adds Incantation burst when windows open.',
    synergies: [
      'Turbid Burn pressure from Daffodil with Fadia enabling safer setup windows.',
      'Double Incantation core (Baicang + Sakiri) keeps elemental bonuses active.',
    ],
    tags: ['Meta', 'Break', 'Endgame'],
    difficulty: 'hard',
  },
  {
    slug: 'chiz-starter-free',
    name: 'Chiz F2P starter',
    gameSlug,
    members: [
      { slug: 'chiz', compRole: 'Main DPS' },
      { slug: 'mint', compRole: 'Utility' },
      { slug: 'jiuyuan', compRole: 'Heal' },
      { slug: 'hotori', compRole: 'Burst' },
    ],
    focus: 'Cosmos / free roster',
    summary:
      'No gacha required for the main DPS — level Chiz through City Tycoon. Mint and Jiuyuan cover utility; Hotori adds Cosmos damage until you pull stronger carries.',
    synergies: [
      'Cosmos trio (Chiz, Mint, Hotori) stabilizes resonance uptime for beginner accounts.',
      'Jiuyuan healing + utility keeps Chiz rotations uninterrupted.',
    ],
    tags: ['F2P', 'Beginner', 'Cosmos'],
    difficulty: 'easy',
  },
  {
    slug: 'anima-sustain',
    name: 'Anima sustain',
    gameSlug,
    members: [
      { slug: 'nanally', compRole: 'Heal' },
      { slug: 'jiuyuan', compRole: 'Support' },
      { slug: 'aurelia', compRole: 'Tank' },
      { slug: 'sakiri', compRole: 'DPS' },
    ],
    focus: 'Survival + reactions',
    summary:
      'Double Anima support with Aurelia on the front. Sakiri provides damage once buffs are online — forgiving for story and long anomalies.',
    synergies: [
      'Anima sustain core (Nanally + Jiuyuan + Aurelia) greatly increases team uptime.',
      'Sakiri converts long safe fights into consistent Incantation damage.',
    ],
    tags: ['Anima', 'Safe', 'Story'],
    difficulty: 'easy',
  },
  {
    slug: 'etd-4-theme',
    name: 'ETD-4 squad',
    gameSlug,
    members: [
      { slug: 'baicang', compRole: 'Tank' },
      { slug: 'fadia', compRole: 'DMG boost' },
      { slug: 'skia', compRole: 'DPS' },
      { slug: 'daffodil', compRole: 'Break' },
    ],
    focus: 'Faction flavor',
    summary:
      'Theme team built around Bureau of Anomaly Control members. Not always the absolute fastest clear, but satisfying synergy and shared story buffs where applicable.',
    synergies: [
      'ETD-4 themed pairing keeps Break utility online with Daffodil + Fadia.',
      'Baicang front-line control gives Skia safer damage windows.',
    ],
    tags: ['Theme', 'Incantation'],
    difficulty: 'medium',
  },
  {
    slug: 'lakshana-control',
    name: 'Lakshana control',
    gameSlug,
    members: [
      { slug: 'hathor', compRole: 'Control' },
      { slug: 'haniel', compRole: 'Control' },
      { slug: 'sakiri', compRole: 'DPS' },
      { slug: 'jiuyuan', compRole: 'Heal' },
    ],
    focus: 'Lakshana + Incantation',
    summary:
      'Hathor and Haniel slow the fight down; Jiuyuan patches HP. Sakiri converts control time into Incantation damage spikes.',
    synergies: [
      'Lakshana control pair (Hathor + Haniel) extends enemy downtime.',
      'Jiuyuan sustain enables Sakiri burst timing instead of panic swaps.',
    ],
    tags: ['Lakshana', 'Control'],
    difficulty: 'medium',
  },
  {
    slug: 'psyche-flex',
    name: 'Psyche flex',
    gameSlug,
    members: [
      { slug: 'fadia', compRole: 'Support' },
      { slug: 'edgar', compRole: 'DPS' },
      { slug: 'daffodil', compRole: 'Break' },
      { slug: 'nanally', compRole: 'Heal' },
    ],
    focus: 'Mixed Psyche / Chaos',
    summary:
      'Early-account friendly when Psyche units are what you have. Swap Edgar for Sakiri or Hotori as pulls arrive.',
    synergies: [
      'Fadia + Daffodil maintain reliable debuff and Break value for weaker rosters.',
      'Nanally healing lets Edgar stay on field for longer DPS windows.',
    ],
    tags: ['Early game', 'Psyche'],
    difficulty: 'easy',
  },
];

export function getTeamsByGame(slug: string): Team[] {
  return teams.filter((t) => t.gameSlug === slug);
}

export function getTeam(gameSlug: string, teamSlug: string): Team | undefined {
  return teams.find((t) => t.gameSlug === gameSlug && t.slug === teamSlug);
}
