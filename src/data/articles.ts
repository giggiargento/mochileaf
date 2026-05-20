import type { Article } from '../types';
import { isGuideCategory, isNewsCategory } from '../utils/article-routes';

export const articles: Article[] = [
  {
    slug: 'acnh-island-setup-beginner',
    title: 'ACNH Island Setup for New Mayors',
    excerpt:
      'Resident Services, first bridges, and where to place homes — a calm first week without terraform regret.',
    category: 'guide',
    gameSlug: 'animal-crossing-new-horizons',
    publishedAt: '2026-05-19',
    readTime: '9 min',
    featured: true,
    trending: true,
  },
  {
    slug: 'acnh-villager-hunting-tips',
    title: 'Finding Villagers You Actually Want',
    excerpt:
      'Mystery islands, amiibo camps, and patience — how to hunt Raymond (or your cozy favorite) without burnout.',
    category: 'guide',
    gameSlug: 'animal-crossing-new-horizons',
    publishedAt: '2026-05-18',
    readTime: '7 min',
    featured: true,
  },
  {
    slug: 'acnh-five-star-island-tips',
    title: 'Five-Star Island Tips (Without Stress)',
    excerpt:
      'Flow, fencing, and clutter control — what Isabelle actually checks, explained in plain language.',
    category: 'guide',
    gameSlug: 'animal-crossing-new-horizons',
    publishedAt: '2026-05-17',
    readTime: '6 min',
    trending: true,
  },
  {
    slug: 'acnh-hub-welcome',
    title: 'ACNH Hub on Mochileaf',
    excerpt:
      'Villager tabs, home styles, items, and YouTube island tours — your cozy Animal Crossing corner.',
    category: 'news',
    gameSlug: 'animal-crossing-new-horizons',
    publishedAt: '2026-05-19',
    readTime: '2 min',
  },
  {
    slug: 'stardew-valley-year-one-guide',
    title: 'Stardew Valley Year One: A Calm Starter Route',
    excerpt:
      'Spring crops, early mining, and community center basics — a relaxed first year without min-max stress.',
    category: 'guide',
    gameSlug: 'stardew-valley',
    publishedAt: '2026-05-10',
    readTime: '9 min',
    featured: true,
    trending: true,
  },
  {
    slug: 'stardew-community-center-bundles',
    title: 'Community Center Bundles Explained',
    excerpt:
      'Room-by-room bundle priorities, seasonal deadlines, and what to stash before you turn in your first items.',
    category: 'guide',
    gameSlug: 'stardew-valley',
    publishedAt: '2026-04-28',
    readTime: '11 min',
    featured: true,
  },
  {
    slug: 'stardew-spring-crops-profit',
    title: 'Best Spring Crops for Your First Season',
    excerpt:
      'Potatoes, strawberries, and cauliflower compared — gold per day, seed costs, and low-effort layouts for new farmers.',
    category: 'guide',
    gameSlug: 'stardew-valley',
    publishedAt: '2026-04-15',
    readTime: '7 min',
    trending: true,
  },
  {
    slug: 'cozy-gaming-rituals',
    title: 'Building a Cozy Gaming Ritual',
    excerpt:
      'Tea, warm light, and intentional pacing — how editorial calm can transform your play sessions.',
    category: 'editorial',
    publishedAt: '2026-05-05',
    readTime: '5 min',
    featured: true,
  },
  {
    slug: 'nte-beginner-guide',
    title: 'Neverness to Everness Beginner Guide',
    excerpt:
      'Esper cycles, stamina priorities, and your first team — a calm route through the opening hours without reroll anxiety.',
    category: 'guide',
    gameSlug: 'neverness-to-everness',
    publishedAt: '2026-05-18',
    readTime: '10 min',
    featured: true,
    trending: true,
  },
  {
    slug: 'nte-redeem-codes',
    title: 'NTE Redeem Codes (Working List)',
    excerpt:
      'Where to paste codes in-game, what rewards to expect, and how often to check back when new campaigns drop.',
    category: 'guide',
    gameSlug: 'neverness-to-everness',
    publishedAt: '2026-05-17',
    readTime: '4 min',
    trending: true,
  },
  {
    slug: 'nte-daily-routine',
    title: 'NTE Daily & Weekly Routine',
    excerpt:
      'A checklist for resin, City Tycoon, anomalies, and events — finish the essentials in under thirty minutes when you are busy.',
    category: 'guide',
    gameSlug: 'neverness-to-everness',
    publishedAt: '2026-05-16',
    readTime: '7 min',
    featured: true,
  },
  {
    slug: 'nte-city-tycoon-chiz',
    title: 'City Tycoon & Free S-Rank Chiz',
    excerpt:
      'How the Grain Market ties into Chiz, why the free S-rank matters for F2P, and a light weekly rhythm for city upgrades.',
    category: 'guide',
    gameSlug: 'neverness-to-everness',
    publishedAt: '2026-05-15',
    readTime: '8 min',
  },
  {
    slug: 'nte-f2p-friendly',
    title: 'How F2P Friendly Is NTE?',
    excerpt:
      'Pull pacing, Chiz from City Tycoon, and where premium value actually shows up — honest notes for budget players.',
    category: 'guide',
    gameSlug: 'neverness-to-everness',
    publishedAt: '2026-05-14',
    readTime: '6 min',
  },
  {
    slug: 'nte-element-esper-cycle',
    title: 'Elements & the Esper Cycle',
    excerpt:
      'Cosmos, Anima, Incantation, Chaos, Psyche, and Lakshana — what they mean for team building and reactions.',
    category: 'guide',
    gameSlug: 'neverness-to-everness',
    publishedAt: '2026-05-13',
    readTime: '9 min',
  },
  {
    slug: 'nte-gacha-pity',
    title: 'Gacha, Banners & Pity (Overview)',
    excerpt:
      'Soft pity, hard pity, and event banners explained in plain language — no pressure to pull day one.',
    category: 'guide',
    gameSlug: 'neverness-to-everness',
    publishedAt: '2026-05-12',
    readTime: '5 min',
  },
  {
    slug: 'nte-tier-list-notes',
    title: 'NTE Tier List — How We Rank',
    excerpt:
      'Our cozy tier list focuses on story comfort and F2P value, not whale speedruns. Read before you reshuffle your roster.',
    category: 'update',
    gameSlug: 'neverness-to-everness',
    publishedAt: '2026-05-11',
    readTime: '3 min',
  },
  {
    slug: 'nte-launch-welcome',
    title: 'NTE Hub Is Live on Mochileaf',
    excerpt:
      'Characters, team comps, and starter guides for Neverness to Everness — more builds and tools coming over time.',
    category: 'news',
    gameSlug: 'neverness-to-everness',
    publishedAt: '2026-05-19',
    readTime: '2 min',
    featured: true,
  },
  {
    slug: 'community-tea-gathering',
    title: 'Community Tea Gathering — Recap',
    excerpt:
      'Screenshots, fan art, and heartwarming stories from our first virtual tea party event.',
    category: 'news',
    publishedAt: '2026-05-01',
    readTime: '3 min',
  },
];

export function getFeaturedArticles(): Article[] {
  return articles.filter((a) => a.featured).slice(0, 4);
}

export function getTrendingArticles(): Article[] {
  return articles.filter((a) => a.trending);
}

export function getArticlesByGame(gameSlug: string): Article[] {
  return articles.filter((a) => a.gameSlug === gameSlug);
}

export function getNewsByGame(gameSlug: string): Article[] {
  return getArticlesByGame(gameSlug).filter((a) => isNewsCategory(a.category));
}

export function getGuidesByGame(gameSlug: string): Article[] {
  return getArticlesByGame(gameSlug).filter((a) => isGuideCategory(a.category));
}
