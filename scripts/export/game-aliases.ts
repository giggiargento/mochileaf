/** Short CLI aliases → canonical gameSlug in content files. */
export const GAME_ALIASES: Record<string, string> = {
  acnh: 'animal-crossing-new-horizons',
  'animal-crossing-new-horizons': 'animal-crossing-new-horizons',
  stardew: 'stardew-valley',
  'stardew-valley': 'stardew-valley',
  nte: 'neverness-to-everness',
  'neverness-to-everness': 'neverness-to-everness',
};

export function resolveGameSlug(input: string): string {
  const key = input.trim().toLowerCase();
  const resolved = GAME_ALIASES[key];
  if (!resolved) {
    throw new Error(
      `Unknown game "${input}". Use: ${[...new Set(Object.keys(GAME_ALIASES))].join(', ')}`,
    );
  }
  return resolved;
}

export function shortLabel(gameSlug: string): string {
  const entry = Object.entries(GAME_ALIASES).find(([, slug]) => slug === gameSlug);
  if (entry && entry[0].length <= 8 && !entry[0].includes('-')) return entry[0];
  return gameSlug;
}
