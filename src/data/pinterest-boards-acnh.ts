/**
 * Public Pinterest boards by Giggi — import with:
 *   npm run inspiration:import -- homes <url>
 *   npm run inspiration:import -- character <slug> <url>
 */
export const acnhPinterestBoards = {
  homes: "https://ar.pinterest.com/giggiland/animal-crosing-homes/",
  raymond: "https://ar.pinterest.com/giggiland/animal-crosing-raymond/",
  molly: "https://ar.pinterest.com/giggiland/animal-crossing-molly/",
  bea: "https://ar.pinterest.com/giggiland/animal-crossing-bea/",
  maple: "https://ar.pinterest.com/giggiland/animal-crossing-maple/",
  lolly: "https://ar.pinterest.com/giggiland/animal-crossing-lolly/",
  fauna: "https://ar.pinterest.com/giggiland/animal-crossing-fauna/",
  poppy: "https://ar.pinterest.com/giggiland/animal-crossing-poppy/",
  marshal: "https://ar.pinterest.com/giggiland/animal-crossing-marshall/",
} as const;

export type AcnhPinterestBoardKey = keyof typeof acnhPinterestBoards;
