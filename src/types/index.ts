export interface Game {
  slug: string;
  name: string;
  /** Short label in tight UI (e.g. sidebar on mobile). */
  shortName?: string;
  tagline: string;
  description: string;
  accent: 'sage' | 'blossom' | 'mist' | 'lavender' | 'honey';
  coverGradient: string;
  /** Hero / hub banner, e.g. /images/games/stardew-valley/cover.jpg */
  coverImage?: string;
  /** Optional override; default is /images/games/{slug}/header.jpg (16:10) */
  cardImage?: string;
  featured?: boolean;
  status: 'active' | 'coming-soon';
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: 'news' | 'guide' | 'editorial' | 'update';
  gameSlug?: string;
  publishedAt: string;
  readTime: string;
  featured?: boolean;
  trending?: boolean;
}

export interface Character {
  slug: string;
  name: string;
  role: string;
  element?: string;
  gameSlug: string;
  description: string;
  /** Portrait path under /public */
  image?: string;
  tier?: 'S' | 'A' | 'B' | 'C';
  rarity?: 'S' | 'A';
  /** ACNH — lower rank = more searched (1 is top). */
  popularRank?: number;
  personality?: string;
  species?: string;
  houseStyle?: string;
  houseDescription?: string;
}

export interface GameItem {
  slug: string;
  name: string;
  gameSlug: string;
  category: 'tool' | 'furniture' | 'diy' | 'clothing' | 'recipe' | 'other';
  summary: string;
  howToGet: string;
  image?: string;
}

export interface IslandTour {
  slug: string;
  title: string;
  gameSlug: string;
  /** YouTube video ID (watch?v=ID). */
  youtubeId: string;
  channel: string;
  summary: string;
  tags: string[];
}

export interface Team {
  slug: string;
  name: string;
  gameSlug: string;
  /** Character slugs in recommended order (main DPS first). */
  memberSlugs: string[];
  focus: string;
  summary: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Build {
  slug: string;
  name: string;
  characterSlug: string;
  gameSlug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  summary: string;
  tags: string[];
}

export interface Mod {
  slug: string;
  name: string;
  gameSlug: string;
  category: 'framework' | 'quality-of-life' | 'content' | 'visual';
  summary: string;
  tags: string[];
  /** Official download or project page (Nexus, SMAPI site, etc.) */
  url: string;
}

export interface TierMember {
  label: string;
  slug?: string;
}

export interface TierEntry {
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  members: TierMember[];
}

export interface Update {
  id: string;
  title: string;
  gameSlug?: string;
  /** When set, links to the canonical hub article URL. */
  articleSlug?: string;
  date: string;
  type: 'patch' | 'event' | 'content' | 'community';
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}
