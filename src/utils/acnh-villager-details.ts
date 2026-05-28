import type { AcnhVillagerDetails } from '../types';
import { getCharacterBySlug } from '../lib/content/characters';

export function getAcnhVillagerDetails(slug: string): AcnhVillagerDetails | undefined {
  const character = getCharacterBySlug(slug);
  if (!character?.acnh) return undefined;
  return character.acnh as AcnhVillagerDetails;
}
