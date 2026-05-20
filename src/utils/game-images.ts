/**
 * Game hub card image on home + /games.
 * Drop `public/images/games/{slug}/header.jpg` (16:10) and replace the file anytime —
 * no games.ts edit needed unless you override with `cardImage`.
 */
export function gameHeaderImagePath(slug: string): string {
  return `/images/games/${slug}/header.jpg`;
}
