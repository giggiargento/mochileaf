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
    name: 'Chiz mixed support shell',
    gameSlug,
    members: [
      { slug: 'chiz', compRole: 'Main DPS' },
      { slug: 'hathor', compRole: 'Support' },
      { slug: 'jiuyuan', compRole: 'Heal' },
      { slug: 'haniel', compRole: 'Control' },
    ],
    focus: 'Chiz carry + mixed support',
    summary:
      'Chiz-centered carry team with Hathor and Haniel utility tools and Jiuyuan sustain, strong for players wanting a safer but still high-uptime setup.',
    synergies: [
      'Hathor Lakshana control plus Haniel Psyche setup keeps Chiz on field longer.',
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
      { slug: 'mint', compRole: 'DPS' },
      { slug: 'jiuyuan', compRole: 'Heal' },
      { slug: 'hotori', compRole: 'Burst' },
    ],
    focus: 'Cosmos + Anima starter',
    summary:
      'No gacha required for the main DPS — level Chiz through City Tycoon. Mint and Jiuyuan cover Anima utility; Hotori adds Cosmos damage until you pull stronger carries.',
    synergies: [
      'Cosmos pair (Chiz + Hotori) with Mint and Jiuyuan covering Anima support for beginner accounts.',
      'Jiuyuan healing + utility keeps Chiz rotations uninterrupted.',
    ],
    tags: ['F2P', 'Beginner', 'Cosmos', 'Anima'],
    difficulty: 'easy',
  },
  {
    slug: 'anima-sustain',
    name: 'Anima sustain',
    gameSlug,
    members: [
      { slug: 'nanally', compRole: 'Heal' },
      { slug: 'jiuyuan', compRole: 'Support' },
      { slug: 'mint', compRole: 'DPS' },
      { slug: 'sakiri', compRole: 'Burst' },
    ],
    focus: 'Survival + reactions',
    summary:
      'Triple Anima core with Mint on damage and Nanally plus Jiuyuan keeping everyone upright. Sakiri adds Incantation burst once buffs are online.',
    synergies: [
      'Anima sustain core (Nanally + Jiuyuan + Mint) greatly increases team uptime.',
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
    tags: ['Theme', 'Mixed'],
    difficulty: 'medium',
  },
  {
    slug: 'lakshana-control',
    name: 'Lakshana control',
    gameSlug,
    members: [
      { slug: 'hathor', compRole: 'Control' },
      { slug: 'skia', compRole: 'DPS' },
      { slug: 'sakiri', compRole: 'Burst' },
      { slug: 'jiuyuan', compRole: 'Heal' },
    ],
    focus: 'Lakshana + Incantation',
    summary:
      'Hathor and Skia slow the fight down with Lakshana tools; Jiuyuan patches HP. Sakiri converts control time into Incantation damage spikes.',
    synergies: [
      'Lakshana pair (Hathor + Skia) extends enemy downtime.',
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
      { slug: 'aurelia', compRole: 'Tank' },
      { slug: 'daffodil', compRole: 'Break' },
      { slug: 'nanally', compRole: 'Heal' },
    ],
    focus: 'Mixed Psyche / Chaos',
    summary:
      'Early-account friendly when Psyche units are what you have. Swap Aurelia for Sakiri or Hotori as stronger pulls arrive.',
    synergies: [
      'Fadia + Daffodil maintain reliable debuff and Break value for weaker rosters.',
      'Nanally healing lets Aurelia hold the front line for longer windows.',
    ],
    tags: ['Early game', 'Psyche'],
    difficulty: 'easy',
  },
  {
    slug: 'lacrimosa-hybrid-sustain',
    name: 'Lacrimosa hybrid sustain',
    gameSlug,
    members: [
      { slug: 'lacrimosa', compRole: 'Main DPS' },
      { slug: 'sakiri', compRole: 'DoT amp' },
      { slug: 'nanally', compRole: 'Heal' },
      { slug: 'hotori', compRole: 'Burst' },
    ],
    focus: 'Scorch + Blossom + Hexed',
    summary:
      'Practical Lacrimosa lane with units you likely already have. Nanally sustains; Hotori adds Cosmos Blossom; Sakiri links Scorch and Hexed without a second on-field DPS.',
    synergies: [
      'Scorch (Lacrimosa + Sakiri), Hexed (Sakiri + Nanally), Blossom (Nanally + Hotori) in one rotation.',
      'Swap Hotori for Daffodil when you need dedicated Break on boss fights.',
    ],
    tags: ['Lacrimosa', 'Scorch', 'Blossom', 'Stable'],
    difficulty: 'medium',
  },
  {
    slug: 'lacrimosa-mono-scorch',
    name: 'Mono Scorch (Lacrimosa)',
    gameSlug,
    members: [
      { slug: 'lacrimosa', compRole: 'Main DPS' },
      { slug: 'sakiri', compRole: 'DoT amp' },
      { slug: 'daffodil', compRole: 'Break' },
      { slug: 'baicang', compRole: 'Scorch DPS' },
    ],
    focus: 'Scorch-only DoT',
    summary:
      'Pure Scorch lane: Sakiri amps DoT, Lacrimosa and Baicang stack burns. Both DPS want field time—plan swaps during boss phases.',
    synergies: [
      'Chaos + Incantation swaps refresh the 15s Scorch DoT window.',
      'Daffodil Break helps; decide who holds field in long fights.',
    ],
    tags: ['Lacrimosa', 'Scorch', 'DoT', 'Experimental'],
    difficulty: 'hard',
  },
  {
    slug: 'lacrimosa-discord-carry',
    name: 'Lacrimosa Discord carry',
    gameSlug,
    members: [
      { slug: 'lacrimosa', compRole: 'Main DPS' },
      { slug: 'sakiri', compRole: 'Control' },
      { slug: 'daffodil', compRole: 'Break' },
      { slug: 'haniel', compRole: 'Support' },
    ],
    focus: 'Nova + Scorch → Discord',
    summary:
      'Lacrimosa carry with Daffodil Break and Sakiri CC. Haniel adds Nova—overlap with Scorch for Discord break-bar pressure.',
    synergies: [
      'Classic Discord loop with Lacrimosa as primary carry.',
      'Break windows amplify Lacrimosa Nightmare detonations.',
    ],
    tags: ['Lacrimosa', 'Discord', 'Chaos', 'Bossing'],
    difficulty: 'hard',
  },
  {
    slug: 'nanally-blossom-core',
    name: 'Anima Blossom core',
    gameSlug,
    members: [
      { slug: 'nanally', compRole: 'Main DPS' },
      { slug: 'zero-female', compRole: 'Cycle' },
      { slug: 'jiuyuan', compRole: 'Support' },
      { slug: 'haniel', compRole: 'Buff' },
    ],
    focus: 'Blossom (Cosmos + Anima)',
    summary:
      'Nanally’s Crit buff and Underboss summon define the Anima lane. Zero’s Skill procs Esper Cycle for fast Blossom swaps; Jiuyuan groups and sustains; Haniel amplifies the team in the fourth slot.',
    synergies: [
      'Cosmos + Anima Blossom spawns autonomous damage without extra field time.',
      'Zero cycle generation keeps Nanally’s burst rhythm from stalling.',
      'Jiuyuan + Haniel double support makes the comp forgiving while you learn swaps.',
    ],
    tags: ['Anima', 'Blossom', 'Popular'],
    difficulty: 'medium',
  },
  {
    slug: 'chiz-cosmos-reactions',
    name: 'Chiz reaction stack',
    gameSlug,
    members: [
      { slug: 'chiz', compRole: 'Main DPS' },
      { slug: 'hathor', compRole: 'Lakshana' },
      { slug: 'jiuyuan', compRole: 'Heal' },
      { slug: 'haniel', compRole: 'Buff' },
    ],
    focus: 'Blossom + Remora + Charge',
    summary:
      'The most reaction-dense Cosmos lane: Chiz Grain scaling, Hathor Express Delivery stacks, and Jiuyuan grouping for mob content. Blossom, Remora, and Charge can all run in one rotation with Haniel rounding out buffs.',
    synergies: [
      'Cosmos + Lakshana Remora slows targets; Blossom + Remora Charge feeds Ultimate energy.',
      'Chiz Grain Market timing rewards players who commit to full on-field windows.',
      'Strong in Beyond the Rails and grouped enemy fights.',
    ],
    tags: ['Cosmos', 'Chiz', 'Reactions'],
    difficulty: 'medium',
  },
];

export function getTeamsByGame(slug: string): Team[] {
  return teams.filter((t) => t.gameSlug === slug);
}

export function getTeam(gameSlug: string, teamSlug: string): Team | undefined {
  return teams.find((t) => t.gameSlug === gameSlug && t.slug === teamSlug);
}
