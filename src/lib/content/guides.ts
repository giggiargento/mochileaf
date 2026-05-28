import type { Character, NteCharacterGuide } from '../../types';
import { displayText } from '../../content/schemas/shared';
import {
  getGuideByCharacterSlug,
  getGuideDefaultsForRole,
  routableGuides,
} from './registry';

export function getGuideForCharacter(character: Character): NteCharacterGuide | undefined {
  const gameSlug = 'neverness-to-everness';
  if (character.gameSlug !== gameSlug) return undefined;

  const custom = getGuideByCharacterSlug(character.slug);
  const defaults = getGuideDefaultsForRole(character.role);

  if (!custom && !defaults) return undefined;

  const buildSummary =
    custom?.buildSummary ??
    `${character.name} works best in ${character.element ?? 'team'}-aligned comps where ${character.role.toLowerCase()} value is prioritized.`;

  return {
    buildSummary: displayText(buildSummary, buildSummary),
    diskSets: custom?.diskSets ?? defaults!.diskSets,
    modules: custom?.modules ?? defaults!.modules,
    skillPriority: custom?.skillPriority ?? defaults!.skillPriority,
    farming: custom?.farming ?? defaults!.farming,
  };
}

export function getNteCharacterGuide(character: Character): NteCharacterGuide | undefined {
  return getGuideForCharacter(character);
}

export { routableGuides };
