import cache from '../data/live/cache.json';

export interface LiveSource {
  title: string;
  url: string;
  snippet: string;
}

export interface LiveFeed {
  label: string;
  summary: string;
  sources: LiveSource[];
}

type LiveCache = {
  updatedAt: string | null;
  feeds: Record<string, Record<string, LiveFeed>>;
};

const data = cache as LiveCache;

export function getLiveFeedsForGame(gameSlug: string): LiveFeed[] {
  const gameFeeds = data.feeds[gameSlug];
  if (!gameFeeds) return [];
  return Object.values(gameFeeds);
}

export function getLiveUpdatedAt(): string | null {
  return data.updatedAt;
}

export function hasLiveContent(gameSlug: string): boolean {
  return getLiveFeedsForGame(gameSlug).length > 0;
}
