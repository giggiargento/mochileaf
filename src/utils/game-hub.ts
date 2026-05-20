import type { Game } from '../types';

interface HubCopy {
  charactersTitle: string;
  charactersDescription: string;
  featuredSectionTitle: string;
  primaryCta: { label: string; path: string };
  secondaryCta: { label: string; path: string };
}

const hubCopyBySlug: Record<string, HubCopy> = {
  'animal-crossing-new-horizons': {
    charactersTitle: 'Villagers',
    charactersDescription:
      'Most searched neighbors plus more fan favorites — personality, species, and who to invite next.',
    featuredSectionTitle: 'Popular villagers',
    primaryCta: { label: 'Villager homes', path: 'houses' },
    secondaryCta: { label: 'Island tours', path: 'island-tours' },
  },
  'neverness-to-everness': {
    charactersTitle: 'Characters',
    charactersDescription:
      'S-rank and standout A-ranks — roles, elements, and short bios to pick your next favorite without wiki overload.',
    featuredSectionTitle: 'Featured characters',
    primaryCta: { label: 'Team comps', path: 'teams' },
    secondaryCta: { label: 'Browse guides', path: 'guides' },
  },
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
