import type { Game } from '../types';
import { defaultLocale, type Locale } from '../i18n/config';
import { t } from '../i18n/messages';

interface HubCopy {
  charactersTitle: string;
  charactersDescription: string;
  featuredSectionTitle: string;
  primaryCta: { label: string; path: string };
  secondaryCta: { label: string; path: string };
}

const gameHubKeys: Record<string, string> = {
  'animal-crossing-new-horizons': 'acnh',
  'neverness-to-everness': 'nte',
  'stardew-valley': 'stardew',
};

const hubPathsBySlug: Record<string, { primary: string; secondary: string }> = {
  'animal-crossing-new-horizons': { primary: 'houses', secondary: 'island-tours' },
  'neverness-to-everness': { primary: 'teams', secondary: 'guides' },
  'stardew-valley': { primary: 'guides', secondary: 'characters' },
};

const defaultPaths = { primary: 'guides', secondary: 'characters' };

function hubT(game: Game, key: string, locale: Locale): string {
  const id = gameHubKeys[game.slug] ?? 'default';
  return t(`hub.${id}.${key}`, locale);
}

export function getHubCopy(game: Game, locale: Locale = defaultLocale): HubCopy {
  const paths = hubPathsBySlug[game.slug] ?? defaultPaths;
  return {
    charactersTitle: hubT(game, 'charactersTitle', locale),
    charactersDescription: hubT(game, 'charactersDescription', locale),
    featuredSectionTitle: hubT(game, 'featuredSectionTitle', locale),
    primaryCta: {
      label: hubT(game, 'primaryCtaLabel', locale),
      path: paths.primary,
    },
    secondaryCta: {
      label: hubT(game, 'secondaryCtaLabel', locale),
      path: paths.secondary,
    },
  };
}

export function getCharactersPageTitle(game: Game, locale: Locale = defaultLocale): string {
  return getHubCopy(game, locale).charactersTitle;
}
