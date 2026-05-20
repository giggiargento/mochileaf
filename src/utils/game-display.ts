import type { Game } from '../types';

export function getGameDisplayName(game: Game, variant: 'short' | 'full' = 'full'): string {
  if (variant === 'short' && game.shortName) return game.shortName;
  return game.name;
}
