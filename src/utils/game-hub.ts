import type { Game } from '../types';

interface HubCopy {
  charactersTitle: string;
  charactersDescription: string;
  featuredSectionTitle: string;
  primaryCta: { label: string; path: string };
  secondaryCta: { label: string; path: string };
}

const hubCopyBySlug: Record<string, HubCopy> = {
  'stardew-valley': {
    charactersTitle: 'Villagers',
    charactersDescription:
      'Meet the people of Pelican Town — gifts, schedules, and heart events at a calm, readable pace.',
    featuredSectionTitle: 'Featured villagers',
    primaryCta: { label: 'Browse guides', path: 'guides' },
    secondaryCta: { label: 'Meet villagers', path: 'characters' },
  },
};

const defaultCopy: HubCopy = {
  charactersTitle: 'Characters',
  charactersDescription: 'Discover every companion, their roles, and cozy lore snippets.',
  featuredSectionTitle: 'Featured characters',
  primaryCta: { label: 'Browse guides', path: 'guides' },
  secondaryCta: { label: 'Meet characters', path: 'characters' },
};

export function getHubCopy(game: Game): HubCopy {
  return hubCopyBySlug[game.slug] ?? defaultCopy;
}

export function getCharactersPageTitle(game: Game): string {
  return getHubCopy(game).charactersTitle;
}
