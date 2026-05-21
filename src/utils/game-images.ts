/**
 * Legacy public URLs for game cards / banners.
 * Prefer `src/assets/games/{slug}/` + `src/data/game-assets.ts` + `<CozyImage />` (WebP, responsive).
 */
export function gameHeaderImagePath(slug: string): string {
  return `/images/games/${slug}/header.jpg`;
}
