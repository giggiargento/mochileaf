import type { Article } from '../types';
import { isGuideCategory, isNewsCategory } from '../utils/article-routes';

export const articles: Article[] = [
  {
    slug: 'lantern-festival-guide',
    title: 'Lantern Festival: A Cozy Walkthrough',
    excerpt:
      'Follow the firefly paths, unlock hidden tea houses, and collect every memory lantern without rushing.',
    category: 'guide',
    gameSlug: 'whisperwood',
    publishedAt: '2026-05-12',
    readTime: '8 min',
    featured: true,
    trending: true,
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
    slug: 'patch-1-4-notes',
    title: 'Patch 1.4 — Softer Nights & New Music',
    excerpt:
      'Ambient tracks at dusk, gentler weather transitions, and quality-of-life touches for peaceful sessions.',
    category: 'update',
    gameSlug: 'whisperwood',
    publishedAt: '2026-05-08',
    readTime: '4 min',
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
    slug: 'biolume-shores-map',
    title: 'Biolume Shores: Illustrated Map Notes',
    excerpt:
      'Hand-drawn landmarks, secret coves, and the quietest anchor spots for sunset sailing.',
    category: 'guide',
    gameSlug: 'moonlit-tides',
    publishedAt: '2026-05-03',
    readTime: '10 min',
    trending: true,
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
