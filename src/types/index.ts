export interface ContentSeo {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string[];
}

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
  /** Optional editorial + SEO fields (from content/games/*.json). */
  seo?: ContentSeo;
  genres?: string[];
  platforms?: string[];
  cozyMechanics?: string[];
  similarGames?: string[];
  beginnerTips?: string[];
  tags?: string[];
  about?: string;
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
  seo?: ContentSeo;
  likes?: string[];
  dislikes?: string[];
  favoriteGifts?: string[];
  favoriteFoods?: string[];
  routines?: { label: string; location: string; time?: string }[];
  relationships?: { name: string; note: string }[];
  trivia?: string[];
  tags?: string[];
  /** ACNH extended reference blocks (content/characters/*.json). */
  acnh?: AcnhVillagerDetails;
}

export interface NteBuildItem {
  name: string;
  note?: string;
  /** Optional local asset path under /public. */
  image?: string;
}

export interface NteFarmingItem {
  name: string;
  purpose: string;
  /** Where to farm it in-game (mode, anomaly, shop, etc.). */
  location: string;
  /** Optional route tip for faster daily farming. */
  tip?: string;
  image?: string;
}

export interface NteSkillPriorityItem {
  skill: string;
  /** What improves when this skill is leveled. */
  scales: string;
}

export interface NteCharacterGuide {
  buildSummary: string;
  diskSets: NteBuildItem[];
  modules: NteBuildItem[];
  skillPriority: NteSkillPriorityItem[];
  farming: NteFarmingItem[];
}

/** New Horizons villager reference data (from Nookipedia import). */
export interface AcnhVillagerDetails {
  intro?: string;
  appearance?: string;
  personality?: string;
  villagerInfo: {
    birthday?: string;
    starSign?: string;
    personality?: string;
    subPersonality?: string;
    catchphrase?: string;
    quote?: string;
    gender?: string;
    defaultClothing?: string;
    umbrella?: string;
    hobby?: string;
    favoriteStyles?: string[];
    favoriteColors?: string[];
    bag?: string;
    food?: string;
    drink?: string;
  };
  house: {
    roof?: string;
    siding?: string;
    door?: string;
    wallpaper?: string;
    flooring?: string;
    music?: string;
    musicNote?: string;
    furniture?: string[];
    exteriorImage?: string;
    interiorImage?: string;
  };
  languages: {
    language: string;
    name: string;
    romanization?: string;
  }[];
  amiibo?: {
    number: string;
    series?: string;
    starSign?: string;
    birthday?: string;
    image?: string;
  };
  sourceUrl?: string;
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

export interface TeamMemberSlot {
  slug: string;
  /** Squad role on the comp card (e.g. "Main DPS"). */
  compRole: string;
}

export interface Team {
  slug: string;
  name: string;
  gameSlug: string;
  /** Roster in recommended slot order (main carry first). */
  members: TeamMemberSlot[];
  focus: string;
  summary: string;
  /** Passive/element/faction synergies activated by this lineup. */
  synergies: string[];
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

/** Cozy Creators — featured collaborators (external pages). */
export interface CozyCreator {
  slug: string;
  name: string;
  /** Display handle, with or without @ (e.g. giggiland). */
  handle: string;
  bio: string;
  /** Creator page (Beacons, YouTube channel, site, etc.) */
  url: string;
  /** Profile photo under public/, e.g. /images/creators/giggiland.jpg */
  image?: string;
  /** CTA on the card, e.g. "Follow on Instagram". */
  linkLabel?: string;
  accent?: Game['accent'];
  featured?: boolean;
}

/** ACNH interior decor inspiration (local image + optional Pinterest source). */
export interface DecorInspiration {
  id: string;
  title: string;
  /** e.g. cottagecore, minimalist loft */
  style?: string;
  /** Path under public/, e.g. /images/games/.../inspiration/01.webp */
  image: string;
  /** Original pin URL for credit */
  sourceUrl?: string;
}
