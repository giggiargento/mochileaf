import type { Build } from '../types';

export const builds: Build[] = [];

export function getBuildsByGame(gameSlug: string): Build[] {
  return builds.filter((b) => b.gameSlug === gameSlug);
}
