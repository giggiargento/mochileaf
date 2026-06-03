import type { Character } from '../types';

export function getAcnhVillagerSpecies(villagers: Character[]): string[] {
  const species = new Set(
    villagers.map((v) => v.species).filter((s): s is string => Boolean(s)),
  );
  return [...species].sort((a, b) => a.localeCompare(b, 'en'));
}

/** Lowercase blob for client-side search (name, slug, role, tags). */
export function villagerSearchBlob(character: Character): string {
  return [
    character.slug,
    character.name,
    character.role,
    character.personality,
    character.species,
    character.description,
    ...(character.tags ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}
