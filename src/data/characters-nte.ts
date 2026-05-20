import type { Character } from '../types';

const gameSlug = 'neverness-to-everness';
const img = (slug: string) => `/images/games/neverness-to-everness/characters/${slug}.webp`;

/** S-rank roster for the NTE hub (fan summaries; not copied from external wikis). */
export const nteCharacters: Character[] = [
  {
    slug: 'nanally',
    name: 'Nanally',
    role: 'Support',
    element: 'Anima',
    rarity: 'S',
    tier: 'S',
    gameSlug,
    image: img('nanally'),
    description:
      'A steady Anima support who keeps the party safe while reactions stay active — strong in teams that want healing without sacrificing damage uptime.',
  },
  {
    slug: 'sakiri',
    name: 'Sakiri',
    role: 'Attack',
    element: 'Incantation',
    rarity: 'S',
    tier: 'S',
    gameSlug,
    image: img('sakiri'),
    description:
      'Incantation DPS with crisp skill cycles. Pairs well with buffers who amplify Incantation damage and crit consistency.',
  },
  {
    slug: 'fadia',
    name: 'Fadia',
    role: 'Support',
    element: 'Psyche',
    rarity: 'S',
    tier: 'A',
    gameSlug,
    image: img('fadia'),
    description:
      'Psyche support tied to ETD-4 story beats. Excellent when you want shields, setup, and synergy with Baicang-led defensive lines.',
  },
  {
    slug: 'baicang',
    name: 'Baicang',
    role: 'Defense',
    element: 'Incantation',
    rarity: 'S',
    tier: 'S',
    gameSlug,
    image: img('baicang'),
    description:
      'Word Spirit defenses and Incantation scaling make Baicang a premier Turbid Burn anchor — often paired with Daffodil for break-focused comps.',
  },
  {
    slug: 'zero-male',
    name: 'Zero (M)',
    role: 'Attack',
    element: 'Cosmos',
    rarity: 'S',
    tier: 'B',
    gameSlug,
    image: img('zero-male'),
    description:
      'Cosmos burst damage with straightforward rotations. A flexible pick when you need a second DPS in Cosmos-heavy teams.',
  },
  {
    slug: 'zero-female',
    name: 'Zero (F)',
    role: 'Attack',
    element: 'Cosmos',
    rarity: 'S',
    tier: 'A',
    gameSlug,
    image: img('zero-female'),
    description:
      'Another Cosmos carry with strong burst windows. Works in double-Cosmos setups with Hotori or Xun for elemental consistency.',
  },
  {
    slug: 'hotori',
    name: 'Hotori',
    role: 'Attack',
    element: 'Cosmos',
    rarity: 'S',
    tier: 'A',
    gameSlug,
    image: img('hotori'),
    description:
      'Reliable Cosmos DPS for mid-game accounts. Friendly kit for players learning Esper cycles and team energy management.',
  },
  {
    slug: 'daffodil',
    name: 'Daffodil',
    role: 'Support',
    element: 'Chaos',
    rarity: 'S',
    tier: 'S',
    gameSlug,
    image: img('daffodil'),
    description:
      'Core Break and Turbid Burn enabler. Awakening spikes team damage — a high-value sub-DPS/support in meta Turbid teams.',
  },
  {
    slug: 'jiuyuan',
    name: 'Jiuyuan',
    role: 'Support',
    element: 'Anima',
    rarity: 'S',
    tier: 'A',
    gameSlug,
    image: img('jiuyuan'),
    description:
      'Anima support with strong party utility. Great second slot when Nanally is booked elsewhere or you want double-Anima stability.',
  },
  {
    slug: 'haniel',
    name: 'Haniel',
    role: 'Assist',
    element: 'Lakshana',
    rarity: 'A',
    tier: 'B',
    gameSlug,
    image: img('haniel'),
    description:
      'Lakshana assist who shines in longer fights. Worth raising if you already invested in Lakshana-heavy reaction teams.',
  },
  {
    slug: 'adler',
    name: 'Adler',
    role: 'Defense',
    element: 'Chaos',
    rarity: 'A',
    tier: 'C',
    gameSlug,
    image: img('adler'),
    description:
      'Chaos defense option for niche content. Solid filler until you pull a top-tier defensive S-rank.',
  },
  {
    slug: 'skia',
    name: 'Skia',
    role: 'Attack',
    element: 'Incantation',
    rarity: 'A',
    tier: 'C',
    gameSlug,
    image: img('skia'),
    description:
      'Incantation attacker with ETD-4 flavor. Fun alongside Baicang and Fadia when building theme teams over pure meta.',
  },
  {
    slug: 'edgar',
    name: 'Edgar',
    role: 'Attack',
    element: 'Psyche',
    rarity: 'A',
    tier: 'C',
    gameSlug,
    image: img('edgar'),
    description:
      'Psyche DPS for early roster filling. Replace over time as S-rank DPS units join your main teams.',
  },
  {
    slug: 'mint',
    name: 'Mint',
    role: 'Assist',
    element: 'Cosmos',
    rarity: 'A',
    tier: 'C',
    gameSlug,
    image: img('mint'),
    description:
      'Cosmos assist with utility buffs. Helpful in exploration and co-op until dedicated supports are leveled.',
  },
  {
    slug: 'hathor',
    name: 'Hathor',
    role: 'Support',
    element: 'Lakshana',
    rarity: 'S',
    tier: 'A',
    gameSlug,
    image: img('hathor'),
    description:
      'Lakshana support with strong defensive tools. Excellent in content that punishes squishy teams.',
  },
  {
    slug: 'chiz',
    name: 'Chiz',
    role: 'Attack',
    element: 'Cosmos',
    rarity: 'S',
    tier: 'S',
    gameSlug,
    image: img('chiz'),
    description:
      'Free S-rank DPS from City Tycoon — full awakenings without gacha. Grain Market mechanics reward patient play and daily city check-ins.',
  },
  {
    slug: 'aurelia',
    name: 'Aurelia',
    role: 'Defense',
    element: 'Anima',
    rarity: 'A',
    tier: 'B',
    gameSlug,
    image: img('aurelia'),
    description:
      'Anima defender who bridges early and mid game. Pairs with Jiuyuan or Nanally for comfortable Anima resonance lines.',
  },
  {
    slug: 'xun',
    name: 'Xun',
    role: 'Attack',
    element: 'Cosmos',
    rarity: 'S',
    tier: 'B',
    gameSlug,
    image: img('xun'),
    description:
      'Cosmos attacker with steady output. A good third slot when Hotori or Zero leads damage.',
  },
];
