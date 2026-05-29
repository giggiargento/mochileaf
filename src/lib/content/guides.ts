import type { Character, NteCharacterGuide } from '../../types';
import { defaultLocale, type Locale } from '../../i18n/config';
import { displayText } from '../../content/schemas/shared';
import { localizeNteGuide } from '../i18n/content';
import {
  getGuideByCharacterSlug,
  getGuideDefaultsForRole,
  routableGuides,
} from './registry';

export { routableGuides };

export function getGuideForCharacter(
  character: Character,
  locale: Locale = defaultLocale,
): NteCharacterGuide | undefined {
  const gameSlug = 'neverness-to-everness';
  if (character.gameSlug !== gameSlug) return undefined;

  const custom = getGuideByCharacterSlug(character.slug);
  const defaults = getGuideDefaultsForRole(character.role);

  if (!custom && !defaults) return undefined;

  const buildSummary =
    custom?.buildSummary ??
    `${character.name} works best in ${character.element ?? 'team'}-aligned comps where ${character.role.toLowerCase()} value is prioritized.`;

  const guide: NteCharacterGuide = {
    buildSummary: displayText(buildSummary, buildSummary),
    diskSets: custom?.diskSets ?? defaults!.diskSets,
    modules: custom?.modules ?? defaults!.modules,
    skillPriority: custom?.skillPriority ?? defaults!.skillPriority,
    farming: custom?.farming ?? defaults!.farming,
  };

  return locale === defaultLocale ? guide : localizeNteGuide(guide, character.slug, locale);
}

export function getNteCharacterGuide(
  character: Character,
  locale: Locale = defaultLocale,
): NteCharacterGuide | undefined {
  return getGuideForCharacter(character, locale);
}
