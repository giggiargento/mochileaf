import type { GameItem } from '../types';

const gameSlug = 'animal-crossing-new-horizons';
const img = (slug: string) =>
  `/images/games/animal-crossing-new-horizons/items/${slug}.png`;

export const acnhItems: GameItem[] = [
  {
    slug: 'ladder',
    name: 'Ladder',
    gameSlug,
    category: 'tool',
    summary: 'Unlocks higher cliffs — essential for island sculpting after the first ridge.',
    howToGet: 'Craft after Tom Nook prompts infrastructure; recipe from Ladder DIY.',
    image: img('ladder'),
  },
  {
    slug: 'vaulting-pole',
    name: 'Vaulting Pole',
    gameSlug,
    category: 'tool',
    summary: 'Hop rivers without bridges — your first freedom tool on day one.',
    howToGet: 'Blathers quest after museum donation kickoff; recipe from Tom Nook.',
    image: img('vaulting-pole'),
  },
  {
    slug: 'golden-tool-diy',
    name: 'Golden Tool recipes',
    gameSlug,
    category: 'diy',
    summary: 'Long-lasting tools for dedicated daily players — one break-in per type.',
    howToGet: 'Hit milestones (fishing, bugs, trees) to receive recipe mail from the game.',
    image: img('golden-tool-diy'),
  },
  {
    slug: 'kitchen-diy',
    name: 'Ironwood Kitchen DIY set',
    gameSlug,
    category: 'furniture',
    summary: 'Clean kitchen line that anchors diner, cafe, and bakery room tours.',
    howToGet: 'Message bottles, villager gifts, and balloon pops — patience or trading.',
    image: img('kitchen-diy'),
  },
  {
    slug: 'harp',
    name: 'Grand piano & harp',
    gameSlug,
    category: 'furniture',
    summary: 'Music-room staples for five-star interiors and concert core islands.',
    howToGet: 'Catalog from villagers or Nook Shopping when available; harp from Julian’s vibe.',
    image: img('harp'),
  },
  {
    slug: 'moon-diy',
    name: 'Crescent moon DIY',
    gameSlug,
    category: 'diy',
    summary: 'Dreamy night-sky piece — star fragment economy favorite.',
    howToGet: 'Celeste visits on clear nights; trade spare fragments with friends.',
    image: img('moon-diy'),
  },
  {
    slug: 'royal-crown',
    name: 'Royal crown',
    gameSlug,
    category: 'clothing',
    summary: 'Bell flex item and photo-op prop — not required for progress, ever.',
    howToGet: 'Able Sisters when it appears in the premium slot (very expensive).',
    image: img('royal-crown'),
  },
  {
    slug: 'turnips',
    name: 'Turnips',
    gameSlug,
    category: 'other',
    summary: 'Sunday-morning stalk market — community trading and island visits.',
    howToGet: 'Buy from Daisy Mae before noon on Sundays; sell at Nook’s Cranny.',
    image: img('turnips'),
  },
];

export function getItemsByGame(slug: string): GameItem[] {
  return acnhItems.filter((i) => i.gameSlug === slug);
}
