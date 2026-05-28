import { allGames, getFeaturedGames, getGame, routableGames } from './registry';

export { allGames, routableGames, getGame, getFeaturedGames };

/** Active, validated hubs — safe for `getStaticPaths` and nav. */
export const games = routableGames;

export function getAllGames() {
  return allGames;
}
