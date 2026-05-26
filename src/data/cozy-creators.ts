import type { CozyCreator } from '../types';
import liveCreators from './live/cozy-creators.json';

type CreatorSource = {
  slug: string;
  /** Instagram username without @ */
  instagram: string;
  nameFallback: string;
  linkLabel?: string;
  accent?: CozyCreator['accent'];
  featured?: boolean;
};

/** Static config; run `npm run creators:sync` to refresh photo + bio from Instagram. */
const SOURCES: CreatorSource[] = [
  {
    slug: 'giggiland',
    instagram: 'giggiland',
    nameFallback: 'Giggiland',
    linkLabel: 'Follow on Instagram',
    accent: 'sage',
    featured: true,
  },
  {
    slug: 'cozyquartzz',
    instagram: 'cozyquartzz',
    nameFallback: 'Cozy Quartzz',
    linkLabel: 'Follow on Instagram',
    accent: 'blossom',
  },
];

type LiveEntry = {
  handle?: string;
  name?: string;
  bio?: string;
  image?: string;
  profilePicUrl?: string;
  error?: string;
};

function mergeCreator(source: CreatorSource): CozyCreator {
  const live = (liveCreators.creators as Record<string, LiveEntry>)[source.slug];
  const hasLive = live && !live.error;
  const handle = (hasLive && live.handle ? live.handle : source.instagram).replace(/^@/, '');
  const bio = hasLive && live.bio?.trim() ? live.bio.trim() : '';
  const remoteImage = hasLive ? live.profilePicUrl : undefined;
  const localImage = live?.image ?? `/images/creators/${source.slug}.jpg`;

  return {
    slug: source.slug,
    name: hasLive && live.name ? live.name : source.nameFallback,
    handle,
    bio,
    url: `https://www.instagram.com/${handle}/`,
    image: hasLive && live.image ? live.image : remoteImage ?? localImage,
    linkLabel: source.linkLabel,
    accent: source.accent,
    featured: source.featured,
  };
}

export const cozyCreators: CozyCreator[] = SOURCES.map(mergeCreator);

export function getFeaturedCozyCreators(): CozyCreator[] {
  return cozyCreators.filter((c) => c.featured);
}

export function getCozyCreatorsSorted(): CozyCreator[] {
  return [...cozyCreators].sort((a, b) => a.name.localeCompare(b.name));
}

export const cozyCreatorsLastSynced = liveCreators.updatedAt;
