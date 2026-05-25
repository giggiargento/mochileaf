import fs from 'node:fs';
import path from 'node:path';

const PUBLIC_GAMES = path.join(process.cwd(), 'public', 'images', 'games');

const CARD_FILES = ['card.jpg', 'cover.jpg', 'header.jpg', 'header.png'] as const;

const COVER_FILES = ['cover.jpg', 'header.jpg', 'card.jpg', 'header.png'] as const;

function firstExistingPublic(slug: string, files: readonly string[]): string | undefined {
  const dir = path.join(PUBLIC_GAMES, slug);
  if (!fs.existsSync(dir)) return undefined;
  for (const file of files) {
    if (fs.existsSync(path.join(dir, file))) {
      return `/images/games/${slug}/${file}`;
    }
  }
  return undefined;
}

/** Stable URL for home / games cards (avoids /_astro hashes breaking on View Transitions). */
export function gameCardImagePath(slug: string): string | undefined {
  return firstExistingPublic(slug, CARD_FILES);
}

/** Hub hero / legacy banner in public/. */
export function gameHeaderImagePath(slug: string): string | undefined {
  return firstExistingPublic(slug, COVER_FILES);
}
