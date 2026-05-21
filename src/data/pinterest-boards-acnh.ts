/**
 * Public Pinterest boards by Giggi — import with:
 *   npm run inspiration:import -- homes <url>
 *   npm run inspiration:import -- character <slug> <url>
 */
export const acnhPinterestBoards = {
  homes: "https://ar.pinterest.com/giggiland/animal-crosing-homes/",
  raymond: "https://ar.pinterest.com/giggiland/animal-crosing-raymond/",
} as const;

export type AcnhPinterestBoardKey = keyof typeof acnhPinterestBoards;
